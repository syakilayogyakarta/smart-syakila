
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar as CalendarIcon, Check, Loader2, Landmark, Wallet, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getClasses, getStudentsByClass as fetchStudentsByClass, Student, Class } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";

type TransactionType = 'setoran' | 'penarikan';
type StudentsByClassMap = { [className: string]: Student[] };

export default function SavingsPage() {
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [studentOptions, setStudentOptions] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [transactionType, setTransactionType] = useState<TransactionType>('setoran');
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "saved">("idle");
  const [isShaking, setIsShaking] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [studentsByClass, setStudentsByClass] = useState<StudentsByClassMap>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        try {
            const [classesData, studentsByClassData] = await Promise.all([
                getClasses(),
                fetchStudentsByClass()
            ]);
            setClasses(classesData);
            setStudentsByClass(studentsByClassData);
        } catch (error) {
            toast({ title: "Gagal memuat data", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [toast]);

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setSelectedStudent(""); // Reset student selection when class changes
    setStudentOptions(studentsByClass[className] || []);
  };

  const handleSave = () => {
    if (!selectedStudent || !amount) {
      setIsShaking(true);
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon pilih siswa dan isi nominal transaksi.",
        variant: "destructive",
      });
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setButtonState("loading");
    // In a real app, you would call a function to save the transaction to the blob store.
    console.log("Saving transaction:", {
      date: transactionDate,
      student: selectedStudent,
      type: transactionType,
      amount: parseFloat(amount),
      description,
    });
    
    setTimeout(() => {
      setButtonState("saved");
      toast({
        title: "Transaksi Berhasil!",
        description: `Transaksi telah disimpan.`,
      });
      // Reset form
      setSelectedStudent("");
      setSelectedClass("");
      setAmount("");
      setDescription("");
      setTransactionType("setoran");
      setTransactionDate(new Date());
      setStudentOptions([]);
      
      setTimeout(() => setButtonState("idle"), 2000);
    }, 1500);
  };
  
  const isSaveDisabled = buttonState !== 'idle';
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="relative mb-8 text-center">
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Tabungan Siswa</h1>
          <p className="text-muted-foreground mt-2">
            Catat transaksi setoran atau penarikan tabungan.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Formulir Transaksi</CardTitle>
            <CardDescription>Pilih kelas dan siswa untuk mencatat transaksi tabungan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Tanggal Transaksi</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !transactionDate && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {transactionDate ? format(transactionDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={transactionDate}
                        onSelect={setTransactionDate}
                        initialFocus
                        locale={id}
                    />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="class-select">Pilih Kelas</Label>
                <Select onValueChange={handleClassChange} value={selectedClass}>
                  <SelectTrigger id="class-select" className="w-full">
                    <SelectValue placeholder="Pilih Kelas..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
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
                    {studentOptions.map(s => <SelectItem key={s.id} value={s.id}>{s.fullName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Jenis Transaksi</Label>
               <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant={transactionType === 'setoran' ? 'default' : 'outline'}
                  className={cn(
                    "py-6 text-lg",
                    transactionType === 'setoran' ? "bg-green-600 hover:bg-green-700 text-white ring-2 ring-green-500/50" : "text-foreground"
                  )}
                  onClick={() => setTransactionType('setoran')}
                >
                  <Landmark className="mr-3 h-6 w-6" /> Setoran
                </Button>
                 <Button 
                  variant={transactionType === 'penarikan' ? 'destructive' : 'outline'}
                  className={cn(
                    "py-6 text-lg",
                    transactionType === 'penarikan' ? "ring-2 ring-destructive/50" : "text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                  )}
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
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="Contoh: 50000" 
                  className="pl-10 font-mono"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Keterangan (Opsional)</Label>
              <div className="relative">
                 <Edit3 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea 
                  id="description" 
                  placeholder="Contoh: Uang saku mingguan" 
                  className="pl-10"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className={cn(
                "w-full transition-all duration-300",
                isShaking && 'animate-shake'
              )}
              onClick={handleSave}
              disabled={isSaveDisabled}
              variant={transactionType === 'setoran' ? 'success' : 'destructive'}
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

    