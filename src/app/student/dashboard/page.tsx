
"use client";

import React from 'react';
import { studentProfile, academicData, kegiatanData, getFacilitatorForSubject } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle2, AlertCircle, Briefcase, Activity, User, LogOut, BadgePercent, Wallet, BookCopy, Star, StickyNote, Calendar as CalendarIcon, UserCircle, Bell, MapPin, HeartPulse } from "lucide-react";
import Image from "next/image";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function StudentDashboard() {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const attendanceStats = [
    { label: "Hadir", value: studentProfile.attendance.present, icon: CheckCircle2, color: "text-green-500" },
    { label: "Terlambat", value: studentProfile.attendance.late, icon: AlertCircle, color: "text-yellow-500" },
    { label: "Sakit", value: studentProfile.attendance.sick, icon: Briefcase, color: "text-blue-500" },
    { label: "Izin", value: studentProfile.attendance.excused, icon: Activity, color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-10">
          <Image src="/logo.png" alt="Syakila Logo" width={80} height={80} className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground tracking-tight">SMART SYAKILA</h1>
          <p className="text-muted-foreground text-lg mt-1">Sistem Monitoring Aktivitas & Rapor Terpadu</p>
          <p className="text-muted-foreground text-lg">Sekolah Syakila Yogyakarta</p>
        </div>

        <header>
          <Card className="p-6 flex flex-col sm:flex-row items-center justify-between shadow-md">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                {studentProfile.photoUrl && <Image src={studentProfile.photoUrl} alt={studentProfile.fullName} width={100} height={100} data-ai-hint={studentProfile.photoHint} />}
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold text-foreground">{studentProfile.fullName}</h2>
                <p className="text-muted-foreground text-lg">Nama Panggilan: {studentProfile.nickname}</p>
                <p className="text-muted-foreground text-lg">NISN: {studentProfile.nisn}</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0" onClick={() => window.location.href = '/login'}>
              <LogOut className="mr-2 h-4 w-4" /> Keluar
            </Button>
          </Card>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BadgePercent className="text-primary" /> Rekapitulasi Presensi</CardTitle>
                <CardDescription>Ringkasan kehadiran Anda semester ini.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {attendanceStats.map(stat => (
                  <div key={stat.label} className="p-4 rounded-lg bg-secondary/50 flex flex-col items-center text-center">
                    <stat.icon className={`h-8 w-8 mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet className="text-accent" /> Informasi Tabungan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/10 p-6 rounded-lg text-center mb-6">
                  <p className="text-sm font-medium text-accent-foreground/80">Total Saldo Tabungan</p>
                  <p className="text-4xl font-bold text-accent">{formatCurrency(studentProfile.savings.balance)}</p>
                </div>
                 <Tabs defaultValue="deposits" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="deposits">Setoran</TabsTrigger>
                    <TabsTrigger value="withdrawals">Penarikan</TabsTrigger>
                  </TabsList>
                  <TabsContent value="deposits">
                     <ScrollArea className="h-48">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentProfile.savings.deposits.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell className="text-right font-medium text-green-600">{formatCurrency(item.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                     </ScrollArea>
                  </TabsContent>
                  <TabsContent value="withdrawals">
                     <ScrollArea className="h-48">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Jumlah</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentProfile.savings.withdrawals.map((item: any, index: number) => (
                            <TableRow key={index}>
                              <TableCell>{item.date}</TableCell>
                              <TableCell className="text-right font-medium text-red-600">-{formatCurrency(item.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookCopy className="text-blue-500" /> Ringkasan Akademik & Kegiatan</CardTitle>
                <CardDescription>Pantau progres, keaktifan, tugas, dan kegiatan Anda.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">

                  {/* Kegiatan & Stimulasi Card */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-md transition-all cursor-pointer bg-primary/5 border-primary/20">
                          <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', `${kegiatanData.color}/10`)}>
                                    <kegiatanData.icon className={cn('h-6 w-6', kegiatanData.color)}/>
                                  </div>
                                  <div>
                                    <p className="font-bold text-base">Kegiatan & Stimulasi</p>
                                    <p className="text-sm text-muted-foreground">Lihat riwayat aktivitas</p>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                          <DialogTitle className="flex items-center gap-3 text-2xl">
                              <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', `${kegiatanData.color}/10`)}>
                                <kegiatanData.icon className={cn('h-6 w-6', kegiatanData.color)}/>
                              </div>
                              Kegiatan & Stimulasi
                          </DialogTitle>
                          <DialogDescription className="pt-2">Riwayat semua kegiatan dan stimulasi yang Anda ikuti.</DialogDescription>
                      </DialogHeader>

                      <div className="mt-4">
                        <h3 className="font-bold text-lg mb-2">Riwayat Kegiatan</h3>
                        <ScrollArea className="h-60">
                          <div className="space-y-3 pr-4">
                            {kegiatanData.history.map((keg, index) => (
                              <div key={index} className="text-sm p-3 rounded-md bg-card border">
                                <p className="font-semibold text-muted-foreground">{keg.date}</p>
                                <p className="text-foreground">{keg.activity}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {keg.location}</p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Subject Cards */}
                  {academicData.subjects.map(subject => {
                    const facilitatorName = getFacilitatorForSubject(subject.name, studentProfile.fullName, studentProfile.class);
                    return (
                     <Dialog key={subject.name}>
                        <DialogTrigger asChild>
                           <Card className="hover:bg-primary/5 hover:shadow-md transition-all cursor-pointer">
                              <CardContent className="p-3 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                     <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', `${subject.color}/10`)}>
                                       <subject.icon className={cn('h-5 w-5', subject.color)}/>
                                     </div>
                                     <div>
                                        <p className="font-bold text-base">{subject.name}</p>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="font-semibold text-sm">{subject.averageActivity.toFixed(1)}</span>
                                            <span className="text-xs text-muted-foreground">(Rerata Keaktifan)</span>
                                        </div>
                                     </div>
                                 </div>
                                  {subject.task && (
                                    <div className="flex items-center gap-2 text-destructive">
                                      <Bell className="h-4 w-4" />
                                      <span className="text-xs font-semibold">Ada Tugas!</span>
                                    </div>
                                  )}
                              </CardContent>
                           </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[625px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl">
                               <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', `${subject.color}/10`)}>
                                 <subject.icon className={cn('h-6 w-6', subject.color)}/>
                               </div>
                               {subject.name}
                            </DialogTitle>
                             <DialogDescription className="flex items-center gap-2 pt-2">
                                <UserCircle className="h-4 w-4" /> Pengampu: {facilitatorName}
                             </DialogDescription>
                          </DialogHeader>
                          
                          {subject.task && (
                            <div className="mt-4 p-4 rounded-lg border bg-secondary/50">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><CalendarIcon className="h-5 w-5 text-primary" /> Tugas Aktif</h3>
                                <p>{subject.task.description}</p>
                                <Badge variant="destructive" className="mt-2 text-destructive-foreground">
                                    Deadline: {subject.task.deadline}
                                </Badge>
                            </div>
                          )}

                          <div className="mt-4">
                            <h3 className="font-bold text-lg mb-2">Riwayat Pertemuan</h3>
                            <ScrollArea className="h-60">
                              <div className="space-y-3 pr-4">
                                {subject.meetings.map(meeting => (
                                  <div key={meeting.date} className="text-sm p-3 rounded-md bg-card border">
                                    <p className="font-semibold text-muted-foreground">{meeting.date}</p>
                                    <p className="text-foreground">{meeting.topic}</p>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </div>
                        </DialogContent>
                      </Dialog>
                  )})}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
