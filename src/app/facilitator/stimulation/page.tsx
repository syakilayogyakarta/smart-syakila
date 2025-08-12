
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar as CalendarIcon, Check, Loader2, PlusCircle, X, Trash2, 
  Activity, MapPin, StickyNote, User, Layers, School, Users, UserCheck, MessageSquare, Send, HeartPulse, Layers3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { allStudents, studentsByClass, classes, getLoggedInFacilitator, stimulationJournalLog } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type PersonalNote = {
  id: number;
  studentName: string;
  note: string;
}

type Facilitator = {
  fullName: string;
  nickname: string;
  email: string;
  gender: string;
}

type StimulationJournalEntry = typeof stimulationJournalLog[0];
type StimulationPersonalNote = StimulationJournalEntry['personalNotes'][0];

const stimulationTypes = [
  "Stimulasi Fitrah",
  "Stimulasi KHD/KHL",
  "Stimulasi Kesehatan Mental",
  "Stimulasi Bakat",
  "Stimulasi Kemandirian & Ketahanan Pangan",
  "Stimulasi Berkelanjutan & Green Campus"
];


const ClientFormattedDate = ({ timestamp }: { timestamp: string }) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(
      new Date(timestamp).toLocaleString('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    );
  }, [timestamp]);

  return <span>{formattedDate}</span>;
};


export default function StimulationPage() {
  const [facilitator, setFacilitator] = useState<Facilitator | null>(null);
  const [activityDate, setActivityDate] = useState<Date | undefined>(new Date());
  const [mode, setMode] = useState<"klasikal" | "kelas" | "kelompok" | null>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  const [kegiatan, setKegiatan] = useState("");
  const [namaPemateri, setNamaPemateri] = useState("");
  const [jenisStimulasi, setJenisStimulasi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [catatanPenting, setCatatanPenting] = useState("");
  const [showPersonalNotes, setShowPersonalNotes] = useState(false);
  const [personalNotes, setPersonalNotes] = useState<PersonalNote[]>([]);

  const [buttonState, setButtonState] = useState<"idle" | "loading" | "saved">("idle");
  const [isShaking, setIsShaking] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const [journals, setJournals] = useState(stimulationJournalLog);
  const [newNotes, setNewNotes] = useState<{ [journalId: number]: { studentName: string; note: string } }>({});

  useEffect(() => {
    const loggedInFacilitator = getLoggedInFacilitator();
    if (!loggedInFacilitator) {
      router.push('/login');
    } else {
      setFacilitator(loggedInFacilitator);
    }
  }, [router]);

  const allStudentNames = useMemo(() => allStudents.map(s => s.fullName), []);

  const resetFormFields = (clearMode = false) => {
    if (clearMode) setMode(null);
    setSelectedClass("");
    setSelectedStudents([]);
    setKegiatan("");
    setNamaPemateri("");
    setJenisStimulasi("");
    setLokasi("");
    setCatatanPenting("");
    setPersonalNotes([]);
    setShowPersonalNotes(false);
    setActivityDate(new Date());
  };
  
  const handleModeChange = (newMode: "klasikal" | "kelas" | "kelompok") => {
    resetFormFields();
    setMode(newMode);
    if (newMode === 'klasikal') {
        setSelectedStudents(allStudentNames);
    }
  };

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    const studentsInClass = studentsByClass[className] || [];
    setSelectedStudents(studentsInClass);
  };

  const handleStudentSelectionChange = (studentName: string, isChecked: boolean) => {
      setSelectedStudents(prev => 
          isChecked ? [...prev, studentName] : prev.filter(s => s !== studentName)
      );
  };

  const addPersonalNote = () => {
    setPersonalNotes(prev => [...prev, { id: Date.now(), studentName: "", note: "" }]);
  };

  const updatePersonalNote = (id: number, field: 'studentName' | 'note', value: string) => {
    setPersonalNotes(prev => prev.map(note => note.id === id ? { ...note, [field]: value } : note));
  };
  
  const removePersonalNote = (id: number) => {
    setPersonalNotes(prev => prev.filter(note => note.id !== id));
  }

  const handleSave = () => {
    if (!mode || !kegiatan || !lokasi || selectedStudents.length === 0 || !facilitator) {
      setIsShaking(true);
      toast({
        title: "Data Wajib Belum Lengkap",
        description: "Mohon pilih mode, isi kegiatan, lokasi, dan pastikan ada siswa yang terpilih.",
        variant: "destructive",
      });
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setButtonState("loading");

    const newJournalEntry: StimulationJournalEntry = {
      id: Date.now(),
      timestamp: (activityDate || new Date()).toISOString(),
      facilitatorName: facilitator.fullName,
      mode,
      class: mode === 'kelas' ? selectedClass : '',
      students: selectedStudents,
      kegiatan,
      namaPemateri,
      jenisStimulasi,
      lokasi,
      catatanPenting,
      personalNotes: personalNotes.map(pn => ({ ...pn, facilitatorName: facilitator.fullName, timestamp: (activityDate || new Date()).toISOString() }))
    };

    console.log("Saving stimulation data:", newJournalEntry);
    
    setTimeout(() => {
      setJournals(prev => [newJournalEntry, ...prev]);
      setButtonState("saved");
      toast({
        title: "Data Tersimpan!",
        description: `Kegiatan/Stimulasi '${kegiatan}' berhasil disimpan.`,
      });
      resetFormFields(true);
      setTimeout(() => setButtonState("idle"), 2000);
    }, 1500);
  };
  
  const handleAddPersonalNoteToLog = (journalId: number) => {
    const noteData = newNotes[journalId];
    if (!noteData || !noteData.studentName || !noteData.note || !facilitator) {
      toast({ title: "Gagal Menambah Catatan", description: "Mohon pilih siswa dan isi catatan.", variant: "destructive" });
      return;
    }
    const updatedJournals = journals.map(journal => {
      if (journal.id === journalId) {
        const newNote: StimulationPersonalNote = {
          id: Date.now(),
          studentName: noteData.studentName,
          note: noteData.note,
          facilitatorName: facilitator.fullName,
          timestamp: new Date().toISOString()
        };
        return { ...journal, personalNotes: [...journal.personalNotes, newNote] };
      }
      return journal;
    });
    setJournals(updatedJournals);
    setNewNotes(prev => ({ ...prev, [journalId]: { studentName: "", note: "" } }));
    toast({ title: "Catatan Ditambahkan!", description: `Catatan personal untuk ${noteData.studentName} berhasil ditambahkan.` });
  };

  const handleNewNoteChange = (journalId: number, field: 'studentName' | 'note', value: string) => {
    setNewNotes(prev => ({ ...prev, [journalId]: { ...(prev[journalId] || {}), [field]: value } }));
  };

  const handleDeleteJournal = (journalId: number) => {
    setJournals(prev => prev.filter(j => j.id !== journalId));
    toast({ title: "Catatan Dihapus", description: "Catatan kegiatan berhasil dihapus." });
  };

  const getAllStudentOptions = () => Object.values(studentsByClass).flat();
  const isSaveDisabled = buttonState !== 'idle';
  const studentOptionsForNotes = selectedStudents;

  if (!facilitator) {
    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
            <p>Memuat data fasilitator...</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="relative mb-8 text-center">
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Kegiatan & Stimulasi</h1>
          <p className="text-muted-foreground mt-2">
            Catat detail kegiatan atau stimulasi yang dilakukan.
          </p>
        </header>

        <Card className={cn("shadow-lg", isShaking && 'animate-shake')}>
          <CardHeader>
            <CardTitle>Formulir Pencatatan</CardTitle>
            <CardDescription>Pilih mode pencatatan, lalu isi detail kegiatan atau stimulasi yang dilakukan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="space-y-3">
              <Label className="font-semibold text-base">1. Pilih Mode Pencatatan</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant={mode === 'klasikal' ? 'default' : 'outline'} onClick={() => handleModeChange('klasikal')} className="h-auto py-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8"/>
                    <div className="text-left">
                      <p className="font-bold">Klasikal</p>
                      <p className="font-normal text-xs">Untuk semua siswa</p>
                    </div>
                  </div>
                </Button>
                <Button variant={mode === 'kelas' ? 'default' : 'outline'} onClick={() => handleModeChange('kelas')} className="h-auto py-4">
                  <div className="flex items-center gap-3">
                    <School className="h-8 w-8"/>
                    <div className="text-left">
                      <p className="font-bold">Per Kelas</p>
                      <p className="font-normal text-xs">Untuk satu kelas</p>
                    </div>
                  </div>
                </Button>
                <Button variant={mode === 'kelompok' ? 'default' : 'outline'} onClick={() => handleModeChange('kelompok')} className="h-auto py-4">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-8 w-8"/>
                    <div className="text-left">
                      <p className="font-bold">Kelompok</p>
                      <p className="font-normal text-xs">Pilih siswa manual</p>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {mode === 'kelas' && (
              <div className="space-y-2 pt-4 border-t">
                  <Label className="font-semibold">Pilih Kelas</Label>
                  <Select onValueChange={handleClassChange} value={selectedClass}>
                    <SelectTrigger><SelectValue placeholder="Pilih Kelas..." /></SelectTrigger>
                    <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
              </div>
            )}
            
            {mode === 'kelompok' && (
              <div className="space-y-2 pt-4 border-t">
                  <Label className="font-semibold">Pilih Siswa yang Mengikuti</Label>
                  <Card className="max-h-60 overflow-y-auto">
                      <CardContent className="p-4 space-y-3">
                          {allStudentNames.map(student => (
                              <div key={student} className="flex items-center space-x-2">
                                  <Checkbox
                                      id={`student-${student}`}
                                      checked={selectedStudents.includes(student)}
                                      onCheckedChange={(checked) => handleStudentSelectionChange(student, !!checked)}
                                  />
                                  <label htmlFor={`student-${student}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                      {student}
                                  </label>
                              </div>
                          ))}
                      </CardContent>
                  </Card>
              </div>
            )}

            {mode && (
              <div className="space-y-6 pt-6 border-t border-dashed">
                 <div className="space-y-2">
                    <Label>Tanggal Kegiatan</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !activityDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {activityDate ? format(activityDate, "PPP") : <span>Pilih tanggal</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={activityDate} onSelect={setActivityDate} initialFocus /></PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kegiatan" className="font-semibold">Kegiatan atau Stimulasi <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea id="kegiatan" placeholder="Contoh: Bermain peran profesi, membaca buku cerita..." className="pl-10" value={kegiatan} onChange={(e) => setKegiatan(e.target.value)} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pemateri" className="font-semibold">Nama Pemateri (Opsional)</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="pemateri" placeholder="Contoh: Pak Budi" className="pl-10" value={namaPemateri} onChange={(e) => setNamaPemateri(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lokasi" className="font-semibold">Lokasi <span className="text-destructive">*</span></Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="lokasi" placeholder="Contoh: Ruang Kelas, Halaman Sekolah..." className="pl-10" value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis-stimulasi" className="font-semibold">Jenis Stimulasi (Opsional)</Label>
                    <Select onValueChange={setJenisStimulasi} value={jenisStimulasi}>
                      <SelectTrigger id="jenis-stimulasi" className="w-full">
                        <div className="flex items-center gap-3">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Pilih Jenis Stimulasi..." />
                        </div>
                      </SelectTrigger>
                      <SelectContent>{stimulationTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="catatan-penting" className="font-semibold">Catatan Penting (Opsional)</Label>
                  <div className="relative">
                    <StickyNote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea id="catatan-penting" placeholder="Contoh: Anak-anak sangat antusias dengan kegiatan ini..." className="pl-10" value={catatanPenting} onChange={(e) => setCatatanPenting(e.target.value)} />
                  </div>
                </div>
                
                <div>
                  {!showPersonalNotes ? (
                    <Button variant="outline" onClick={() => { setShowPersonalNotes(true); if (personalNotes.length === 0) addPersonalNote(); }} disabled={selectedStudents.length === 0}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Tambah Catatan Personal (Opsional)
                    </Button>
                  ) : (
                    <div className="space-y-4 rounded-md border border-dashed p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Catatan Personal</h3>
                        <Button variant="ghost" size="icon" onClick={() => setShowPersonalNotes(false)}><X className="h-4 w-4" /></Button>
                      </div>
                      
                      {personalNotes.map((note) => (
                        <div key={note.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-center rounded-md bg-secondary/30 p-3">
                            <Select onValueChange={(value) => updatePersonalNote(note.id, 'studentName', value)} value={note.studentName}>
                              <SelectTrigger><SelectValue placeholder="Pilih Siswa..." /></SelectTrigger>
                              <SelectContent>{studentOptionsForNotes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                            </Select>
                            <Input placeholder="Tulis catatan personal untuk siswa ini..." value={note.note} onChange={(e) => updatePersonalNote(note.id, 'note', e.target.value)} />
                            <Button variant="destructive" size="icon" onClick={() => removePersonalNote(note.id)}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                      ))}
                      
                      <Button variant="secondary" onClick={addPersonalNote}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Catatan Lagi</Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          {mode && (
            <CardFooter>
                <Button className="w-full transition-all duration-300" onClick={handleSave} disabled={isSaveDisabled} size="lg">
                    {buttonState === 'loading' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : buttonState === 'saved' ? <Check className="mr-2 h-5 w-5" /> : null}
                    {buttonState === 'loading' ? 'Menyimpan...' : buttonState === 'saved' ? 'Tersimpan' : 'Simpan Catatan'}
                </Button>
            </CardFooter>
          )}
        </Card>

        <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><HeartPulse className="text-rose-500"/> Riwayat Kegiatan & Stimulasi</h2>
             <Card className="shadow-lg">
                <CardContent className="p-0">
                    {journals.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                    {journals.map((journal) => (
                        <AccordionItem value={`stimulation-journal-${journal.id}`} key={journal.id}>
                        <AccordionTrigger className="px-6 py-4 hover:bg-rose-500/5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-left w-full">
                                <div className="font-semibold text-base">{journal.kegiatan}</div>
                                <div className="text-sm text-muted-foreground">
                                    <span>{journal.facilitatorName}</span> | <ClientFormattedDate timestamp={journal.timestamp} />
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pt-0 pb-4 space-y-6">
                            <div className="pt-4 border-t space-y-3">
                                <h4 className="font-semibold text-lg mb-2">Detail Kegiatan</h4>
                                <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground"/> <span className="font-semibold">Lokasi:</span> {journal.lokasi}</p>
                                {journal.namaPemateri && <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground"/> <span className="font-semibold">Pemateri:</span> {journal.namaPemateri}</p>}
                                {journal.jenisStimulasi && <p className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-muted-foreground"/> <span className="font-semibold">Jenis:</span> {journal.jenisStimulasi}</p>}
                                
                                {journal.catatanPenting && (
                                    <div className="mt-4 p-3 rounded-md bg-secondary/50 border border-secondary">
                                    <h5 className="font-semibold flex items-center gap-2 mb-1"><StickyNote className="h-4 w-4" />Catatan Penting</h5>
                                    <p className="text-sm">{journal.catatanPenting}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                <h5 className="font-semibold flex items-center gap-2 text-lg"><MessageSquare className="h-5 w-5" />Catatan Personal Siswa</h5>
                                {journal.personalNotes.map(note => (
                                    <div key={note.id} className="p-3 rounded-md border bg-card">
                                        <p className="font-bold">{note.studentName}</p>
                                        <p className="text-sm text-foreground/80 my-1">"{note.note}"</p>
                                        <p className="text-xs text-muted-foreground text-right">- {note.facilitatorName}</p>
                                    </div>
                                ))}
                                {journal.personalNotes.length === 0 && <p className="text-sm text-muted-foreground">Belum ada catatan personal.</p>}
                            </div>
                            
                            <div className="p-4 rounded-lg border border-dashed space-y-3">
                                <h5 className="font-semibold">Tambah Catatan Personal Baru</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Select 
                                        onValueChange={(value) => handleNewNoteChange(journal.id, 'studentName', value)} 
                                        value={newNotes[journal.id]?.studentName || ""}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Pilih Siswa..." /></SelectTrigger>
                                        <SelectContent>
                                            {journal.students.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Input 
                                        placeholder="Tulis catatan..." 
                                        value={newNotes[journal.id]?.note || ""}
                                        onChange={(e) => handleNewNoteChange(journal.id, 'note', e.target.value)}
                                    />
                                </div>
                                <Button onClick={() => handleAddPersonalNoteToLog(journal.id)} size="sm">
                                    <Send className="mr-2 h-4 w-4" /> Kirim Catatan
                                </Button>
                            </div>

                            {facilitator.fullName === journal.facilitatorName && (
                                <div className="flex justify-end pt-4 border-t">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/> Hapus Catatan Ini</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Anda yakin ingin menghapus catatan ini?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat diurungkan.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteJournal(journal.id)}>Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </div>
                            )}
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground"><p>Belum ada riwayat kegiatan atau stimulasi.</p></div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
