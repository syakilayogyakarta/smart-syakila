"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Check, Loader2, Landmark, Wallet, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { studentsByClass, classes } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type TransactionType = 'setoran' | 'penarikan';

export default function SavingsPage() {
  const [timestamp, setTimestamp] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [studentOptions, setStudentOptions] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [transactionType, setTransactionType] = useState<TransactionType>('setoran');
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "saved">("idle");
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    };
    setTimestamp(new Intl.DateTimeFormat('id-ID', options).format(now).replace('.', ':'));
  }, []);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSelectedStudent("");
    setStudentOptions(studentsByClass[value] || []);
  };

  const handleSave = () => {
    setButtonState("loading");
    setTimeout(() => {
      setButtonState("saved");
      toast({
        title: "Transaksi Berhasil!",
        description: "Data tabungan telah berhasil diperbarui.",
      });
      // Reset form or redirect
      setTimeout(() => setButtonState("idle"), 2000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="relative mb-8 text-center">
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Tabungan Siswa</h1>
          <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" /> <span>{timestamp}</span> <Clock className="h-4 w-4" />
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Formulir Transaksi</CardTitle>
            <CardDescription>Pilih kelas dan siswa untuk mencatat transaksi tabungan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="class-select">Pilih Kelas</Label>
                <Select onValueChange={handleClassChange} value={selectedClass}>
                  <SelectTrigger id="class-select" className="w-full">
                    <SelectValue placeholder="Pilih Kelas..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-select">Pilih Siswa</Label>
                <Select onValueChange={setSelectedStudent} value={selectedStudent} disabled={!selectedClass}>
                  <SelectTrigger id="student-select" className="w-full">
                    <SelectValue placeholder="Pilih Siswa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {studentOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Jenis Transaksi</Label>
               <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant={transactionType === 'setoran' ? 'success' : 'outline'}
                  className={cn("py-6 text-lg", transactionType === 'setoran' && "ring-2 ring-green-500/50")}
                  onClick={() => setTransactionType('setoran')}
                >
                  <Landmark className="mr-3 h-6 w-6" /> Setoran
                </Button>
                 <Button 
                  variant={transactionType === 'penarikan' ? 'destructive' : 'outline'}
                  className={cn("py-6 text-lg", transactionType === 'penarikan' && "ring-2 ring-destructive/50")}
                  onClick={() => setTransactionType('penarikan')}
                >
                  <Wallet className="mr-3 h-6 w-6" /> Penarikan
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Nominal</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">Rp</span>
                <Input id="amount" type="number" placeholder="Contoh: 50000" className="pl-10 font-mono" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Keterangan (Opsional)</Label>
              <div className="relative">
                 <Edit3 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea id="description" placeholder="Contoh: Uang saku mingguan" className="pl-10" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full transition-all duration-300"
              onClick={handleSave}
              disabled={buttonState !== 'idle' || !selectedStudent}
              variant="success"
            >
              {buttonState === 'loading' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : buttonState === 'saved' ? <Check className="mr-2 h-5 w-5" /> : null}
              {buttonState === 'loading' ? 'Menyimpan...' : buttonState === 'saved' ? 'Tersimpan' : 'Simpan Transaksi'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
