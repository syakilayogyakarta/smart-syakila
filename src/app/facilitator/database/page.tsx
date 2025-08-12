
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Database, Book, School, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { allSubjects, classes, getLoggedInFacilitator } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export default function DatabasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const facilitator = getLoggedInFacilitator();
    // Only allow access if facilitator is not Faddliyah or Michael
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
          <p className="text-muted-foreground mt-2">Tambah, ubah, atau hapus data mata pelajaran dan kelas.</p>
        </header>

        <main className="space-y-8">
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
