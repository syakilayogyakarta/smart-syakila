
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Users, Filter, PlusCircle, Loader2, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { studentDetails, studentsByClass, classes } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const initialNewStudentState = {
    fullName: '',
    nickname: '',
    nisn: '',
    className: ''
};

export default function StudentsListPage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState(initialNewStudentState);
  const { toast } = useToast();

  const allStudents = useMemo(() => {
    return Object.entries(studentsByClass).flatMap(([className, studentNames]) => 
      studentNames.map(fullName => ({
        fullName,
        ...studentDetails[fullName],
        className
      }))
    );
  }, []);

  const filteredStudents = useMemo(() => {
    if (selectedClass === 'all') {
      return allStudents;
    }
    return allStudents.filter(student => student.className === selectedClass);
  }, [selectedClass, allStudents]);

  const handleStudentClick = (studentId: string) => {
    router.push(`/facilitator/students/${encodeURIComponent(studentId)}`);
  };

  const handleInputChange = (field: keyof typeof initialNewStudentState, value: string) => {
    setNewStudent(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNewStudent = () => {
    setIsSaving(true);
    console.log("Saving new student:", newStudent);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Siswa Baru Ditambahkan!",
        description: `Data untuk ${newStudent.fullName} telah berhasil disimulasikan.`,
      });
      setIsSaving(false);
      setIsAddDialogOpen(false); // Close the dialog
      setNewStudent(initialNewStudentState); // Reset form
    }, 1500);
  };
  
  const handleDeleteStudent = (studentName: string) => {
     // Simulate API call
    toast({
        title: "Siswa Dihapus",
        description: `Data untuk ${studentName} telah berhasil dihapus (simulasi).`,
        variant: "destructive"
      });
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="relative mb-8 text-center">
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
            <Users className="h-8 w-8 text-orange-500" />
            Data Siswa
          </h1>
          <p className="text-muted-foreground mt-2">Lihat dan kelola data semua siswa terdaftar.</p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Daftar Semua Siswa</CardTitle>
                    <CardDescription>
                    Total {filteredStudents.length} siswa ditemukan. Klik nama siswa untuk melihat detail.
                    </CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Siswa Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Tambah Profil Siswa</DialogTitle>
                        <DialogDescription>
                            Isi detail siswa baru di bawah ini. Klik simpan jika sudah selesai.
                        </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="fullName" className="text-right">Nama Lengkap</Label>
                                <Input id="fullName" value={newStudent.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nickname" className="text-right">Panggilan</Label>
                                <Input id="nickname" value={newStudent.nickname} onChange={(e) => handleInputChange('nickname', e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nisn" className="text-right">NISN</Label>
                                <Input id="nisn" value={newStudent.nisn} onChange={(e) => handleInputChange('nisn', e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="class" className="text-right">Kelas</Label>
                                <Select onValueChange={(value) => handleInputChange('className', value)} value={newStudent.className}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Pilih kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Batal</Button>
                            </DialogClose>
                            <Button type="submit" onClick={handleSaveNewStudent} disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving ? 'Menyimpan...' : 'Simpan Siswa'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="pt-4 mt-4 border-t">
              <Label htmlFor="class-filter" className="text-sm font-medium">Filter berdasarkan Kelas</Label>
              <div className="flex items-center gap-2 mt-1 max-w-xs">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class-filter">
                    <SelectValue placeholder="Filter Kelas..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {classes.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>NISN</TableHead>
                    <TableHead className="text-right">Tindakan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.fullName}>
                        <TableCell 
                            className="font-medium text-foreground cursor-pointer hover:text-primary hover:underline"
                            onClick={() => handleStudentClick(student.fullName)}
                        >
                            {student.fullName}
                            <p className="text-xs text-muted-foreground font-normal">Panggilan: {student.nickname}</p>
                        </TableCell>
                        <TableCell>{student.className}</TableCell>
                        <TableCell>{student.nisn}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Buka menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleStudentClick(student.fullName)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit Profil</span>
                                </DropdownMenuItem>
                                 <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Hapus Siswa</span>
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Anda yakin ingin menghapus siswa ini?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat diurungkan. Data siswa <span className="font-bold">{student.fullName}</span> akan dihapus secara permanen (simulasi).
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteStudent(student.fullName)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                                  Ya, Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        Tidak ada siswa di kelas ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
