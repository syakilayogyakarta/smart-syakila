
"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ClipboardCheck, PiggyBank, ArrowRight, User, BookOpen, HeartPulse, BookCopy, Calendar, Clock, Users, LogOut } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { facilitator } from "@/lib/data";

export default function FacilitatorDashboard() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
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

  if (!facilitator) {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <p>Memuat data fasilitator...</p>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Image src="/logo.png" alt="Syakila Logo" width={80} height={80} className="mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight font-headline">SMART SYAKILA</h1>
          <p className="text-muted-foreground text-lg mt-1">Sistem Monitoring Aktivitas & Rapor Terpadu</p>
          <p className="text-muted-foreground text-lg">Sekolah Syakila Yogyakarta</p>
        </div>

        <header className="mb-8">
          <Card className="p-6 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Selamat Datang, {facilitator.nickname}</h2>
                <p className="text-muted-foreground">Dasbor Pengelolaan Kelas Anda</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
                <div className="text-right mt-4 sm:mt-0">
                   <div className="flex items-center justify-end gap-2 text-foreground">
                      <Calendar className="h-5 w-5 text-primary"/>
                      <span className="font-semibold text-lg">{currentDate}</span>
                   </div>
                   <div className="flex items-center justify-end gap-2 text-muted-foreground">
                      <Clock className="h-5 w-5"/>
                      <span className="font-semibold text-lg">{currentTime}</span>
                   </div>
                </div>
                 <Button variant="outline" className="mt-4 sm:mt-0" onClick={() => window.location.href = '/login'}>
                    <LogOut className="mr-2 h-4 w-4" /> Keluar
                 </Button>
            </div>
          </Card>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                    <PiggyBank className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>Tabungan</CardTitle>
                  <CardDescription>Catat tabungan siswa.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-primary flex items-center justify-center">
                    Buka Tabungan
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/facilitator/journal" passHref>
              <Card className="group relative overflow-hidden text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full flex flex-col justify-between">
                <CardHeader>
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10 transition-transform duration-300 group-hover:scale-110">
                    <BookOpen className="h-12 w-12 text-green-500" />
                  </div>
                  <CardTitle>Jurnal Akademik</CardTitle>
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
                    <HeartPulse className="h-12 w-12 text-blue-500" />
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
          </div>
        </main>
      </div>
    </div>
  );
}
