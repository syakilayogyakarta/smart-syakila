
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar as CalendarIcon, Check, Loader2, BookOpen,
  User, Star, PlusCircle, X, Trash2, StickyNote, Layers, Users, School, MessageSquare, Send, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
    getLoggedInUser, 
    getAcademicJournalLog,
    addAcademicJournalLog,
    deleteAcademicJournal,
    addPersonalNoteToAcademicLog,
    getStudents,
    getClasses,
    getSubjects,
    getFacilitatorAssignments,
    Student,
    Class as AppClass,
    Subject,
    FacilitatorAssignments,
    AcademicJournalLog,
    Facilitator
} from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
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
  id: string;
  studentId: string;
  note: string;
}
type AcademicPersonalNote = AcademicJournalLog['personalNotes'][0];

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
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  
  const [topic, setTopic] = useState("");
  const [studentActiveness, setStudentActiveness] = useState<{ [studentId: string]: number }>({});
  const [studentHomeworkScores, setStudentHomeworkScores] = useState<{ [studentId: string]: number }>({});
  const [assignment, setAssignment] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [importantNotes, setImportantNotes] = useState("");
  const [showPersonalNotes, setShowPersonalNotes] = useState(false);
  const [personalNotes, setPersonalNotes] = useState<PersonalNote[]>([]);

  const [buttonState, setButtonState] = useState<"idle" | "loading" | "saved">("idle");
  const [isShaking, setIsShaking] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  const [journals, setJournals] = useState<AcademicJournalLog[]>([]);
  const [newNotes, setNewNotes] = useState<{ [journalId: string]: { studentId: string; note: string } }>({});
  
  // Data state
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allClasses, setAllClasses] = useState<AppClass[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [allFacilitators, setAllFacilitators] = useState<Facilitator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const facilitatorId = localStorage.getItem('loggedInFacilitatorId');
             if (!facilitatorId) {
                router.push('/login');
                return;
            }
            // Fetch all facilitators and find the logged-in one
            const facilitatorsResponse = await fetch('/api/facilitators');
            const facilitatorsData: Facilitator[] = await facilitatorsResponse.json();
            setAllFacilitators(facilitatorsData);
            const loggedInFacilitator = facilitatorsData.find(f => f.id === facilitatorId);

            if (!loggedInFacilitator) {
                router.push('/login');
                return;
            }
            setFacilitator(loggedInFacilitator);

            const [studentsData, classesData, subjectsData, journalsData] = await Promise.all([
                getStudents(),
                getClasses(),
                getSubjects(),
                getAcademicJournalLog(),
            ]);
            setAllStudents(studentsData);
            setAllClasses(classesData);
            setAllSubjects(subjectsData);
            setJournals(journalsData);
        } catch (error) {
            toast({ title: "Gagal memuat data", description: "Terjadi kesalahan saat mengambil data dari server.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [router, toast]);
  
  const studentOptionsForGroupMode = useMemo(() => {
    if (mode !== 'kelompok' || !selectedSubjectId || !facilitator) return [];
    let students = allStudents;
    const selectedSubject = allSubjects.find(s => s.id === selectedSubjectId);
    if (selectedSubject?.name === "Al-Qur'an & Tajwid") {
      students = students.filter(student => student.gender === facilitator.gender);
    }
    return students;
  }, [mode, selectedSubjectId, facilitator, allStudents, allSubjects]);

  const resetFormFields = (clearMode = false) => {
    if (clearMode) setMode(null);
    setSelectedSubjectId("");
    setSelectedClassId("");
    setSelectedStudentIds([]);
    setStudentActiveness({});
    setStudentHomeworkScores({});
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
  
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    // setSelectedSubjectId(""); // No longer reset subject when class changes
    const students = allStudents.filter(s => s.classId === classId);
    const studentIds = students.map(s => s.id);
    setSelectedStudentIds(studentIds);
    const initialRatings = Object.fromEntries(studentIds.map(id => [id, 0]));
    setStudentActiveness(initialRatings);
    setStudentHomeworkScores(initialRatings);
  };
  
  const handleSubjectChange = (subjectId: string) => {
      setSelectedSubjectId(subjectId);
      if(mode === 'kelompok'){
          setSelectedStudentIds([]);
          setStudentActiveness({});
          setStudentHomeworkScores({});
      }
  };

  const handleStudentSelectionChange = (studentId: string, isChecked: boolean) => {
      setSelectedStudentIds(prev => {
          const newSelection = isChecked ? [...prev, studentId] : prev.filter(sId => sId !== studentId);
          const newActivities = { ...studentActiveness };
          const newScores = { ...studentHomeworkScores };
          if (!isChecked) {
              delete newActivities[studentId];
              delete newScores[studentId];
          } else {
              newActivities[studentId] = 0;
              newScores[studentId] = 0;
          }
          setStudentActiveness(newActivities);
          setStudentHomeworkScores(newScores);
          return newSelection;
      });
  };

  const handleRatingChange = (studentId: string, rating: number, type: 'activeness' | 'homework') => {
    if (type === 'activeness') {
      setStudentActiveness(prev => ({ ...prev, [studentId]: rating }));
    } else {
      setStudentHomeworkScores(prev => ({ ...prev, [studentId]: rating }));
    }
  };

  const addPersonalNote = () => {
    setPersonalNotes(prev => [...prev, { id: `new-${Date.now()}`, studentId: "", note: "" }]);
  };

  const updatePersonalNote = (id: string, field: 'studentId' | 'note', value: string) => {
    setPersonalNotes(prev => prev.map(note => note.id === id ? { ...note, [field]: value } : note));
  };
  
  const removePersonalNote = (id: string) => {
    setPersonalNotes(prev => prev.filter(note => note.id !== id));
  }

  const handleSave = async () => {
    if (!mode || !selectedSubjectId || !topic || selectedStudentIds.length === 0 || !facilitator) {
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
    
    const newJournalEntry: Omit<AcademicJournalLog, 'id'> = {
      timestamp: (journalDate || new Date()).toISOString(),
      facilitatorId: facilitator.id,
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      topic,
      importantNotes,
      studentActiveness: studentActiveness,
      studentHomeworkScores: studentHomeworkScores,
      personalNotes: personalNotes
        .filter(pn => pn.studentId && pn.note)
        .map(pn => ({ ...pn, id: crypto.randomUUID(), facilitatorId: facilitator.id }))
    };

    try {
        await addAcademicJournalLog(newJournalEntry);
        setJournals(await getAcademicJournalLog());
        setButtonState("saved");
        toast({
            title: "Jurnal Tersimpan!",
            description: `Jurnal pembelajaran berhasil disimpan.`,
        });
        resetFormFields(true);
        setTimeout(() => setButtonState("idle"), 2000);
    } catch(e) {
        toast({ title: "Gagal menyimpan jurnal", variant: "destructive" });
        setButtonState("idle");
    }
  };

  const handleAddPersonalNoteToLog = async (journalId: string) => {
    const noteData = newNotes[journalId];
    if (!noteData || !noteData.studentId || !noteData.note || !facilitator) {
      toast({ title: "Gagal Menambah Catatan", description: "Mohon pilih siswa dan isi catatan.", variant: "destructive" });
      return;
    }

    const newNote: AcademicPersonalNote = {
      id: crypto.randomUUID(),
      studentId: noteData.studentId,
      note: noteData.note,
      facilitatorId: facilitator.id
    };

    try {
        await addPersonalNoteToAcademicLog(journalId, newNote);
        setJournals(await getAcademicJournalLog());
        setNewNotes(prev => ({ ...prev, [journalId]: { studentId: "", note: "" } }));
        toast({ title: "Catatan Ditambahkan!" });
    } catch (e) {
        toast({ title: "Gagal menambah catatan", variant: "destructive" });
    }
  };

  const handleNewNoteChange = (journalId: string, field: 'studentId' | 'note', value: string) => {
    setNewNotes(prev => ({ ...prev, [journalId]: { ...(prev[journalId] || {} as any), [field]: value } }));
  };

  const handleDeleteJournal = async (journalId: string) => {
    try {
        await deleteAcademicJournal(journalId);
        setJournals(await getAcademicJournalLog());
        toast({ title: "Jurnal Dihapus" });
    } catch (e) {
        toast({ title: "Gagal menghapus jurnal", variant: "destructive" });
    }
  };

  const getStudentOptionsForJournal = (journal: AcademicJournalLog) => {
      if (journal.classId) {
          return allStudents.filter(s => s.classId === journal.classId);
      }
      // If no classId, it's a group, so find students by studentActiveness keys
      const studentIdsInJournal = Object.keys(journal.studentActiveness);
      return allStudents.filter(s => studentIdsInJournal.includes(s.id));
  };

  const getSubjectName = (subjectId: string) => allSubjects.find(s => s.id === subjectId)?.name || "N/A";
  const getClassName = (classId: string) => allClasses.find(c => c.id === classId)?.name || "Kelompok";
  const getFacilitatorName = (facilitatorId: string) => allFacilitators.find(f => f.id === facilitatorId)?.nickname || 'Admin';
  const getStudentName = (studentId: string) => allStudents.find(s => s.id === studentId)?.fullName || 'Siswa Dihapus';
  
  const isSaveDisabled = buttonState !== 'idle';
  
  if (isLoading || !facilitator) {
    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin"/>
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
                    <Select onValueChange={handleClassChange} value={selectedClassId}>
                      <SelectTrigger><SelectValue placeholder="Pilih Kelas..." /></SelectTrigger>
                      <SelectContent>{allClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Pilih Mata Pelajaran</Label>
                    <Select onValueChange={handleSubjectChange} value={selectedSubjectId}>
                      <SelectTrigger><SelectValue placeholder="Pilih Mata Pelajaran..." /></SelectTrigger>
                      <SelectContent>{allSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            
            {mode === 'kelompok' && (
              <div className="space-y-6 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="font-semibold">Pilih Mata Pelajaran Kelompok</Label>
                    <Select onValueChange={handleSubjectChange} value={selectedSubjectId}>
                      <SelectTrigger><SelectValue placeholder="Pilih Mata Pelajaran..." /></SelectTrigger>
                      <SelectContent>{allSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  {selectedSubjectId && (
                      <div className="space-y-2">
                          <Label className="font-semibold">Pilih Siswa yang Mengikuti</Label>
                          <Card className="max-h-60 overflow-y-auto">
                              <CardContent className="p-4 space-y-3">
                                  {studentOptionsForGroupMode.map(student => (
                                      <div key={student.id} className="flex items-center space-x-2">
                                          <Checkbox
                                              id={`student-${student.id}`}
                                              checked={selectedStudentIds.includes(student.id)}
                                              onCheckedChange={(checked) => handleStudentSelectionChange(student.id, !!checked)}
                                          />
                                          <label htmlFor={`student-${student.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                              {student.fullName}
                                          </label>
                                      </div>
                                  ))}
                              </CardContent>
                          </Card>
                      </div>
                  )}
              </div>
            )}

            {mode && selectedSubjectId && (
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
                            {journalDate ? format(journalDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={journalDate} onSelect={setJournalDate} initialFocus locale={id} />
                        </PopoverContent>
                    </Popover>
                 </div>
                <div className="space-y-2">
                  <Label htmlFor="topic" className="font-semibold">Topik Hari Ini <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea id="topic" placeholder="Contoh: Mempelajari tentang sistem tata surya" className="pl-10" value={topic} onChange={(e) => setTopic(e.target.value)} />
                  </div>
                </div>

                {selectedStudentIds.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="font-semibold flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /> Tingkat Keaktifan Siswa</Label>
                      <div className="space-y-3 rounded-md border p-4 max-h-60 overflow-y-auto">
                        {allStudents.filter(s => selectedStudentIds.includes(s.id)).map((student) => (
                          <div key={student.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <p className="font-medium text-foreground mb-2 sm:mb-0 truncate pr-2" title={student.fullName}>{student.fullName}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => handleRatingChange(student.id, star, 'activeness')}>
                                  <Star className={cn("h-6 w-6 transition-colors", studentActiveness[student.id] >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')} />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                     <div className="space-y-4">
                      <Label className="font-semibold flex items-center gap-2"><Home className="h-4 w-4 text-blue-500" /> Penilaian Tugas/PR</Label>
                      <div className="space-y-3 rounded-md border p-4 max-h-60 overflow-y-auto">
                        {allStudents.filter(s => selectedStudentIds.includes(s.id)).map((student) => (
                          <div key={student.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <p className="font-medium text-foreground mb-2 sm:mb-0 truncate pr-2" title={student.fullName}>{student.fullName}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => handleRatingChange(student.id, star, 'homework')}>
                                  <Star className={cn("h-6 w-6 transition-colors", studentHomeworkScores[student.id] >= star ? 'text-blue-400 fill-blue-400' : 'text-gray-300')} />
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
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
                              {deadline ? format(deadline, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus locale={id} /></PopoverContent>
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
                     <Button variant="outline" onClick={() => setShowPersonalNotes(true)} disabled={selectedStudentIds.length === 0}>
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
                            <Select onValueChange={(value) => updatePersonalNote(note.id, 'studentId', value)} value={note.studentId}>
                              <SelectTrigger><SelectValue placeholder="Pilih Siswa..." /></SelectTrigger>
                              <SelectContent>{allStudents.filter(s=> selectedStudentIds.includes(s.id)).map(s => <SelectItem key={s.id} value={s.id}>{s.fullName}</SelectItem>)}</SelectContent>
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
                                <div className="font-semibold text-base">{getSubjectName(journal.subjectId)} - {getClassName(journal.classId)}</div>
                                <div className="text-sm text-muted-foreground">
                                    <span>oleh {getFacilitatorName(journal.facilitatorId)}</span> | <ClientFormattedDate timestamp={journal.timestamp} />
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
                                        <p className="font-bold">{getStudentName(note.studentId)}</p>
                                        <p className="text-sm text-foreground/80 my-1">"{note.note}"</p>
                                        <p className="text-xs text-muted-foreground text-right">- oleh {getFacilitatorName(note.facilitatorId)}</p>
                                    </div>
                                ))}
                                {journal.personalNotes.length === 0 && <p className="text-sm text-muted-foreground">Belum ada catatan personal.</p>}
                            </div>
                            
                            <div className="p-4 rounded-lg border border-dashed space-y-3">
                                <h5 className="font-semibold">Tambah Catatan Personal Baru</h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Select 
                                        onValueChange={(value) => handleNewNoteChange(journal.id, 'studentId', value)} 
                                        value={newNotes[journal.id]?.studentId || ""}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Pilih Siswa..." /></SelectTrigger>
                                        <SelectContent>
                                            {getStudentOptionsForJournal(journal).map(s => <SelectItem key={s.id} value={s.id}>{s.fullName}</SelectItem>)}
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

                            {facilitator.id === journal.facilitatorId && (
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

    

    