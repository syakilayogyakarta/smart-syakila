
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar as CalendarIcon, Check, Loader2, Book, BookOpen,
  User, Star, PlusCircle, X, Trash2, StickyNote, Layers, Users, School, MessageSquare, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { allStudents, facilitatorAssignments, getLoggedInFacilitator, academicJournalLog, studentsByClass } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
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

type AcademicJournalEntry = typeof academicJournalLog[0];
type AcademicPersonalNote = AcademicJournalEntry['personalNotes'][0];

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

export default function JournalPage() {
  const [facilitator, setFacilitator] = useState<Facilitator | null>(null);
  const [journalDate, setJournalDate] = useState<Date | undefined>(new Date());
  
  const [mode, setMode] = useState<"kelas" | "kelompok" | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  const [topic, setTopic] = useState("");
  const [studentActivity, setStudentActivity] = useState<{ [studentName: string]: number }>({});
  const [assignment, setAssignment] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [importantNotes, setImportantNotes] = useState("");
  const [showPersonalNotes, setShowPersonalNotes] = useState(false);
  const [personalNotes, setPersonalNotes] = useState<PersonalNote[]>([]);

  const [buttonState, setButtonState] = useState<"idle" | "loading" | "saved">("idle");
  const [isShaking, setIsShaking] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const [journals, setJournals] = useState(academicJournalLog);
  const [newNotes, setNewNotes] = useState<{ [journalId: number]: { studentName: string; note: string } }>({});

  useEffect(() => {
    const loggedInFacilitator = getLoggedInFacilitator();
    if (!loggedInFacilitator) {
      router.push('/login');
    } else {
      setFacilitator(loggedInFacilitator);
    }
  }, [router]);
  
  const facilitatorData = useMemo(() => {
    if (!facilitator) return null;
    return facilitatorAssignments[facilitator.fullName];
  }, [facilitator]);

  const availableClasses = useMemo(() => {
    if (!facilitatorData) return [];
    return Object.keys(facilitatorData.classes);
  }, [facilitatorData]);

  const availableSubjectsForClass = useMemo(() => {
    if (!facilitatorData || !selectedClass) return [];
    return facilitatorData.classes[selectedClass] || [];
  }, [facilitatorData, selectedClass]);
  
  const availableGroupSubjects = useMemo(() => {
    if (!facilitatorData) return [];
    return facilitatorData.groups || [];
  }, [facilitatorData]);
  
  const studentOptionsForGroupMode = useMemo(() => {
    if (mode !== 'kelompok' || !selectedSubject || !facilitator) return [];

    let students = allStudents;
    if (selectedSubject === "Al-Qur'an & Tajwid") {
      students = students.filter(student => student.gender === facilitator.gender);
    }
    
    return students.map(s => s.fullName);
  }, [mode, selectedSubject, facilitator]);

  const resetFormFields = (clearMode = false) => {
    if (clearMode) {
      setMode(null);
    }
    setSelectedSubject("");
    setSelectedClass("");
    setSelectedStudents([]);
    setStudentActivity({});
    setTopic("");
    setAssignment("");
    setDeadline(undefined);
    setImportantNotes("");
    setPersonalNotes([]);
    setShowPersonalNotes(false);
    setJournalDate(new Date());
  };

  const handleModeChange = (newMode: "kelas" | "kelompok") => {
    resetFormFields();
    setMode(newMode);
  };
  
  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setSelectedSubject("");
    const students = allStudents.filter(s => s.className === className).map(s => s.fullName);
    setSelectedStudents(students);
    setStudentActivity(Object.fromEntries(students.map(s => [s, 0])));
  };
  
  const handleSubjectChange = (subject: string) => {
      setSelectedSubject(subject);
      if(mode === 'kelompok'){
          setSelectedStudents([]);
          setStudentActivity({});
      }
  };

  const handleStudentSelectionChange = (studentName: string, isChecked: boolean) => {
      setSelectedStudents(prev => {
          const newSelection = isChecked ? [...prev, studentName] : prev.filter(s => s !== studentName);
          const newActivities = { ...studentActivity };
          if (!isChecked) {
              delete newActivities[studentName];
          } else {
              newActivities[studentName] = 0;
          }
          setStudentActivity(newActivities);
          return newSelection;
      });
  };

  const handleActivityChange = (studentName: string, rating: number) => {
    setStudentActivity(prev => ({ ...prev, [studentName]: rating }));
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
    if (!mode || !selectedSubject || !topic || selectedStudents.length === 0 || !facilitator) {
      setIsShaking(true);
      toast({
        title: "Data Wajib Belum Lengkap",
        description: "Mohon pilih mode, mata pelajaran, isi topik, dan pastikan ada siswa yang dipilih.",
        variant: "destructive",
      });
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setButtonState("loading");
    
    const newJournalEntry: AcademicJournalEntry = {
      id: Date.now(),
      timestamp: (journalDate || new Date()).toISOString(),
      facilitatorName: facilitator.fullName,
      class: selectedClass,
      subject: selectedSubject,
      topic,
      importantNotes,
      personalNotes: personalNotes.map(pn => ({ ...pn, facilitatorName: facilitator.fullName }))
    };

    console.log("Saving journal:", newJournalEntry);
    
    setTimeout(() => {
      setJournals(prev => [newJournalEntry, ...prev]);
      setButtonState("saved");
      toast({
        title: "Jurnal Tersimpan!",
        description: `Jurnal pembelajaran untuk mata pelajaran ${selectedSubject} berhasil disimpan.`,
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
        const newNote: AcademicPersonalNote = {
          id: Date.now(),
          studentName: noteData.studentName,
          note: noteData.note,
          facilitatorName: facilitator.fullName
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
    toast({ title: "Jurnal Dihapus", description: "Jurnal berhasil dihapus." });
  };

  const getStudentOptionsForClass = (className: string) => studentsByClass[className] || [];
  
  const isSaveDisabled = buttonState !== 'idle';
  
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
          <h1 className="text-3xl font-bold text-foreground">Jurnal Pembelajaran</h1>
          <p className="text-muted-foreground mt-2">
            Catat detail sesi pembelajaran harian Anda.
          </p>
        </header>

        <Card className={cn("shadow-lg", isShaking && 'animate-shake')}>
          <CardHeader>
            <CardTitle>Formulir Jurnal</CardTitle>
            <CardDescription>Pilih mode pengisian, lalu lengkapi detail sesi pembelajaran hari ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="font-semibold text-base">1. Pilih Mode Pengisian Jurnal</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant={mode === 'kelas' ? 'default' : 'outline'} onClick={() => handleModeChange('kelas')} className="h-auto py-4">
                  <div className="flex items-center gap-4">
                    <School className="h-8 w-8"/>
                    <div className="text-left">
                      <p className="font-bold text-lg">Mode Kelas</p>
                      <p className="font-normal text-sm">Untuk pembelajaran klasikal per-kelas.</p>
                    </div>
                  </div>
                </Button>
                <Button variant={mode === 'kelompok' ? 'default' : 'outline'} onClick={() => handleModeChange('kelompok')} className="h-auto py-4">
                  <div className="flex items-center gap-4">
                    <Users className="h-8 w-8"/>
                    <div className="text-left">
                      <p className="font-bold text-lg">Mode Kelompok</p>
                      <p className="font-normal text-sm">Untuk kelompok belajar (misal: Al-Qur'an).</p>
                    </div>
                  </div>
                </Button>
              </div>
            </div>

            {mode === 'kelas' && (
              <div className="space-y-6 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-semibold">Pilih Kelas</Label>
                    <Select onValueChange={handleClassChange} value={selectedClass}>
                      <SelectTrigger><SelectValue placeholder="Pilih Kelas..." /></SelectTrigger>
                      <SelectContent>{availableClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Pilih Mata Pelajaran</Label>
                    <Select onValueChange={handleSubjectChange} value={selectedSubject} disabled={!selectedClass}>
                      <SelectTrigger><SelectValue placeholder="Pilih Mata Pelajaran..." /></SelectTrigger>
                      <SelectContent>{availableSubjectsForClass.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            
            {mode === 'kelompok' && (
              <div className="space-y-6 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="font-semibold">Pilih Mata Pelajaran Kelompok</Label>
                    <Select onValueChange={handleSubjectChange} value={selectedSubject}>
                      <SelectTrigger><SelectValue placeholder="Pilih Mata Pelajaran..." /></SelectTrigger>
                      <SelectContent>{availableGroupSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {selectedSubject && (
                      <div className="space-y-2">
                          <Label className="font-semibold">Pilih Siswa yang Mengikuti</Label>
                          <Card className="max-h-60 overflow-y-auto">
                              <CardContent className="p-4 space-y-3">
                                  {studentOptionsForGroupMode.map(student => (
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
              </div>
            )}

            {mode && selectedSubject && (
              <div className="space-y-6 pt-6 border-t border-dashed">
                 <div className="space-y-2">
                    <Label className="font-semibold">Tanggal Pembelajaran</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn("w-full justify-start text-left font-normal", !journalDate && "text-muted-foreground")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {journalDate ? format(journalDate, "PPP") : <span>Pilih tanggal</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={journalDate} onSelect={setJournalDate} initialFocus />
                        </PopoverContent>
                    </Popover>
                 </div>
                <div className="space-y-2">
                  <Label htmlFor="topic" className="font-semibold">Topik Hari Ini <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Book className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea id="topic" placeholder="Contoh: Mempelajari tentang sistem tata surya" className="pl-10" value={topic} onChange={(e) => setTopic(e.target.value)} />
                  </div>
                </div>

                {selectedStudents.length > 0 && (
                  <div className="space-y-4">
                    <Label className="font-semibold">Tingkat Keaktifan Siswa</Label>
                    <div className="space-y-3 rounded-md border p-4">
                      {selectedStudents.map((student) => (
                        <div key={student} className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                          <p className="font-medium text-foreground mb-2 sm:mb-0">{student}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} onClick={() => handleActivityChange(student, star)}>
                                <Star className={cn("h-6 w-6 transition-colors", studentActivity[student] >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="assignment" className="font-semibold">Tugas yang Diberikan (Opsional)</Label>
                      <Textarea id="assignment" placeholder="Contoh: Meringkas bab 3" value={assignment} onChange={(e) => setAssignment(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="deadline" className="font-semibold">Deadline Tugas (Opsional)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {deadline ? format(deadline, "PPP") : <span>Pilih tanggal</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus /></PopoverContent>
                        </Popover>
                    </div>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="important-notes" className="font-semibold">Catatan Penting (Opsional)</Label>
                      <div className="relative">
                        <StickyNote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea id="important-notes" placeholder="Contoh: Pertemuan selanjutnya akan ada kuis" className="pl-10" value={importantNotes} onChange={(e) => setImportantNotes(e.target.value)} />
                      </div>
                  </div>
                </div>
            
                <div>
                  {!showPersonalNotes ? (
                     <Button variant="outline" onClick={() => setShowPersonalNotes(true)} disabled={selectedStudents.length === 0}>
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
                              <SelectContent>{selectedStudents.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
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
                {buttonState === 'loading' ? 'Menyimpan...' : buttonState === 'saved' ? 'Tersimpan' : 'Simpan Jurnal'}
              </Button>
            </CardFooter>
          )}
        </Card>

        <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><BookOpen className="text-primary"/> Riwayat Jurnal Pembelajaran</h2>
            <Card className="shadow-lg">
                <CardContent className="p-0">
                    {journals.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                    {journals.map((journal) => (
                        <AccordionItem value={`academic-journal-${journal.id}`} key={journal.id}>
                        <AccordionTrigger className="px-6 py-4 hover:bg-primary/5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-left w-full">
                                <div className="font-semibold text-base">{journal.subject} - Kelas {journal.class}</div>
                                <div className="text-sm text-muted-foreground">
                                    <span>{journal.facilitatorName}</span> | <ClientFormattedDate timestamp={journal.timestamp} />
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pt-0 pb-4 space-y-6">
                            <div className="pt-4 border-t">
                                <h4 className="font-semibold text-lg mb-2">Detail Jurnal</h4>
                                <p><span className="font-semibold">Topik:</span> {journal.topic}</p>
                                {journal.importantNotes && (
                                    <div className="mt-4 p-3 rounded-md bg-secondary/50 border border-secondary">
                                    <h5 className="font-semibold flex items-center gap-2 mb-1"><StickyNote className="h-4 w-4" />Catatan Penting</h5>
                                    <p className="text-sm">{journal.importantNotes}</p>
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
                                            {getStudentOptionsForClass(journal.class).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                                        <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/> Hapus Jurnal Ini</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Anda yakin ingin menghapus jurnal ini?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat diurungkan.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteJournal(journal.id)}>Ya, Hapus Jurnal</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </div>
                            )}
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground"><p>Belum ada riwayat jurnal pembelajaran.</p></div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    