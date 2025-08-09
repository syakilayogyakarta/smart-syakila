
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, Check, Loader2, Book, 
  BookOpenCheck, User, Star, PlusCircle, X, Trash2, StickyNote, CalendarPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { studentsByClass, classes, facilitator, facilitatorAssignments } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type PersonalNote = {
  id: number;
  studentName: string;
  note: string;
}

export default function JournalPage() {
  const [timestamp, setTimestamp] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [studentOptions, setStudentOptions] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
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
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    };
    setTimestamp(new Intl.DateTimeFormat('id-ID', options).format(now).replace('.', ':'));
  }, []);

  const availableSubjects = useMemo(() => {
    if (selectedClass === "Kelompok MFM") {
      return ["MFM"];
    }
    if (!selectedClass || !facilitator) {
      return [];
    }
    const assignments = facilitatorAssignments[facilitator.fullName];
    if (!assignments) {
      return [];
    }
    return Object.keys(assignments).filter(subject => {
      const taughtIn = assignments[subject];
      if (taughtIn === 'all') {
        return true;
      }
      if(Array.isArray(taughtIn) && classes.includes(taughtIn[0])) {
         return taughtIn.includes(selectedClass);
      }
      if(Array.isArray(taughtIn) && !classes.includes(taughtIn[0])) {
        return true;
      }
      return false;
    });
  }, [selectedClass]);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedSubject("");
    setStudentOptions([]);
    setStudentActivity({});
    
    let students: string[] = [];

    if (value === "Kelompok MFM") {
      if (facilitator) {
        const assignments = facilitatorAssignments[facilitator.fullName];
        const mfmStudents = assignments['MFM'];
        if (Array.isArray(mfmStudents)) {
          students = mfmStudents;
        }
      }
      setSelectedSubject("MFM"); // Auto-select MFM
    } else {
      students = studentsByClass[value] || [];
    }
    
    setStudentOptions(students);
    const initialActivity: { [studentName: string]: number } = {};
    students.forEach(student => {
      initialActivity[student] = 0;
    });
    setStudentActivity(initialActivity);
  };

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    if (subject === 'MFM' && facilitator && selectedClass && selectedClass !== "Kelompok MFM") {
        const assignments = facilitatorAssignments[facilitator.fullName];
        const mfmStudents = assignments['MFM'];
        const studentsInClass = studentsByClass[selectedClass] || [];
        if (Array.isArray(mfmStudents)) {
            const relevantStudents = studentsInClass.filter(s => mfmStudents.includes(s));
            setStudentOptions(relevantStudents);
        }
    } else if (selectedClass && selectedClass !== "Kelompok MFM") {
        setStudentOptions(studentsByClass[selectedClass] || []);
    }
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
    if (!selectedClass || !selectedSubject || !topic) {
      setIsShaking(true);
      toast({
        title: "Data Wajib Belum Lengkap",
        description: "Mohon pilih kelas, mata pelajaran, dan isi topik hari ini.",
        variant: "destructive",
      });
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setButtonState("loading");
    console.log("Saving journal:", {
      class: selectedClass,
      subject: selectedSubject,
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
        description: `Jurnal akademik untuk ${selectedClass} mata pelajaran ${selectedSubject} berhasil disimpan.`,
      });
      // Reset form could go here
      
      setTimeout(() => setButtonState("idle"), 2000);
    }, 1500);
  };
  
  const isSaveDisabled = buttonState !== 'idle';

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="relative mb-8 text-center">
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Jurnal Akademik</h1>
          <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <CalendarIcon className="h-4 w-4" /> <span>{timestamp.split('pukul')[0]}</span> <Clock className="h-4 w-4" /> <span>{timestamp.split('pukul')[1]}</span>
          </p>
        </header>

        <Card className={cn("shadow-lg", isShaking && 'animate-shake')}>
          <CardHeader>
            <CardTitle>Formulir Jurnal Pembelajaran</CardTitle>
            <CardDescription>Isi detail sesi pembelajaran hari ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* --- Basic Info --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="class-select" className="font-semibold">Kelas <span className="text-destructive">*</span></Label>
                <Select onValueChange={handleClassChange} value={selectedClass}>
                  <SelectTrigger id="class-select" className="w-full">
                    <SelectValue placeholder="Pilih Kelas..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject-select" className="font-semibold">Mata Pelajaran <span className="text-destructive">*</span></Label>
                <Select 
                  onValueChange={handleSubjectChange} 
                  value={selectedSubject} 
                  disabled={!selectedClass || selectedClass === "Kelompok MFM"}
                >
                  <SelectTrigger id="subject-select" className="w-full">
                    <SelectValue placeholder="Pilih Mata Pelajaran..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic" className="font-semibold">Topik Hari Ini <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Book className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea id="topic" placeholder="Contoh: Mempelajari tentang sistem tata surya" className="pl-10" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
            </div>

            {/* --- Student Activity --- */}
            {selectedClass && (
              <div className="space-y-4">
                <Label className="font-semibold">Tingkat Keaktifan Siswa</Label>
                <div className="space-y-3 rounded-md border p-4">
                  {studentOptions.length > 0 ? studentOptions.map((student) => (
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
                  )) : <p className="text-sm text-muted-foreground text-center">Pilih kelas untuk menampilkan siswa.</p>}
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
                  <Textarea id="important-notes" placeholder="Contoh: Pertemuan selanjutnya akan ada kuis" value={importantNotes} onChange={(e) => setImportantNotes(e.target.value)}/>
              </div>
            </div>
            
            {/* --- Personal Notes --- */}
            <div>
              {!showPersonalNotes ? (
                 <Button variant="outline" onClick={() => setShowPersonalNotes(true)}>
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
                  {personalNotes.map((note, index) => (
                     <div key={note.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-center rounded-md bg-secondary/30 p-3">
                        <Select onValueChange={(value) => updatePersonalNote(note.id, 'studentName', value)} value={note.studentName} disabled={!selectedClass}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Siswa..." />
                          </SelectTrigger>
                          <SelectContent>
                             {studentOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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

          </CardContent>
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
        </Card>
      </div>
    </div>
  );
}
