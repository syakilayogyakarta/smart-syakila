
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { studentDetails, studentsByClass, classes } from '@/lib/data';

export default function StudentsListPage() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState('all');

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
            <CardTitle>Daftar Semua Siswa</CardTitle>
            <CardDescription>
              Total {filteredStudents.length} siswa ditemukan. Klik nama siswa untuk melihat detail.
            </CardDescription>
            <div className="pt-4">
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
                    <TableHead>Nama Panggilan</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>NISN</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.fullName} className="cursor-pointer hover:bg-muted/50" onClick={() => handleStudentClick(student.fullName)}>
                        <TableCell className="font-medium text-primary hover:underline">{student.fullName}</TableCell>
                        <TableCell>{student.nickname}</TableCell>
                        <TableCell>{student.className}</TableCell>
                        <TableCell>{student.nisn}</TableCell>
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

// Add a Label component for the filter
const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => {
    return <label {...props} />;
};

    