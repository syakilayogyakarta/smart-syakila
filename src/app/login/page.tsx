
"use client"

import { useRouter } from "next/navigation"
import { User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { facilitators } from "@/lib/data"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (facilitatorFullName: string) => {
    // In a real app, you'd use a proper auth system.
    // For this prototype, we'll use localStorage to remember the user.
    localStorage.setItem("loggedInFacilitator", facilitatorFullName)
    router.push('/facilitator/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight font-headline">SMART SYAKILA</h1>
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
          {facilitators.map((facilitator) => (
             <Button 
                key={facilitator.fullName} 
                className="w-full justify-start h-14 text-lg" 
                variant="outline"
                onClick={() => handleLogin(facilitator.fullName)}
              >
                <User className="mr-4 h-5 w-5 text-primary" />
                {facilitator.nickname}
             </Button>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}
