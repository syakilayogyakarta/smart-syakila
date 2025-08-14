
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, Database, Book, School, PlusCircle, Pencil, Trash2, 
    BookUser, Loader2, UserCog, MoreHorizontal, UserPlus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
    getSubjects, addSubject, updateSubject, deleteSubject, Subject,
    getClasses, addClass, updateClass, deleteClass, Class as AppClass,
    getFacilitatorAssignments, saveFacilitatorAssignments, FacilitatorAssignments, Facilitator
} from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, 
    DialogDescription, DialogTrigger, DialogFooter, DialogClose 
} from "@/components/ui/dialog";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';

type User = (Facilitator & { isAdmin: false }) | { id: 'admin', fullName: string, nickname: string, isAdmin: true } | null;
type EditableFacilitator = Partial<Omit<Facilitator, 'id'>>;

const initialFacilitatorState: Omit<Facilitator, 'id'> = {
    fullName: '',
    nickname: '',
    email: '',
    gender: '' as "Laki-laki" | "Perempuan",
};

export default function DatabasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Data state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<AppClass[]>([]);
  const [facilitators, setFacilitators] = useState<Facilitator[]>([]);
  const [facilitatorAssignments, setFacilitatorAssignments] = useState<FacilitatorAssignments>({});
  
  // UI state
  const [selectedFacilitator, setSelectedFacilitator] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [assignedSubjects, setAssignedSubjects] = useState<string[]>([]); // stores subject IDs

  // Dialog state for Subjects, Classes, and Facilitators
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isFacilitatorDialogOpen, setIsFacilitatorDialogOpen] = useState(false);
  
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [currentClass, setCurrentClass] = useState<AppClass | null>(null);
  const [currentFacilitator, setCurrentFacilitator] = useState<Facilitator | null>(null);
  const [facilitatorFormState, setFacilitatorFormState] = useState<EditableFacilitator>(initialFacilitatorState);
  
  const [inputValue, setInputValue] = useState(''); // Generic input for simple dialogs

  const fetchFacilitatorsViaApi = async (): Promise<Facilitator[]> => {
      // The revalidate option on the route handler should prevent caching
      const response = await fetch('/api/facilitators');
      if (!response.ok) {
          toast({ title: "Gagal memuat data fasilitator", variant: "destructive" });
          return [];
      }
      return response.json();
  };

  const fetchData = useCallback(async () => {
    // We don't need to set loading to true here on every refetch,
    // only on the initial load.
    try {
        const [subjectsData, classesData, facilitatorsData, assignmentsData] = await Promise.all([
            getSubjects(),
            getClasses(),
            fetchFacilitatorsViaApi(),
            getFacilitatorAssignments()
        ]);
        setSubjects(subjectsData);
        setClasses(classesData);
        setFacilitators(facilitatorsData);
        setFacilitatorAssignments(assignmentsData);
    } catch (error) {
        toast({ title: "Gagal memuat data", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
        setIsLoading(true);
        // This check is now client-side only
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        if (isAdmin) {
            setUser({ id: 'admin', fullName: 'Admin', nickname: 'Admin', isAdmin: true });
        } else {
             // Non-admins can also see this page, so we fetch their data
             const facilitatorId = localStorage.getItem("loggedInFacilitatorId");
             if (facilitatorId) {
                const response = await fetch('/api/facilitators');
                 if (response.ok) {
                    const allFacilitators: Facilitator[] = await response.json();
                    const facilitator = allFacilitators.find(f => f.id === facilitatorId);
                    if (facilitator) {
                        setUser({ ...facilitator, isAdmin: false });
                    } else {
                         router.push('/login');
                         return;
                    }
                 }
             } else {
                 router.push('/login');
                 return;
             }
        }
        await fetchData();
        setIsLoading(false);
    }
    checkAuthAndFetchData();
  }, [router, fetchData]);
  
  // --- Subject Management (Server Action) ---
  const handleOpenSubjectDialog = (subject: Subject | null) => {
    setCurrentSubject(subject);
    setInputValue(subject?.name || '');
    setIsSubjectDialogOpen(true);
  };
  
  const handleSaveSubject = async () => {
    if (!inputValue.trim()) {
      toast({ title: "Nama tidak boleh kosong", variant: "destructive" });
      return;
    }
    try {
        if (currentSubject) {
            await updateSubject(currentSubject.id, inputValue.trim());
            toast({ title: "Mata Pelajaran Diperbarui" });
        } else {
            await addSubject(inputValue.trim());
            toast({ title: "Mata Pelajaran Ditambahkan" });
        }
        await fetchData();
        setIsSubjectDialogOpen(false);
    } catch (e) {
        toast({ title: "Gagal menyimpan", description: (e as Error).message, variant: "destructive" });
    }
  };

  const handleDeleteSubject = async (subject: Subject) => {
    try {
        await deleteSubject(subject.id);
        toast({ title: "Mata Pelajaran Dihapus", variant: "destructive" });
        await fetchData();
    } catch (e) {
        toast({ title: "Gagal menghapus", description: (e as Error).message, variant: "destructive" });
    }
  };
  
  // --- Class Management (Server Action) ---
  const handleOpenClassDialog = (className: AppClass | null) => {
    setCurrentClass(className);
    setInputValue(className?.name || '');
    setIsClassDialogOpen(true);
  };

  const handleSaveClass = async () => {
    if (!inputValue.trim()) {
      toast({ title: "Nama tidak boleh kosong", variant: "destructive" });
      return;
    }
    try {
        if (currentClass) {
            await updateClass(currentClass.id, inputValue.trim());
            toast({ title: "Kelas Diperbarui" });
        } else {
            await addClass(inputValue.trim());
            toast({ title: "Kelas Ditambahkan" });
        }
        await fetchData();
        setIsClassDialogOpen(false);
    } catch(e) {
        toast({ title: "Gagal menyimpan", description: (e as Error).message, variant: "destructive" });
    }
  };
  
  const handleDeleteClass = async (className: AppClass) => {
     try {
        await deleteClass(className.id);
        toast({ title: "Kelas Dihapus", variant: "destructive" });
        await fetchData();
    } catch(e) {
        toast({ title: "Gagal menghapus", description: (e as Error).message, variant: "destructive" });
    }
  };
  
  // --- Facilitator Management (API Route) ---
  const handleOpenFacilitatorDialog = (facilitator: Facilitator | null) => {
    setCurrentFacilitator(facilitator);
    setFacilitatorFormState(facilitator ? { ...facilitator } : initialFacilitatorState);
    setIsFacilitatorDialogOpen(true);
  };

  const handleSaveFacilitator = async () => {
      if (!facilitatorFormState.fullName || !facilitatorFormState.email || !facilitatorFormState.gender) {
          toast({ title: "Data tidak lengkap", description: "Nama, Email, dan Gender wajib diisi.", variant: "destructive"});
          return;
      }
      
      try {
          const method = currentFacilitator ? 'PUT' : 'POST';
          const body = currentFacilitator ? JSON.stringify({ id: currentFacilitator.id, ...facilitatorFormState }) : JSON.stringify(facilitatorFormState);

          const response = await fetch('/api/facilitators', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: body,
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Gagal menyimpan fasilitator');
          }

          toast({ title: `Data fasilitator berhasil ${currentFacilitator ? 'diperbarui' : 'ditambahkan'}`});
          await fetchData();
          setIsFacilitatorDialogOpen(false);
      } catch (e) {
          toast({ title: "Gagal menyimpan fasilitator", description: (e as Error).message, variant: "destructive" });
      }
  };
  
  const handleDeleteFacilitator = async (facilitator: Facilitator) => {
      try {
          const response = await fetch('/api/facilitators', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: facilitator.id }),
          });

           if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Gagal menghapus fasilitator');
          }

          toast({ title: `Fasilitator ${facilitator.fullName} dihapus`, variant: "destructive" });
          await fetchData();
      } catch (e) {
          toast({ title: "Gagal menghapus fasilitator", description: (e as Error).message, variant: "destructive" });
      }
  };


  // --- Assignment Management (Server Action) ---
  const handleFacilitatorChange = (facilitatorId: string) => {
    setSelectedFacilitator(facilitatorId);
    setSelectedClass('');
    setAssignedSubjects([]);
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    if (selectedFacilitator && facilitatorAssignments[selectedFacilitator]) {
      const currentAssignments = facilitatorAssignments[selectedFacilitator].classes[classId] || [];
      setAssignedSubjects(currentAssignments);
    } else {
      setAssignedSubjects([]);
    }
  };

  const handleSubjectAssignmentChange = (subjectId: string, isChecked: boolean) => {
    setAssignedSubjects(prev => 
      isChecked ? [...prev, subjectId] : prev.filter(sId => sId !== subjectId)
    );
  };
  
  const handleSaveAssignments = async () => {
    if (!selectedFacilitator || !selectedClass) {
        toast({
            title: "Gagal Menyimpan",
            description: "Pilih fasilitator dan kelas terlebih dahulu.",
            variant: "destructive"
        });
        return;
    }

    const newAssignments = { ...facilitatorAssignments };
    if (!newAssignments[selectedFacilitator]) {
      newAssignments[selectedFacilitator] = { classes: {}, groups: [] };
    }
    if (!newAssignments[selectedFacilitator].classes) {
        newAssignments[selectedFacilitator].classes = {};
    }
    newAssignments[selectedFacilitator].classes[selectedClass] = assignedSubjects;

    try {
        await saveFacilitatorAssignments(newAssignments);
        setFacilitatorAssignments(newAssignments);
        toast({
            title: "Penugasan Disimpan!",
            description: `Penugasan telah diperbarui.`
        });
    } catch(e) {
        toast({ title: "Gagal menyimpan penugasan", description: (e as Error).message, variant: "destructive" });
    }
  };

  if (isLoading || !user) {
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
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.push('/facilitator/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
            <Database className="h-8 w-8 text-accent" />
            Kelola Data Master
          </h1>
          <p className="text-muted-foreground mt-2">Tambah, ubah, atau hapus data mata pelajaran, kelas, dan fasilitator.</p>
        </header>

        <main className="space-y-8">

          {user.isAdmin && (
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <UserCog className="h-6 w-6 text-accent" />
                            Manajemen Fasilitator
                        </CardTitle>
                        <CardDescription>Kelola fasilitator yang terdaftar di sistem.</CardDescription>
                    </div>
                    <Button onClick={() => handleOpenFacilitatorDialog(null)}>
                        <UserPlus className="mr-2 h-4 w-4" /> Tambah Fasilitator
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead className="text-right">Tindakan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {facilitators.map(f => (
                                    <TableRow key={f.id}>
                                        <TableCell className="font-medium">{f.fullName} <span className="text-muted-foreground">({f.nickname})</span></TableCell>
                                        <TableCell>{f.email}</TableCell>
                                        <TableCell>{f.gender}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                                                    <DropdownMenuItem onSelect={(e) => {e.preventDefault(); handleOpenFacilitatorDialog(f);}}>
                                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                     <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Anda yakin ingin menghapus {f.fullName}?</AlertDialogTitle>
                                                                <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteFacilitator(f)}>Ya, Hapus</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
          )}

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
                                {facilitators.map(f => <SelectItem key={f.id} value={f.id}>{f.fullName}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="class-assign-select">2. Pilih Kelas</Label>
                        <Select onValueChange={handleClassChange} value={selectedClass} disabled={!selectedFacilitator}>
                            <SelectTrigger id="class-assign-select"><SelectValue placeholder="Pilih Kelas..." /></SelectTrigger>
                            <SelectContent>
                                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {selectedFacilitator && selectedClass && (
                    <div className="space-y-4 pt-4 border-t">
                        <Label className="font-semibold">3. Pilih Mata Pelajaran yang Diampu</Label>
                        <div className="p-4 border rounded-md grid grid-cols-2 md:grid-cols-3 gap-4">
                            {subjects.map(subject => (
                                <div key={subject.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`assign-${subject.id}`}
                                        checked={assignedSubjects.includes(subject.id)}
                                        onCheckedChange={(checked) => handleSubjectAssignmentChange(subject.id, !!checked)}
                                    />
                                    <label htmlFor={`assign-${subject.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {subject.name}
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
                      <TableRow key={subject.id}>
                        <TableCell className="font-medium">{subject.name}</TableCell>
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
                                        <AlertDialogTitle>Anda yakin ingin menghapus "{subject.name}"?</AlertDialogTitle>
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
                      <TableRow key={className.id}>
                        <TableCell className="font-medium">{className.name}</TableCell>
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
                                      <AlertDialogTitle>Anda yakin ingin menghapus "{className.name}"?</AlertDialogTitle>
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
                  <DialogDescription>{currentSubject ? `Ubah nama untuk "${currentSubject.name}".` : 'Masukkan nama untuk mata pelajaran baru.'}</DialogDescription>
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
                  <DialogDescription>{currentClass ? `Ubah nama untuk kelas "${currentClass.name}".` : 'Masukkan nama untuk kelas baru.'}</DialogDescription>
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

       {/* Facilitator Dialog */}
      <Dialog open={isFacilitatorDialogOpen} onOpenChange={setIsFacilitatorDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>{currentFacilitator ? 'Ubah Fasilitator' : 'Tambah Fasilitator Baru'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <Input id="fullName" value={facilitatorFormState.fullName || ''} onChange={(e) => setFacilitatorFormState(p => ({...p, fullName: e.target.value}))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="nickname">Nama Panggilan</Label>
                    <Input id="nickname" value={facilitatorFormState.nickname || ''} onChange={(e) => setFacilitatorFormState(p => ({...p, nickname: e.target.value}))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={facilitatorFormState.email || ''} onChange={(e) => setFacilitatorFormState(p => ({...p, email: e.target.value}))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => setFacilitatorFormState(p => ({...p, gender: value as any}))} value={facilitatorFormState.gender}>
                        <SelectTrigger id="gender"><SelectValue placeholder="Pilih gender" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
                  <Button onClick={handleSaveFacilitator}>Simpan</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
    

    