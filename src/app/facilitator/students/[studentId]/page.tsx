
"use client";

import React, { useEffect, useState } from 'react';
import { studentDetails, studentsByClass, academicData, getKegiatanForStudent, getFacilitatorForSubject, classes as allClassNames } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, Briefcase, Activity, User, ArrowLeft, BadgePercent, Wallet, BookCopy, Star, StickyNote, Calendar as CalendarIcon, UserCircle, MapPin, HeartPulse, Edit, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type StudentProfile = {
    fullName: string;
    nickname: string;
    nisn: string;
    photoUrl: string;
    photoHint: string;
    class: string | undefined;
    attendance: { present: number; late: number; sick: number; excused: number };
    savings: {
        balance: number;
        deposits: { date: string; description: string; amount: number }[];
        withdrawals: { date: string; description: string; amount: number }[];
    }
}

export default function StudentDetailPage({ params }: { params: { studentId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<StudentProfile>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const studentName = decodeURIComponent(params.studentId);
    const details = studentDetails[studentName];
    
    if (details) {
        const className = Object.keys(studentsByClass).find(key => studentsByClass[key].includes(studentName));
        
        const profileData = {
            fullName: studentName,
            nickname: details.nickname,
            nisn: details.nisn,
            photoUrl: `https://placehold.co/100x100.png`,
            photoHint: 'student portrait',
            class: className,
            attendance: { present: Math.floor(Math.random() * 20) + 100, late: Math.floor(Math.random() * 5), sick: Math.floor(Math.random() * 3), excused: Math.floor(Math.random() * 2) },
            savings: {
                balance: Math.floor(Math.random() * 200000) + 50000,
                deposits: [ { date: "15 Jul 2024", description: "Setoran rutin", amount: 50000 }, { date: "08 Jul 2024", description: "Setoran rutin", amount: 50000 } ],
                withdrawals: [ { date: "10 Jul 2024", description: "Beli buku", amount: 25000 } ]
            }
        };
        setStudentProfile(profileData);
        setEditedProfile(profileData);
    }
  }, [params.studentId]);

  const handleInputChange = (field: keyof StudentProfile, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    console.log("Saving changes:", editedProfile);
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would update the state with the saved data
      // For this prototype, we just show a success message
      toast({
        title: "Profil Diperbarui",
        description: `Data untuk ${editedProfile.fullName} telah berhasil disimpan.`,
      });
      setIsSaving(false);
      // Here you would typically close the dialog, which can be done by managing an 'open' state for the Dialog
      // For simplicity, we'll rely on the user closing it or using DialogClose
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const attendanceStats = studentProfile ? [
    { label: "Hadir", value: studentProfile.attendance.present, icon: CheckCircle2, color: "text-green-500" },
    { label: "Terlambat", value: studentProfile.attendance.late, icon: AlertCircle, color: "text-yellow-500" },
    { label: "Sakit", value: studentProfile.attendance.sick, icon: Briefcase, color: "text-blue-500" },
    { label: "Izin", value: studentProfile.attendance.excused, icon: Activity, color: "text-orange-500" },
  ] : [];

  const studentKegiatanData = studentProfile ? getKegiatanForStudent(studentProfile.fullName) : { history: [], personalNotes: [] };

  if (!studentProfile) {
    return <div className="flex min-h-screen items-center justify-center">Memuat data siswa...</div>;
  }

  const studentAcademicData = academicData;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="relative">
             <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
             </Button>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight font-headline">SMART SYAKILA</h1>
              <p className="text-muted-foreground text-base md:text-lg mt-1">Sistem Monitoring Aktivitas & Rapor Terpadu</p>
              <p className="text-muted-foreground text-base md:text-lg">Sekolah Syakila Yogyakarta</p>
            </div>
        </header>

        <Card className="p-6 flex flex-col sm:flex-row items-center justify-between shadow-md">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                {studentProfile.photoUrl && <Image src={studentProfile.photoUrl} alt={studentProfile.fullName} width={100} height={100} data-ai-hint={studentProfile.photoHint} />}
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold text-foreground">{studentProfile.fullName}</h2>
                <p className="text-muted-foreground text-lg">NISN: {studentProfile.nisn} | Kelas: {studentProfile.class}</p>
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
                            <Select onValueChange={(value) => handleInputChange('class', value)} value={editedProfile.class}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Pilih kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allClassNames.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentProfile.savings.deposits.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell className="text-right font-medium text-green-600">{formatCurrency(item.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                     </ScrollArea>
                  </TabsContent>
                  <TabsContent value="withdrawals">
                     <ScrollArea className="h-48">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentProfile.savings.withdrawals.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell className="text-right font-medium text-red-600">-{formatCurrency(item.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
                                    {studentKegiatanData.history.map((keg, index) => (
                                        <div key={index} className="text-sm p-3 rounded-md bg-card border">
                                            <p className="font-semibold text-muted-foreground">{new Date(keg.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                            <p className="text-foreground font-medium">{keg.kegiatan}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {keg.lokasi}</p>
                                        </div>
                                    ))}
                                    </div>
                                </ScrollArea>
                            ) : (
                                <p className="text-sm text-muted-foreground">Belum ada riwayat kegiatan yang tercatat.</p>
                            )}
                        </div>

                        {studentKegiatanData.personalNotes.length > 0 && (
                            <div className="pt-4 border-t">
                                <h3 className="font-semibold text-base mb-2 flex items-center gap-2"><StickyNote className="h-4 w-4 text-accent" /> Catatan Personal dari Fasilitator</h3>
                                <ScrollArea className="h-40">
                                <div className="space-y-3 pr-4">
                                    {studentKegiatanData.personalNotes.map((pnote, index) => (
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
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookCopy className="text-blue-500" /> Ringkasan Akademik</CardTitle>
                <CardDescription>Pantau progres dan keaktifan siswa per mata pelajaran.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Subject Cards */}
                  {studentAcademicData.subjects.map(subject => {
                    const facilitatorName = getFacilitatorForSubject(subject.name, studentProfile.fullName, studentProfile.class);
                    return (
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
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="font-semibold text-sm">{subject.averageActivity.toFixed(1)}</span>
                                            <span className="text-xs text-muted-foreground">(Rerata Keaktifan)</span>
                                        </div>
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
                                <UserCircle className="h-4 w-4" /> Pengampu: {facilitatorName}
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
                                {subject.meetings.map(meeting => (
                                  <div key={meeting.date} className="text-sm p-3 rounded-md bg-card border">
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
                                    {subject.personalNotes.map((pnote, index) => (
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
                  )})}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
