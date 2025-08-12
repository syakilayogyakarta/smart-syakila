
"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react";
import { ClipboardCheck, Banknote, ArrowRight, User, BookOpen, Activity, BookCopy, Calendar, Clock, Users, LogOut } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getLoggedInFacilitator } from "@/lib/data";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function FacilitatorDashboard() {
  const router = useRouter();
  const [facilitator, setFacilitator] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const loggedInFacilitator = getLoggedInFacilitator();
    if (!loggedInFacilitator) {
      router.push('/login');
    } else {
      setFacilitator(loggedInFacilitator);
    }
  }, [router]);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    const timer = setInterval(() => {
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta'
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta', hour12: false
      };
      setCurrentDate(new Intl.DateTimeFormat('id-ID', dateOptions).format(now));
      setCurrentTime(new Intl.DateTimeFormat('id-ID', timeOptions).format(now).replace(/\./g, ':'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInFacilitator");
    router.push('/login');
  };
  
  if (!facilitator) {
    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
            <p>Memuat data fasilitator...</p>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight font-headline">SMART SYAKILA</h1>
          <p className="text-muted-foreground text-base md:text-lg mt-1">Sistem Monitoring Aktivitas & Rapor Terpadu</p>
          <p className="text-muted-foreground text-base md:text-lg">Sekolah Syakila Yogyakarta</p>
        </div>

        <header className="mb-8">
          <Card className="p-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6 w-full">
              <Avatar className="h-20 w-20 sm:h-16 sm:w-16 self-center">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User className="h-10 w-10 sm:h-8 sm:w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="w-full flex flex-col items-center text-center sm:items-start sm:text-left">
                <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Selamat Datang, {facilitator.nickname}</h2>
                        <p className="text-muted-foreground">Dasbor Pengelolaan Kelas Anda</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="text-right">
                           <div className="flex items-center justify-end gap-2 text-foreground">
                              <Calendar className="h-5 w-5 text-foreground"/>
                              <span className="font-semibold text-lg">{currentDate || 'Memuat...'}</span>
                           </div>
                           <div className="flex items-center justify-end gap-2 text-muted-foreground">
                              <Clock className="h-5 w-5 text-muted-foreground"/>
                              <span className="font-semibold text-lg">{currentTime || '...'}</span>
                           </div>
                        </div>
                         <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Keluar
                         </Button>
                    </div>
                </div>

                 <div className="sm:hidden mt-4 space-y-4 w-full text-center">
                    <Separator />
                     <div className="flex items-center justify-center gap-2 text-foreground pt-2">
                          <Calendar className="h-4 w-4 text-foreground"/>
                          <span className="font-semibold">{currentDate || 'Memuat...'}</span>
                       </div>
                       <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 text-muted-foreground"/>
                          <span className="font-semibold">{currentTime || '...'}</span>
                       </div>
                    <Separator className="my-4"/>
                    <Button variant="outline" onClick={handleLogout} className="w-full max-w-xs mx-auto">
                        <LogOut className="mr-2 h-4 w-4" /> Keluar
                    </Button>
                 </div>
              </div>
            </div>
          </Card>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!['Faddliyah', 'Michael'].includes(facilitator.fullName) && (
              <>
                <Link href="/facilitator/attendance" passHref>
                  <Card className="group relative overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col justify-between">
                    <CardHeader>
                      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 transition-transform duration-300 group-hover:scale-110">
                        <ClipboardCheck className="h-12 w-12 text-accent" />
                      </div>
                      <CardTitle>Presensi</CardTitle>
                      <CardDescription>Kelola kehadiran siswa.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="font-semibold text-accent flex items-center justify-center">
                        Buka Presensi
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/facilitator/savings" passHref>
                  <Card className="group relative overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col justify-between">
                    <CardHeader>
                      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 transition-transform duration-300 group-hover:scale-110">
                        <Banknote className="h-12 w-12 text-destructive" />
                      </div>
                      <CardTitle>Tabungan</CardTitle>
                      <CardDescription>Catat tabungan siswa.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="font-semibold text-destructive flex items-center justify-center">
                        Buka Tabungan
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link href="/facilitator/students" passHref>
                  <Card className="group relative overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col justify-between">
                    <CardHeader>
                      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/10 transition-transform duration-300 group-hover:scale-110">
                        <Users className="h-12 w-12 text-orange-500" />
                      </div>
                      <CardTitle>Data Siswa</CardTitle>
                      <CardDescription>Lihat profil lengkap siswa.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="font-semibold text-orange-500 flex items-center justify-center">
                        Lihat Data
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
            
            <Link href="/facilitator/journal" passHref>
              <Card className="group relative overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col justify-between">
                <CardHeader>
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 transition-transform duration-300 group-hover:scale-110">
                    <BookOpen className="h-12 w-12 text-green-500" />
                  </div>
                  <CardTitle>Jurnal Pembelajaran</CardTitle>
                  <CardDescription>Isi jurnal pembelajaran.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-green-500 flex items-center justify-center">
                    Buka Jurnal
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/facilitator/stimulation" passHref>
              <Card className="group relative overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col justify-between">
                <CardHeader>
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/10 transition-transform duration-300 group-hover:scale-110">
                    <Activity className="h-12 w-12 text-blue-500" />
                  </div>
                  <CardTitle>Kegiatan/Stimulasi</CardTitle>
                  <CardDescription>Catat kegiatan & stimulasi.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-blue-500 flex items-center justify-center">
                    Buka Form
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/facilitator/journal-recap" passHref>
              <Card className="group relative overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col justify-between">
                <CardHeader>
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-500/10 transition-transform duration-300 group-hover:scale-110">
                    <BookCopy className="h-12 w-12 text-indigo-500" />
                  </div>
                  <CardTitle>Rekap Jurnal</CardTitle>
                  <CardDescription>Lihat semua jurnal akademik.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-indigo-500 flex items-center justify-center">
                    Lihat Rekap
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

          </div>
        </main>
      </div>
    </div>
  );
}
