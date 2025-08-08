
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, Trash2, User, StickyNote, PlusCircle, Send, MessageSquare, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { academicJournalLog, facilitator, studentsByClass } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type JournalEntry = typeof academicJournalLog[0];
type PersonalNote = JournalEntry['personalNotes'][0];

export default function JournalRecapPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [journals, setJournals] = useState(academicJournalLog);
  const [newNotes, setNewNotes] = useState<{ [journalId: number]: { studentName: string; note: string } }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const loggedInFacilitator = facilitator;

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate fetching new data
    setTimeout(() => {
      // In a real app, you would fetch data from an API here.
      // For now, we just reset the state to the initial data.
      setJournals([...academicJournalLog].sort(() => Math.random() - 0.5)); // shuffle to see change
      toast({
        title: "Rekap diperbarui!",
        description: "Data jurnal terbaru telah dimuat.",
      });
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleAddPersonalNote = (journalId: number) => {
    const noteData = newNotes[journalId];
    if (!noteData || !noteData.studentName || !noteData.note) {
      toast({
        title: "Gagal Menambah Catatan",
        description: "Mohon pilih siswa dan isi catatan terlebih dahulu.",
        variant: "destructive"
      });
      return;
    }

    const updatedJournals = journals.map(journal => {
      if (journal.id === journalId) {
        const newNote: PersonalNote = {
          id: Date.now(),
          studentName: noteData.studentName,
          note: noteData.note,
          facilitatorName: loggedInFacilitator.fullName
        };
        return { ...journal, personalNotes: [...journal.personalNotes, newNote] };
      }
      return journal;
    });

    setJournals(updatedJournals);
    setNewNotes(prev => ({ ...prev, [journalId]: { studentName: "", note: "" } }));
    toast({
      title: "Catatan Ditambahkan!",
      description: `Catatan personal untuk ${noteData.studentName} berhasil ditambahkan.`
    });
  };

  const handleNewNoteChange = (journalId: number, field: 'studentName' | 'note', value: string) => {
    setNewNotes(prev => ({
      ...prev,
      [journalId]: {
        ...prev[journalId],
        [field]: value
      }
    }));
  };
  
  const handleDeleteJournal = (journalId: number) => {
    setJournals(prev => prev.filter(j => j.id !== journalId));
    toast({
      title: "Jurnal Dihapus",
      description: "Jurnal pembelajaran berhasil dihapus."
    });
  }
  
  const getStudentOptionsForJournal = (journal: JournalEntry) => {
    return studentsByClass[journal.class] || [];
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="relative mb-8 text-center flex items-center justify-center">
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Rekap Jurnal Pembelajaran</h1>
            <p className="text-muted-foreground mt-2">Lihat semua catatan jurnal dari seluruh fasilitator.</p>
          </div>
          <Button variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
          </Button>
        </header>

        <Card className="shadow-lg">
          <CardContent className="p-0">
            {journals.length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {journals.map((journal) => (
                <AccordionItem value={`journal-${journal.id}`} key={journal.id}>
                  <AccordionTrigger className="px-6 py-4 hover:bg-primary/5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-left w-full">
                        <div className="font-semibold text-base">{journal.subject} - Kelas {journal.class}</div>
                        <div className="text-sm text-muted-foreground">
                            <span>{journal.facilitatorName}</span> | <span>{new Date(journal.timestamp).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
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
                                <SelectTrigger>
                                <SelectValue placeholder="Pilih Siswa..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {getStudentOptionsForJournal(journal).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Input 
                                placeholder="Tulis catatan..." 
                                value={newNotes[journal.id]?.note || ""}
                                onChange={(e) => handleNewNoteChange(journal.id, 'note', e.target.value)}
                            />
                         </div>
                         <Button onClick={() => handleAddPersonalNote(journal.id)} size="sm">
                            <Send className="mr-2 h-4 w-4" /> Kirim Catatan
                         </Button>
                    </div>

                    {loggedInFacilitator.fullName === journal.facilitatorName && (
                         <div className="flex justify-end pt-4 border-t">
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                      <Trash2 className="mr-2 h-4 w-4"/> Hapus Jurnal Ini
                                  </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Anda yakin ingin menghapus jurnal ini?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tindakan ini tidak dapat diurungkan. Ini akan menghapus data jurnal secara permanen dari sistem.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteJournal(journal.id)}>
                                    Ya, Hapus Jurnal
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                         </div>
                    )}

                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            ) : (
                <div className="p-8 text-center text-muted-foreground">
                    <p>Belum ada rekap jurnal yang tersedia.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
