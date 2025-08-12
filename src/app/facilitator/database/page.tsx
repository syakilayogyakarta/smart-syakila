
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Database, Book, School, PlusCircle, Pencil, Trash2, BookUser, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { allSubjects as initialSubjects, classes as initialClasses, getLoggedInFacilitator, facilitators as allFacilitators, facilitatorAssignments as initialAssignments } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
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
import { Input } from '@/components/ui/input';


type Subject = string;
type ClassName = string;

export default function DatabasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for managing data locally on this page
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [classes, setClasses] = useState<ClassName[]>(initialClasses);
  const [facilitatorAssignments, setFacilitatorAssignments] = useState(initialAssignments);
  
  // State for assignment management UI
  const [selectedFacilitator, setSelectedFacilitator] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [assignedSubjects, setAssignedSubjects] = useState<Subject[]>([]);

  // State for dialogs
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [currentClass, setCurrentClass] = useState<ClassName | null>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const facilitator = getLoggedInFacilitator();
    if (facilitator && !['Faddliyah', 'Michael'].includes(facilitator.fullName)) {
      setIsAuthorized(true);
    } else if (facilitator) {
      toast({
        title: "Akses Ditolak",
        description: "Anda tidak memiliki izin untuk mengakses halaman ini.",
        variant: "destructive"
      });
      router.push('/facilitator/dashboard');
    } else {
        router.push('/login');
    }
    setIsLoading(false);
  }, [router, toast]);
  
  // --- Subject Management ---
  const handleOpenSubjectDialog = (subject: Subject | null) => {
    setCurrentSubject(subject);
    setInputValue(subject || '');
    setIsSubjectDialogOpen(true);
  };
  
  const handleSaveSubject = () => {
    if (!inputValue.trim()) {
      toast({ title: "Nama tidak boleh kosong", variant: "destructive" });
      return;
    }
    if (currentSubject) { // Editing
      setSubjects(subjects.map(s => s === currentSubject ? inputValue.trim() : s));
      toast({ title: "Mata Pelajaran Diperbarui" });
    } else { // Adding
      if (subjects.find(s => s.toLowerCase() === inputValue.trim().toLowerCase())) {
        toast({ title: "Mata pelajaran sudah ada", variant: "destructive" });
        return;
      }
      setSubjects([...subjects, inputValue.trim()]);
      toast({ title: "Mata Pelajaran Ditambahkan" });
    }
    setIsSubjectDialogOpen(false);
  };

  const handleDeleteSubject = (subject: Subject) => {
    setSubjects(subjects.filter(s => s !== subject));
    toast({ title: "Mata Pelajaran Dihapus", variant: "destructive" });
  };
  
  // --- Class Management ---
  const handleOpenClassDialog = (className: ClassName | null) => {
    setCurrentClass(className);
    setInputValue(className || '');
    setIsClassDialogOpen(true);
  };

  const handleSaveClass = () => {
    if (!inputValue.trim()) {
      toast({ title: "Nama tidak boleh kosong", variant: "destructive" });
      return;
    }
    if (currentClass) { // Editing
      setClasses(classes.map(c => c === currentClass ? inputValue.trim() : c));
      toast({ title: "Kelas Diperbarui" });
    } else { // Adding
       if (classes.find(c => c.toLowerCase() === inputValue.trim().toLowerCase())) {
        toast({ title: "Kelas sudah ada", variant: "destructive" });
        return;
      }
      setClasses([...classes, inputValue.trim()]);
      toast({ title: "Kelas Ditambahkan" });
    }
    setIsClassDialogOpen(false);
  };
  
  const handleDeleteClass = (className: ClassName) => {
    setClasses(classes.filter(c => c !== className));
    toast({ title: "Kelas Dihapus", variant: "destructive" });
  };


  // --- Assignment Management ---
  const handleFacilitatorChange = (facilitatorName: string) => {
    setSelectedFacilitator(facilitatorName);
    setSelectedClass('');
    setAssignedSubjects([]);
  };

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    if (selectedFacilitator && facilitatorAssignments[selectedFacilitator]) {
      const currentAssignments = facilitatorAssignments[selectedFacilitator].classes[className] || [];
      setAssignedSubjects(currentAssignments);
    } else {
      setAssignedSubjects([]);
    }
  };

  const handleSubjectAssignmentChange = (subjectName: Subject, isChecked: boolean) => {
    setAssignedSubjects(prev => 
      isChecked ? [...prev, subjectName] : prev.filter(s => s !== subjectName)
    );
  };
  
  const handleSaveAssignments = () => {
    if (!selectedFacilitator || !selectedClass) {
        toast({
            title: "Gagal Menyimpan",
            description: "Pilih fasilitator dan kelas terlebih dahulu.",
            variant: "destructive"
        });
        return;
    }

    setFacilitatorAssignments(prevAssignments => {
      const newAssignments = { ...prevAssignments };
      if (!newAssignments[selectedFacilitator]) {
        newAssignments[selectedFacilitator] = { classes: {}, groups: [] };
      }
      newAssignments[selectedFacilitator].classes[selectedClass] = assignedSubjects;
      return newAssignments;
    });

    toast({
        title: "Penugasan Disimpan!",
        description: `Penugasan untuk ${selectedFacilitator} di kelas ${selectedClass} telah diperbarui.`
    });
  };

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="relative mb-8 text-center">
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
            <Database className="h-8 w-8 text-accent" />
            Kelola Data Master
          </h1>
          <p className="text-muted-foreground mt-2">Tambah, ubah, atau hapus data mata pelajaran, kelas, dan penugasan fasilitator.</p>
        </header>

        <main className="space-y-8">
          {/* Assignment Management Card */}
          <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookUser className="h-6 w-6 text-indigo-500" />
                  Pengelolaan Penugasan Fasilitator
                </CardTitle>
                <CardDescription>Atur mata pelajaran yang diampu oleh setiap fasilitator di kelas tertentu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="facilitator-select">1. Pilih Fasilitator</Label>
                        <Select onValueChange={handleFacilitatorChange} value={selectedFacilitator}>
                            <SelectTrigger id="facilitator-select"><SelectValue placeholder="Pilih Fasilitator..." /></SelectTrigger>
                            <SelectContent>
                                {allFacilitators.map(f => <SelectItem key={f.fullName} value={f.fullName}>{f.fullName}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="class-assign-select">2. Pilih Kelas</Label>
                        <Select onValueChange={handleClassChange} value={selectedClass} disabled={!selectedFacilitator}>
                            <SelectTrigger id="class-assign-select"><SelectValue placeholder="Pilih Kelas..." /></SelectTrigger>
                            <SelectContent>
                                {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {selectedFacilitator && selectedClass && (
                    <div className="space-y-4 pt-4 border-t">
                        <Label className="font-semibold">3. Pilih Mata Pelajaran yang Diampu</Label>
                        <div className="p-4 border rounded-md grid grid-cols-2 md:grid-cols-3 gap-4">
                            {subjects.map(subject => (
                                <div key={subject} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`assign-${subject.replace(/\s+/g, '-')}`}
                                        checked={assignedSubjects.includes(subject)}
                                        onCheckedChange={(checked) => handleSubjectAssignmentChange(subject, !!checked)}
                                    />
                                    <label htmlFor={`assign-${subject.replace(/\s+/g, '-')}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {subject}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleSaveAssignments}>Simpan Perubahan Penugasan</Button>
                    </div>
                )}
            </CardContent>
          </Card>

          <Separator />
        
          {/* Subject Management Card */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-6 w-6 text-primary" />
                  Mata Pelajaran
                </CardTitle>
                <CardDescription>Kelola daftar mata pelajaran yang tersedia di sekolah.</CardDescription>
              </div>
              <Button onClick={() => handleOpenSubjectDialog(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Baru
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Mata Pelajaran</TableHead>
                      <TableHead className="text-right">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => (
                      <TableRow key={subject}>
                        <TableCell className="font-medium">{subject}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleOpenSubjectDialog(subject)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Anda yakin ingin menghapus "{subject}"?</AlertDialogTitle>
                                        <AlertDialogDescription>Tindakan ini tidak dapat diurungkan.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteSubject(subject)}>Ya, Hapus</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Class Management Card */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-6 w-6 text-accent" />
                  Kelas
                </CardTitle>
                <CardDescription>Kelola daftar kelas yang ada di sekolah.</CardDescription>
              </div>
              <Button onClick={() => handleOpenClassDialog(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Baru
              </Button>
            </CardHeader>
            <CardContent>
               <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Kelas</TableHead>
                      <TableHead className="text-right">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((className) => (
                      <TableRow key={className}>
                        <TableCell className="font-medium">{className}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleOpenClassDialog(className)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                      <AlertDialogTitle>Anda yakin ingin menghapus "{className}"?</AlertDialogTitle>
                                      <AlertDialogDescription>Tindakan ini tidak dapat diurungkan.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteClass(className)}>Ya, Hapus</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      {/* Subject Dialog */}
      <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{currentSubject ? 'Ubah Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}</DialogTitle>
                  <DialogDescription>{currentSubject ? `Ubah nama untuk "${currentSubject}".` : 'Masukkan nama untuk mata pelajaran baru.'}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                  <Label htmlFor="subject-name">Nama Mata Pelajaran</Label>
                  <Input id="subject-name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Contoh: Matematika" />
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                  <Button onClick={handleSaveSubject}>Simpan</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
      
      {/* Class Dialog */}
      <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{currentClass ? 'Ubah Kelas' : 'Tambah Kelas Baru'}</DialogTitle>
                  <DialogDescription>{currentClass ? `Ubah nama untuk kelas "${currentClass}".` : 'Masukkan nama untuk kelas baru.'}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                  <Label htmlFor="class-name">Nama Kelas</Label>
                  <Input id="class-name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Contoh: Ta'lim 3" />
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                  <Button onClick={handleSaveClass}>Simpan</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}

    
