
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, Check, Loader2, PlusCircle, X, Trash2, 
  Activity, MapPin, StickyNote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { studentsByClass, classes } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type PersonalNote = {
  id: number;
  studentName: string;
  note: string;
}

export default function StimulationPage() {
  const [timestamp, setTimestamp] = useState("");
  const [kegiatan, setKegiatan] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [catatanPenting, setCatatanPenting] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [studentOptions, setStudentOptions] = useState<string[]>([]);
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

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setStudentOptions(studentsByClass[value] || []);
    // Reset personal notes when class changes
    setPersonalNotes([]);
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
    if (!kegiatan || !lokasi) {
      setIsShaking(true);
      toast({
        title: "Data Wajib Belum Lengkap",
        description: "Mohon isi kolom Kegiatan/Stimulasi dan Lokasi.",
        variant: "destructive",
      });
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setButtonState("loading");
    console.log("Saving stimulation data:", {
      timestamp,
      kegiatan,
      lokasi,
      catatanPenting,
      personalNotes
    });
    
    setTimeout(() => {
      setButtonState("saved");
      toast({
        title: "Data Tersimpan!",
        description: `Kegiatan/Stimulasi berhasil disimpan.`,
      });
      
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
          <h1 className="text-3xl font-bold text-foreground">Kegiatan & Stimulasi</h1>
          <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <CalendarIcon className="h-4 w-4" /> <span>{timestamp.split('pukul')[0]}</span> <Clock className="h-4 w-4" /> <span>{timestamp.split('pukul')[1]}</span>
          </p>
        </header>

        <Card className={cn("shadow-lg", isShaking && 'animate-shake')}>
          <CardHeader>
            <CardTitle>Formulir Pencatatan</CardTitle>
            <CardDescription>Isi detail kegiatan atau stimulasi yang dilakukan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="kegiatan" className="font-semibold">Kegiatan atau Stimulasi <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea id="kegiatan" placeholder="Contoh: Bermain peran profesi, membaca buku cerita..." className="pl-10" value={kegiatan} onChange={(e) => setKegiatan(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lokasi" className="font-semibold">Lokasi <span className="text-destructive">*</span></Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="lokasi" placeholder="Contoh: Ruang Kelas, Halaman Sekolah..." className="pl-10" value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catatan-penting" className="font-semibold">Catatan Penting (Opsional)</Label>
              <div className="relative">
                <StickyNote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea id="catatan-penting" placeholder="Contoh: Anak-anak sangat antusias dengan kegiatan ini..." className="pl-10" value={catatanPenting} onChange={(e) => setCatatanPenting(e.target.value)} />
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="class-select" className="text-sm">Pilih Kelas Terlebih Dahulu</Label>
                    <Select onValueChange={handleClassChange} value={selectedClass}>
                      <SelectTrigger id="class-select" className="w-full md:w-1/2">
                        <SelectValue placeholder="Pilih Kelas..." />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedClass && personalNotes.map((note) => (
                     <div key={note.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-center rounded-md bg-secondary/30 p-3">
                        <Select onValueChange={(value) => updatePersonalNote(note.id, 'studentName', value)} value={note.studentName}>
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
                  {selectedClass && (
                   <Button variant="secondary" onClick={addPersonalNote}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Tambah Catatan Lagi
                   </Button>
                  )}
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
              {buttonState === 'loading' ? 'Menyimpan...' : buttonState === 'saved' ? 'Tersimpan' : 'Simpan Catatan'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
