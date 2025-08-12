
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Users, Loader2, PlusCircle, Trash2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFacilitators, getLoggedInUser, Facilitator } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const initialNewFacilitatorState = {
    fullName: '',
    nickname: '',
    email: '',
    gender: '' as "Laki-laki" | "Perempuan",
};

export default function ManageFacilitatorsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [facilitators, setFacilitators] = useState<Facilitator[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newFacilitator, setNewFacilitator] = useState(initialNewFacilitatorState);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const facilitatorData = await getFacilitators();
            setFacilitators(facilitatorData);
        } catch (error) {
            toast({ title: "Gagal memuat data fasilitator", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkAdmin = async () => {
            const user = await getLoggedInUser();
            if (!user || !user.isAdmin) {
                toast({ title: "Akses Ditolak", description: "Hanya admin yang dapat mengakses halaman ini.", variant: "destructive" });
                router.push('/facilitator/dashboard');
            } else {
                fetchData();
            }
        };
        checkAdmin();
    }, [router, toast]);

    const handleInputChange = (field: keyof typeof initialNewFacilitatorState, value: string) => {
        setNewFacilitator(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveNewFacilitator = async () => {
        if (!newFacilitator.fullName || !newFacilitator.nickname || !newFacilitator.email || !newFacilitator.gender) {
            toast({ title: "Data tidak lengkap", description: "Semua field wajib diisi.", variant: "destructive" });
            return;
        }
        setIsSaving(true);
        try {
            const response = await fetch('/api/facilitators', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: newFacilitator.fullName,
                    nickname: newFacilitator.nickname,
                    email: newFacilitator.email,
                    gender: newFacilitator.gender,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal menyimpan fasilitator');
            }

            toast({
                title: "Fasilitator Baru Ditambahkan!",
                description: `Data untuk ${newFacilitator.fullName} telah berhasil disimpan.`,
            });
            await fetchData();
            setNewFacilitator(initialNewFacilitatorState);
        } catch (error: any) {
            toast({ title: "Gagal menyimpan", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };
    
    // NOTE: Delete facilitator functionality is complex due to assignments.
    // We will omit it for now to prevent data integrity issues.

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="relative mb-8 text-center">
                    <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.push('/facilitator/database')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
                        <Users className="h-8 w-8 text-accent" />
                        Manajemen Fasilitator
                    </h1>
                    <p className="text-muted-foreground mt-2">Tambah dan kelola data fasilitator yang terdaftar.</p>
                </header>
                
                <main className="space-y-8">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-6 w-6" />
                                Tambah Fasilitator Baru
                            </CardTitle>
                            <CardDescription>Isi detail fasilitator baru di bawah ini.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Nama Lengkap</Label>
                                    <Input id="fullName" value={newFacilitator.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="Contoh: John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nickname">Nama Panggilan</Label>
                                    <Input id="nickname" value={newFacilitator.nickname} onChange={(e) => handleInputChange('nickname', e.target.value)} placeholder="Contoh: John" />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={newFacilitator.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="contoh@email.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select onValueChange={(value) => handleInputChange('gender', value)} value={newFacilitator.gender}>
                                        <SelectTrigger id="gender">
                                            <SelectValue placeholder="Pilih gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={handleSaveNewFacilitator} disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                {isSaving ? "Menyimpan..." : "Simpan Fasilitator"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Separator />

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Daftar Fasilitator Terdaftar</CardTitle>
                            <CardDescription>Total {facilitators.length} fasilitator ditemukan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Lengkap</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Gender</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {facilitators.map((facilitator) => (
                                            <TableRow key={facilitator.id}>
                                                <TableCell className="font-medium">
                                                    {facilitator.fullName}
                                                    <p className="text-xs text-muted-foreground">{facilitator.nickname}</p>
                                                </TableCell>
                                                <TableCell>{facilitator.email}</TableCell>
                                                <TableCell>{facilitator.gender}</TableCell>
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
