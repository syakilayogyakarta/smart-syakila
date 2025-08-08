"use client";

import { studentProfile } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle, Briefcase, Activity, User, LogOut, BadgePercent, Wallet } from "lucide-react";
import Image from "next/image";

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
        <header>
          <Card className="p-6 flex flex-col sm:flex-row items-center justify-between shadow-md">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <Image src={studentProfile.photoUrl} alt={studentProfile.fullName} width={100} height={100} data-ai-hint={studentProfile.photoHint} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{studentProfile.fullName}</h1>
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
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wallet className="text-accent" /> Informasi Tabungan</CardTitle>
                <CardDescription>Rincian saldo dan riwayat transaksi tabungan Anda.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/10 p-6 rounded-lg text-center mb-6">
                  <p className="text-sm font-medium text-accent-foreground/80">Total Saldo Tabungan</p>
                  <p className="text-4xl font-bold text-accent">{formatCurrency(studentProfile.savings.balance)}</p>
                </div>

                <Tabs defaultValue="deposits" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="deposits">Riwayat Setoran</TabsTrigger>
                    <TabsTrigger value="withdrawals">Riwayat Penarikan</TabsTrigger>
                  </TabsList>
                  <TabsContent value="deposits">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Keterangan</TableHead>
                          <TableHead className="text-right">Jumlah</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentProfile.savings.deposits.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right font-medium text-green-600">{formatCurrency(item.amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="withdrawals">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                           <TableHead>Keterangan</TableHead>
                          <TableHead className="text-right">Jumlah</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentProfile.savings.withdrawals.map((item, index) => (
                           <TableRow key={index}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right font-medium text-red-600">-{formatCurrency(item.amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
