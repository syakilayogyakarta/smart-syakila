
"use client"

import { useRouter } from "next/navigation"
import { User, Users, Loader2, KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator";

// Define interface for Facilitator locally for now
export interface Facilitator {
    id: string;
    fullName: string;
    nickname: string;
    email: string;
    gender: "Laki-laki" | "Perempuan";
}

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast();
  const [facilitators, setFacilitators] = useState<Facilitator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Clear any previous session
    localStorage.removeItem("loggedInFacilitatorId");
    localStorage.removeItem("isAdmin");

    async function fetchFacilitators() {
      try {
        const response = await fetch('/api/facilitators');
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data: Facilitator[] = await response.json();
        setFacilitators(data);
      } catch (error) {
        console.error("Failed to fetch facilitators", error);
        toast({ title: "Gagal memuat fasilitator", variant: "destructive"});
      } finally {
        setIsLoading(false);
      }
    }
    fetchFacilitators();
  }, [toast]);

  const handleFacilitatorLogin = (facilitatorId: string) => {
    localStorage.setItem("loggedInFacilitatorId", facilitatorId);
    localStorage.setItem("isAdmin", "false");
    router.push('/facilitator/dashboard');
  }

  const handleAdminLogin = () => {
    setIsSubmitting(true);
    if (password === "SYAKILA123") {
      localStorage.setItem("isAdmin", "true");
      toast({
        title: "Login Berhasil!",
        description: "Anda masuk sebagai Admin Utama.",
      });
      router.push('/facilitator/dashboard');
    } else {
      toast({
        title: "Login Gagal",
        description: "Password yang Anda masukkan salah.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-accent tracking-tight font-headline">SMART SYAKILA</h1>
          <p className="text-muted-foreground text-base md:text-lg mt-1">Sistem Monitoring Aktivitas & Rapor Terpadu</p>
          <p className="text-muted-foreground text-base md:text-lg">Sekolah Syakila Yogyakarta</p>
        </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Pilih Profil Fasilitator</CardTitle>
          <CardDescription>Klik pada nama Anda untuk masuk ke dasbor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : facilitators.length > 0 ? (
            facilitators.map((facilitator) => (
              <Button 
                  key={facilitator.id} 
                  className="w-full justify-start h-14 text-lg" 
                  variant="outline"
                  onClick={() => handleFacilitatorLogin(facilitator.id)}
                >
                  <User className="mr-4 h-5 w-5 text-primary" />
                  {facilitator.gender === 'Laki-laki' ? 'Mas' : 'Mba'} {facilitator.nickname}
              </Button>
            ))
          ) : (
             <p className="text-center text-muted-foreground">Belum ada data fasilitator. Silakan hubungi admin.</p>
          )}
        </CardContent>
        <div className="p-6 pt-0">
          <Separator className="my-4" />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full">
                <KeyRound className="mr-2 h-4 w-4" /> Login Sebagai Admin Utama
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Login Admin</DialogTitle>
                <DialogDescription>
                  Masukkan password admin untuk mengakses fitur manajemen data master.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>
              <DialogFooter>
                 <DialogClose asChild>
                    <Button variant="outline">Batal</Button>
                 </DialogClose>
                 <Button onClick={handleAdminLogin} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Masuk
                 </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </main>
  )
}
