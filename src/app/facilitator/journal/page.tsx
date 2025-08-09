
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, Check, Loader2, Book, 
  User, Star, PlusCircle, X, Trash2, StickyNote, Layers, Users, School
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { allStudents, facilitatorAssignments, getLoggedInFacilitator, classes as allClassNames } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

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

const groupSubjects = ["Al-Qur'an & Tajwid", "Minhaj", "Quran Tematik", "MFM"];

export default function JournalPage() {
  const [facilitator, setFacilitator] = useState<Facilitator | null>(null);
  const [timestamp, setTimestamp] = useState("");
  
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

  useEffect(() => {
    const loggedInFacilitator = getLoggedInFacilitator();
    if (!loggedInFacilitator) {
      router.push('/login');
    } else {
      setFacilitator(loggedInFacilitator);
    }

    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    };
    setTimestamp(new Intl.DateTimeFormat('id-ID', options).format(now).replace('.', ':'));
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
    // Special filter for Al-Qur'an
    if (selectedSubject === "Al-Qur'an & Tajwid") {
      students = students.filter(student => student.gender === facilitator.gender);
    }
    
    return students.map(s => s.fullName);
  }, [mode, selectedSubject, facilitator]);

  const resetFormFields = (clearMode = false) => {
    if (clearMode) setMode(null);
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
      // For group mode, student list is already determined by subject, so we reset activities
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
    if (!mode || !selectedSubject || !topic || selectedStudents.length === 0) {
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
    console.log("Saving journal:", {
      mode,
      class: selectedClass,
      subject: selectedSubject,
      students: selectedStudents,
      topic,
      studentActivity,
      assignment,
      deadline,
      importantNotes,
      personalNotes
    });
    
    setTimeout(() => {
      setButtonState("saved");
      toast({
        title: "Jurnal Tersimpan!",
        description: `Jurnal pembelajaran untuk mata pelajaran ${selectedSubject} berhasil disimpan.`,
      });
      resetFormFields(true);
      
      setTimeout(() => setButtonState("idle"), 2000);
    }, 1500);
  };
  
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
          <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <CalendarIcon className="h-4 w-4" /> <span>{timestamp.split('pukul')[0]}</span> <Clock className="h-4 w-4" /> <span>{timestamp.split('pukul')[1]}</span>
          </p>
        </header>

        <Card className={cn("shadow-lg", isShaking && 'animate-shake')}>
          <CardHeader>
            <CardTitle>Formulir Jurnal</CardTitle>
            <CardDescription>Pilih mode pengisian, lalu lengkapi detail sesi pembelajaran hari ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* --- Mode Selection --- */}
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

            {/* Common Fields, enabled when primary selections are made */}
            {mode && selectedSubject && (
              <div className="space-y-6 pt-6 border-t border-dashed">
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
                
                {/* --- Optional Fields --- */}
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
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !deadline && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {deadline ? format(deadline, "PPP") : <span>Pilih tanggal</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={deadline}
                              onSelect={setDeadline}
                              initialFocus
                            />
                          </PopoverContent>
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
            
                {/* --- Personal Notes --- */}
                <div>
                  {!showPersonalNotes ? (
                     <Button variant="outline" onClick={() => setShowPersonalNotes(true)} disabled={selectedStudents.length === 0}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Tambah Catatan Personal (Opsional)
                     </Button>
                  ) : (
                    <div className="space-y-4 rounded-md border border-dashed p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Catatan Personal</h3>
                        <Button variant="ghost" size="icon" onClick={() => setShowPersonalNotes(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {personalNotes.map((note) => (
                         <div key={note.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-center rounded-md bg-secondary/30 p-3">
                            <Select onValueChange={(value) => updatePersonalNote(note.id, 'studentName', value)} value={note.studentName}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Siswa..." />
                              </SelectTrigger>
                              <SelectContent>
                                 {selectedStudents.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <Input placeholder="Tulis catatan personal untuk siswa ini..." value={note.note} onChange={(e) => updatePersonalNote(note.id, 'note', e.target.value)} />
                            <Button variant="destructive" size="icon" onClick={() => removePersonalNote(note.id)}>
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                         </div>
                      ))}
                       <Button variant="secondary" onClick={addPersonalNote}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Catatan Lagi
                       </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

          </CardContent>
          {mode && (
            <CardFooter>
              <Button
                className="w-full transition-all duration-300"
                onClick={handleSave}
                disabled={isSaveDisabled}
                size="lg"
              >
                {buttonState === 'loading' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : buttonState === 'saved' ? <Check className="mr-2 h-5 w-5" /> : null}
                {buttonState === 'loading' ? 'Menyimpan...' : buttonState === 'saved' ? 'Tersimpan' : 'Simpan Jurnal'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
