
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { getStudentProfileData, getAcademicJournalLog, getKegiatanForStudent, getClasses, updateStudent, getSubjects, Student, Class as AppClass, Subject, SavingTransaction } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, Briefcase, Activity, User, ArrowLeft, BadgePercent, Wallet, BookCopy, Star, StickyNote, Calendar as CalendarIcon, UserCircle, MapPin, HeartPulse, Edit, Loader2, Atom, BookHeart, BookOpen, BookOpenCheck, BrainCircuit, Drama, FunctionSquare, Languages, BookText } from "lucide-react";
import Image from "next/image";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type StudentProfile = Student & {
    className: string;
    attendance: { present: number; late: number; sick: number; excused: number };
    savings: {
        balance: number;
        deposits: SavingTransaction[];
        withdrawals: SavingTransaction[];
    }
}

type EditableProfile = Partial<Pick<Student, "fullName" | "nickname" | "nisn" | "classId">>;

const subjectIcons: { [key: string]: React.ElementType } = {
  "IPA": Atom,
  "IPSKn": Drama,
  "IoT": BrainCircuit,
  "MFM": FunctionSquare,
  "B. Indonesia": BookText,
  "B. Jawa": Languages,
  "B. Inggris": Languages,
  "Minhaj": BookHeart,
  "Al-Qur'an & Tajwid": BookOpen,
  "Quran Tematik": BookOpenCheck
};

const subjectColors: { [key: string]: string } = {
  "IPA": "text-green-500",
  "IPSKn": "text-red-500",
  "IoT": "text-blue-500",
  "MFM": "text-purple-500",
  "B. Indonesia": "text-orange-500",
  "B. Jawa": "text-yellow-600",
  "B. Inggris": "text-pink-500",
  "Minhaj": "text-indigo-500",
  "Al-Qur'an & Tajwid": "text-teal-500",
  "Quran Tematik": "text-cyan-500"
};

export default function StudentDetailPage({ params }: { params: { studentId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const studentId = decodeURIComponent(params.studentId);
  
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<EditableProfile>({});
  const [isSaving, setIsSaving] = useState(false);
  const [academicData, setAcademicData] = useState<any>({ subjects: [] });
  const [studentKegiatanData, setStudentKegiatanData] = useState<any>({ history: [], personalNotes: [] });
  const [allClasses, setAllClasses] = useState<AppClass[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
        const profileData = await getStudentProfileData(studentId);
        if (!profileData) {
            toast({ title: "Siswa tidak ditemukan", variant: "destructive" });
            router.push('/facilitator/students');
            return;
        }
        setStudentProfile(profileData as StudentProfile);
        setEditedProfile({
            fullName: profileData.fullName,
            nickname: profileData.nickname,
            nisn: profileData.nisn,
            classId: profileData.classId
        });

        const [academicLog, stimulationLog, classesData, subjectsData] = await Promise.all([
            getAcademicJournalLog(),
            getKegiatanForStudent(profileData.fullName),
            getClasses(),
            getSubjects(),
        ]);
        
        setAllClasses(classesData);
        setAllSubjects(subjectsData);
        setStudentKegiatanData(stimulationLog);
        
        const studentJournals = academicLog.filter(j => 
            (j.studentActiveness && Object.keys(j.studentActiveness).includes(studentId)) || 
            (j.personalNotes && j.personalNotes.some((pn: any) => pn.studentId === studentId))
        );

        const subjects: { [key: string]: any } = {};

        studentJournals.forEach(journal => {
            const subjectInfo = subjectsData.find(s => s.id === journal.subjectId);
            if (!subjectInfo) return;
            const subjectName = subjectInfo.name;

            if (!subjects[subjectName]) {
                subjects[subjectName] = {
                    name: subjectName,
                    icon: subjectIcons[subjectName] || BookCopy,
                    color: subjectColors[subjectName] || "text-foreground",
                    meetings: [],
                    personalNotes: [],
                    totalActivity: 0,
                    activityCount: 0,
                };
            }
            
            if (journal.studentActiveness && journal.studentActiveness[studentId]) {
                subjects[subjectName].totalActivity += journal.studentActiveness[studentId];
                subjects[subjectName].activityCount++;
            }
            
            subjects[subjectName].meetings.push({
                date: new Date(journal.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                topic: journal.topic
            });

            const personalNote = journal.personalNotes.find((pn: any) => pn.studentId === studentId);
            if (personalNote) {
                subjects[subjectName].personalNotes.push({
                    date: new Date(journal.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                    note: personalNote.note
                });
            }
        });
        
        Object.keys(subjects).forEach(subjectName => {
           if (subjects[subjectName].activityCount > 0) {
              subjects[subjectName].averageActivity = subjects[subjectName].totalActivity / subjects[subjectName].activityCount;
           } else {
              subjects[subjectName].averageActivity = 0;
           }
        });

        setAcademicData({ subjects: Object.values(subjects) });

    } catch (error) {
        console.error("Failed to load student data:", error);
        toast({ title: "Gagal memuat data siswa", variant: "destructive"});
    } finally {
        setIsLoading(false);
    }
  }, [studentId, router, toast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleInputChange = (field: keyof EditableProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editedProfile.fullName) {
        toast({title: "Nama tidak boleh kosong", variant: "destructive"});
        return;
    }
    setIsSaving(true);
    try {
        await updateStudent(studentId, editedProfile);
        toast({
            title: "Profil Diperbarui",
            description: `Data untuk ${editedProfile.fullName} telah berhasil disimpan.`,
        });
        await fetchAllData(); // Refresh data
    } catch (error) {
        toast({title: "Gagal menyimpan perubahan", variant: "destructive"});
    } finally {
        setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };
  
  if (isLoading || !studentProfile) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const attendanceStats = studentProfile.attendance ? [
    { label: "Hadir", value: studentProfile.attendance.present, icon: CheckCircle2, color: "text-green-500" },
    { label: "Terlambat", value: studentProfile.attendance.late, icon: AlertCircle, color: "text-yellow-500" },
    { label: "Sakit", value: studentProfile.attendance.sick, icon: Briefcase, color: "text-blue-500" },
    { label: "Izin", value: studentProfile.attendance.excused, icon: Activity, color: "text-orange-500" },
  ] : [];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="relative">
             <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
             </Button>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-accent tracking-tight font-headline">SMART SYAKILA</h1>
              <p className="text-muted-foreground text-base md:text-lg mt-1">Sistem Monitoring Aktivitas & Rapor Terpadu</p>
              <p className="text-muted-foreground text-base md:text-lg">Sekolah Syakila Yogyakarta</p>
            </div>
        </header>

        <Card className="p-6 flex flex-col sm:flex-row items-center justify-between shadow-md">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <Image src={`https://placehold.co/100x100.png`} alt={studentProfile.fullName} width={100} height={100} data-ai-hint={'student portrait'} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold text-foreground">{studentProfile.fullName}</h2>
                <p className="text-muted-foreground text-lg">NISN: {studentProfile.nisn} | Kelas: {studentProfile.className}</p>
              </div>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" /> Edit Profil
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Edit Profil Siswa</DialogTitle>
                    <DialogDescription>
                        Lakukan perubahan pada data siswa di bawah ini. Klik simpan jika sudah selesai.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullName" className="text-right">Nama Lengkap</Label>
                            <Input id="fullName" value={editedProfile.fullName || ''} onChange={(e) => handleInputChange('fullName', e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nickname" className="text-right">Panggilan</Label>
                            <Input id="nickname" value={editedProfile.nickname || ''} onChange={(e) => handleInputChange('nickname', e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nisn" className="text-right">NISN</Label>
                            <Input id="nisn" value={editedProfile.nisn || ''} onChange={(e) => handleInputChange('nisn', e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="class" className="text-right">Kelas</Label>
                            <Select onValueChange={(value) => handleInputChange('classId', value)} value={editedProfile.classId}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Batal</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BadgePercent className="text-primary" /> Rekapitulasi Presensi</CardTitle>
                <CardDescription>Ringkasan kehadiran siswa semester ini.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {attendanceStats.map(stat => (
                  <div key={stat.label} className="p-4 rounded-lg bg-secondary/50 flex flex-col items-center text-center">
                    <stat.icon className={`h-8 w-8 mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet className="text-accent" /> Informasi Tabungan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/10 p-6 rounded-lg text-center mb-6">
                  <p className="text-sm font-medium text-accent-foreground/80">Total Saldo Tabungan</p>
                  <p className="text-4xl font-bold text-accent">{formatCurrency(studentProfile.savings.balance)}</p>
                </div>
                 <Tabs defaultValue="deposits" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="deposits">Setoran</TabsTrigger>
                    <TabsTrigger value="withdrawals">Penarikan</TabsTrigger>
                  </TabsList>
                  <TabsContent value="deposits">
                     <ScrollArea className="h-48">
                      {studentProfile.savings.deposits.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tanggal</TableHead>
                              <TableHead className="text-right">Jumlah</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentProfile.savings.deposits.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{new Date(item.date).toLocaleDateString('id-ID')}</TableCell>
                                <TableCell className="text-right font-medium text-green-600">{formatCurrency(item.amount)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center text-muted-foreground p-4">Belum ada data setoran.</div>
                      )}
                     </ScrollArea>
                  </TabsContent>
                  <TabsContent value="withdrawals">
                     <ScrollArea className="h-48">
                      {studentProfile.savings.withdrawals.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Tanggal</TableHead>
                              <TableHead className="text-right">Jumlah</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentProfile.savings.withdrawals.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{new Date(item.date).toLocaleDateString('id-ID')}</TableCell>
                                <TableCell className="text-right font-medium text-red-600">-{formatCurrency(item.amount)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center text-muted-foreground p-4">Belum ada data penarikan.</div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
             {/* Kegiatan & Stimulasi Card */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity className="text-rose-500" /> Riwayat Kegiatan & Stimulasi</CardTitle>
                    <CardDescription>Semua aktivitas non-akademik yang diikuti oleh siswa.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-base mb-2">Riwayat Kegiatan</h3>
                            {studentKegiatanData.history.length > 0 ? (
                                <ScrollArea className="h-40">
                                    <div className="space-y-3 pr-4">
                                    {studentKegiatanData.history.map((keg: any, index: number) => (
                                        <div key={index} className="text-sm p-3 rounded-md bg-card border">
                                            <p className="font-semibold text-muted-foreground">{new Date(keg.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            <p className="text-foreground font-medium">{keg.kegiatan}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {keg.lokasi}</p>
                                        </div>
                                    ))}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center p-4">Belum ada riwayat kegiatan yang tercatat.</p>
                            )}
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="font-semibold text-base mb-2 flex items-center gap-2"><StickyNote className="h-4 w-4 text-accent" /> Catatan Personal dari Fasilitator</h3>
                             {studentKegiatanData.personalNotes.length > 0 ? (
                                <ScrollArea className="h-40">
                                <div className="space-y-3 pr-4">
                                    {studentKegiatanData.personalNotes.map((pnote: any, index: number) => (
                                    <div key={index} className="text-sm p-3 rounded-md bg-accent/10 border border-accent/20">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-muted-foreground">{new Date(pnote.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            <p className="text-xs text-muted-foreground">oleh {pnote.facilitatorName}</p>
                                        </div>
                                        <p className="text-accent-foreground/80 mt-1">"{pnote.note}"</p>
                                    </div>
                                    ))}
                                </div>
                                </ScrollArea>
                             ) : (
                                <p className="text-sm text-muted-foreground text-center p-4">Belum ada catatan personal yang tercatat.</p>
                             )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookCopy className="text-blue-500" /> Ringkasan Akademik</CardTitle>
                <CardDescription>Pantau progres dan keaktifan siswa per mata pelajaran.</CardDescription>
              </CardHeader>
              <CardContent>
                {academicData.subjects.length > 0 ? (
                  <div className="space-y-2">
                    {academicData.subjects.map((subject: any) => (
                      <Dialog key={subject.name}>
                          <DialogTrigger asChild>
                            <Card className="hover:bg-primary/5 hover:shadow-md transition-all cursor-pointer">
                                <CardContent className="p-3 flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', `${subject.color}/10`)}>
                                        <subject.icon className={cn('h-5 w-5', subject.color)}/>
                                      </div>
                                      <div>
                                          <p className="font-bold text-base">{subject.name}</p>
                                          {subject.averageActivity > 0 && (
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="h-4 w-4 fill-current" />
                                                <span className="font-semibold text-sm">{subject.averageActivity.toFixed(1)}</span>
                                                <span className="text-xs text-muted-foreground">(Rerata Keaktifan)</span>
                                            </div>
                                          )}
                                      </div>
                                  </div>
                                </CardContent>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[625px]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3 text-2xl">
                                <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', `${subject.color}/10`)}>
                                  <subject.icon className={cn('h-6 w-6', subject.color)}/>
                                </div>
                                {subject.name}
                              </DialogTitle>
                              <DialogDescription className="flex items-center gap-2 pt-2">
                                  Detail progres belajar siswa pada mata pelajaran ini.
                              </DialogDescription>
                            </DialogHeader>
                            
                            {subject.task && (
                              <div className="mt-4 p-4 rounded-lg border bg-secondary/50">
                                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><CalendarIcon className="h-5 w-5 text-primary" /> Tugas Aktif</h3>
                                  <p>{subject.task.description}</p>
                                  <Badge variant="destructive" className="mt-2 text-destructive-foreground">
                                      Deadline: {subject.task.deadline}
                                  </Badge>
                              </div>
                            )}

                            <div className="mt-4">
                              <h3 className="font-bold text-lg mb-2">Riwayat Pertemuan</h3>
                              <ScrollArea className="h-60">
                                <div className="space-y-3 pr-4">
                                  {subject.meetings.map((meeting: any, index: number) => (
                                    <div key={index} className="text-sm p-3 rounded-md bg-card border">
                                      <p className="font-semibold text-muted-foreground">{meeting.date}</p>
                                      <p className="text-foreground">{meeting.topic}</p>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                            
                            {subject.personalNotes && subject.personalNotes.length > 0 && (
                              <div className="mt-4">
                                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><StickyNote className="h-5 w-5 text-accent" /> Catatan Personal Fasilitator</h3>
                                  <ScrollArea className="h-40">
                                    <div className="space-y-3 pr-4">
                                      {subject.personalNotes.map((pnote: any, index: number) => (
                                        <div key={index} className="text-sm p-3 rounded-md bg-accent/10 border border-accent/20">
                                          <p className="font-semibold text-muted-foreground">{pnote.date}</p>
                                          <p className="text-accent-foreground/80">"{pnote.note}"</p>
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                </div>
                            )}
                          </DialogContent>
                        </Dialog>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-8">Belum ada data akademik yang tercatat untuk siswa ini.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
