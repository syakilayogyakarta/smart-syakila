
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Database, Book, School, PlusCircle, Pencil, Trash2, BookUser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { allSubjects, classes, getLoggedInFacilitator, facilitators, facilitatorAssignments } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export default function DatabasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  // State for assignment management
  const [selectedFacilitator, setSelectedFacilitator] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [assignedSubjects, setAssignedSubjects] = useState<string[]>([]);
  
  useEffect(() => {
    const facilitator = getLoggedInFacilitator();
    if (facilitator && !['Faddliyah', 'Michael'].includes(facilitator.fullName)) {
      setIsAuthorized(true);
    } else {
      toast({
        title: "Akses Ditolak",
        description: "Anda tidak memiliki izin untuk mengakses halaman ini.",
        variant: "destructive"
      });
      router.push('/facilitator/dashboard');
    }
  }, [router, toast]);

  const handleActionClick = (feature: string) => {
    toast({
      title: "Fitur Dalam Pengembangan",
      description: `Fungsionalitas untuk ${feature} akan segera tersedia.`,
    });
  };

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

  const handleSubjectAssignmentChange = (subjectName: string, isChecked: boolean) => {
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

    console.log(`Simulasi penyimpanan: ${selectedFacilitator} di kelas ${selectedClass} mengajar: ${assignedSubjects.join(', ')}`);
    toast({
        title: "Penugasan Disimpan!",
        description: `Penugasan untuk ${selectedFacilitator} di kelas ${selectedClass} telah diperbarui (simulasi).`
    });
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
          <p>Memeriksa izin akses...</p>
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
                                {facilitators.map(f => <SelectItem key={f.fullName} value={f.fullName}>{f.fullName}</SelectItem>)}
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
                            {allSubjects.map(subject => (
                                <div key={subject} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`assign-${subject}`}
                                        checked={assignedSubjects.includes(subject)}
                                        onCheckedChange={(checked) => handleSubjectAssignmentChange(subject, !!checked)}
                                    />
                                    <label htmlFor={`assign-${subject}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
        
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-6 w-6 text-primary" />
                  Mata Pelajaran
                </CardTitle>
                <CardDescription>Kelola daftar mata pelajaran yang tersedia di sekolah.</CardDescription>
              </div>
              <Button onClick={() => handleActionClick('menambah mata pelajaran')}>
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
                    {allSubjects.map((subject) => (
                      <TableRow key={subject}>
                        <TableCell className="font-medium">{subject}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleActionClick(`mengubah ${subject}`)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleActionClick(`menghapus ${subject}`)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
               <div>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-6 w-6 text-accent" />
                  Kelas
                </CardTitle>
                <CardDescription>Kelola daftar kelas yang ada di sekolah.</CardDescription>
              </div>
              <Button onClick={() => handleActionClick('menambah kelas')}>
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
                          <Button variant="outline" size="icon" onClick={() => handleActionClick(`mengubah ${className}`)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleActionClick(`menghapus ${className}`)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  );
}

