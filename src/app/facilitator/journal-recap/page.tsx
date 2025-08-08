
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Trash2, MessageSquare, RefreshCw, Send, StickyNote, BookOpen, HeartPulse, MapPin, User, Layers3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
} from "@/components/ui/alert-dialog"
import { academicJournalLog, facilitator, studentsByClass, stimulationJournalLog } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type AcademicJournalEntry = typeof academicJournalLog[0];
type AcademicPersonalNote = AcademicJournalEntry['personalNotes'][0];

type StimulationJournalEntry = typeof stimulationJournalLog[0];
type StimulationPersonalNote = StimulationJournalEntry['personalNotes'][0];


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


export default function JournalRecapPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [academicJournals, setAcademicJournals] = useState(academicJournalLog);
  const [stimulationJournals, setStimulationJournals] = useState(stimulationJournalLog);

  const [newAcademicNotes, setNewAcademicNotes] = useState<{ [journalId: number]: { studentName: string; note: string } }>({});
  const [newStimulationNotes, setNewStimulationNotes] = useState<{ [journalId: number]: { studentName: string; note: string } }>({});
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const loggedInFacilitator = facilitator;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAcademicJournals([...academicJournalLog].sort(() => Math.random() - 0.5));
      setStimulationJournals([...stimulationJournalLog].sort(() => Math.random() - 0.5));
      toast({
        title: "Rekap diperbarui!",
        description: "Data terbaru telah dimuat.",
      });
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleAddPersonalNote = (journalId: number, type: 'academic' | 'stimulation') => {
    const noteData = type === 'academic' ? newAcademicNotes[journalId] : newStimulationNotes[journalId];

    if (!noteData || !noteData.studentName || !noteData.note) {
      toast({ title: "Gagal Menambah Catatan", description: "Mohon pilih siswa dan isi catatan.", variant: "destructive" });
      return;
    }

    if (type === 'academic') {
      const updatedJournals = academicJournals.map(journal => {
        if (journal.id === journalId) {
          const newNote: AcademicPersonalNote = {
            id: Date.now(),
            studentName: noteData.studentName,
            note: noteData.note,
            facilitatorName: loggedInFacilitator.fullName
          };
          return { ...journal, personalNotes: [...journal.personalNotes, newNote] };
        }
        return journal;
      });
      setAcademicJournals(updatedJournals);
      setNewAcademicNotes(prev => ({ ...prev, [journalId]: { studentName: "", note: "" } }));
    } else {
        const updatedJournals = stimulationJournals.map(journal => {
        if (journal.id === journalId) {
          const newNote: StimulationPersonalNote = {
            id: Date.now(),
            studentName: noteData.studentName,
            note: noteData.note,
            facilitatorName: loggedInFacilitator.fullName
          };
          return { ...journal, personalNotes: [...journal.personalNotes, newNote] };
        }
        return journal;
      });
      setStimulationJournals(updatedJournals);
      setNewStimulationNotes(prev => ({ ...prev, [journalId]: { studentName: "", note: "" } }));
    }

    toast({ title: "Catatan Ditambahkan!", description: `Catatan personal untuk ${noteData.studentName} berhasil ditambahkan.` });
  };

  const handleNewNoteChange = (journalId: number, type: 'academic' | 'stimulation', field: 'studentName' | 'note', value: string) => {
    if (type === 'academic') {
      setNewAcademicNotes(prev => ({ ...prev, [journalId]: { ...(prev[journalId] || {}), [field]: value } }));
    } else {
      setNewStimulationNotes(prev => ({ ...prev, [journalId]: { ...(prev[journalId] || {}), [field]: value } }));
    }
  };
  
  const handleDeleteJournal = (journalId: number, type: 'academic' | 'stimulation') => {
    if (type === 'academic') {
      setAcademicJournals(prev => prev.filter(j => j.id !== journalId));
    } else {
      setStimulationJournals(prev => prev.filter(j => j.id !== journalId));
    }
    toast({ title: "Jurnal Dihapus", description: "Jurnal berhasil dihapus." });
  }
  
  const getStudentOptionsForClass = (className: string) => studentsByClass[className] || [];
  const getAllStudentOptions = () => Object.values(studentsByClass).flat();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="relative mb-8 text-center flex items-center justify-center">
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Rekap Jurnal & Kegiatan</h1>
            <p className="text-muted-foreground mt-2">Lihat semua catatan dari seluruh fasilitator.</p>
          </div>
          <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
          </Button>
        </header>
        
        {/* Academic Journals */}
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><BookOpen className="text-primary"/> Rekap Jurnal Pembelajaran</h2>
            <Card className="shadow-lg">
                <CardContent className="p-0">
                    {academicJournals.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                    {academicJournals.map((journal) => (
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
                                        onValueChange={(value) => handleNewNoteChange(journal.id, 'academic', 'studentName', value)} 
                                        value={newAcademicNotes[journal.id]?.studentName || ""}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Pilih Siswa..." /></SelectTrigger>
                                        <SelectContent>
                                            {getStudentOptionsForClass(journal.class).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Input 
                                        placeholder="Tulis catatan..." 
                                        value={newAcademicNotes[journal.id]?.note || ""}
                                        onChange={(e) => handleNewNoteChange(journal.id, 'academic', 'note', e.target.value)}
                                    />
                                </div>
                                <Button onClick={() => handleAddPersonalNote(journal.id, 'academic')} size="sm">
                                    <Send className="mr-2 h-4 w-4" /> Kirim Catatan
                                </Button>
                            </div>

                            {loggedInFacilitator.fullName === journal.facilitatorName && (
                                <div className="flex justify-end pt-4 border-t">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/> Hapus Jurnal Ini</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Anda yakin ingin menghapus jurnal ini?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat diurungkan.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteJournal(journal.id, 'academic')}>Ya, Hapus Jurnal</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </div>
                            )}
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground"><p>Belum ada rekap jurnal pembelajaran.</p></div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Stimulation Journals */}
        <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3"><HeartPulse className="text-rose-500"/> Rekap Kegiatan & Stimulasi</h2>
             <Card className="shadow-lg">
                <CardContent className="p-0">
                    {stimulationJournals.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                    {stimulationJournals.map((journal) => (
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
                                        onValueChange={(value) => handleNewNoteChange(journal.id, 'stimulation', 'studentName', value)} 
                                        value={newStimulationNotes[journal.id]?.studentName || ""}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Pilih Siswa..." /></SelectTrigger>
                                        <SelectContent>
                                            {getAllStudentOptions().map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Input 
                                        placeholder="Tulis catatan..." 
                                        value={newStimulationNotes[journal.id]?.note || ""}
                                        onChange={(e) => handleNewNoteChange(journal.id, 'stimulation', 'note', e.target.value)}
                                    />
                                </div>
                                <Button onClick={() => handleAddPersonalNote(journal.id, 'stimulation')} size="sm">
                                    <Send className="mr-2 h-4 w-4" /> Kirim Catatan
                                </Button>
                            </div>

                            {loggedInFacilitator.fullName === journal.facilitatorName && (
                                <div className="flex justify-end pt-4 border-t">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/> Hapus Catatan Ini</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Anda yakin ingin menghapus catatan ini?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat diurungkan.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteJournal(journal.id, 'stimulation')}>Ya, Hapus</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </div>
                            )}
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground"><p>Belum ada rekap kegiatan atau stimulasi.</p></div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
