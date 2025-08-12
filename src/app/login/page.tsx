
"use client"

import { useRouter } from "next/navigation"
import { User, Users, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getFacilitators, Facilitator } from "@/lib/data"
import { useEffect, useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [facilitators, setFacilitators] = useState<Facilitator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilitators() {
      try {
        const data = await getFacilitators();
        setFacilitators(data);
      } catch (error) {
        console.error("Failed to fetch facilitators", error);
        // Handle error, maybe show a toast
      } finally {
        setIsLoading(false);
      }
    }
    fetchFacilitators();
  }, []);

  const handleLogin = (facilitatorId: string) => {
    // In a real app, you'd use a proper auth system.
    // For this prototype, we'll use localStorage to remember the user.
    localStorage.setItem("loggedInFacilitatorId", facilitatorId)
    router.push('/facilitator/dashboard');
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
                  onClick={() => handleLogin(facilitator.id)}
                >
                  <User className="mr-4 h-5 w-5 text-primary" />
                  {facilitator.gender === 'Laki-laki' ? 'Mas' : 'Mba'} {facilitator.nickname}
              </Button>
            ))
          ) : (
             <p className="text-center text-muted-foreground">Belum ada data fasilitator. Silakan tambahkan terlebih dahulu.</p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
