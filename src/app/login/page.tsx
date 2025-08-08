"use client"

import { useRouter } from "next/navigation"
import { KeyRound, Mail, Briefcase, GraduationCap, Shield } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (role: 'facilitator' | 'student' | 'parent') => {
    // For now, just navigate. Later, this can involve actual authentication.
    if (role === 'facilitator') {
      router.push('/facilitator/dashboard');
    } else if (role === 'student') {
      router.push('/student/dashboard');
    } else {
      // Placeholder for parent dashboard
      router.push('/student/dashboard'); // Temporarily point to student dashboard
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Image src="/logo.png" alt="Syakila Logo" width={100} height={100} className="mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold text-foreground">SMART Syakila</CardTitle>
          <CardDescription>Sistem Monitoring Aktivitas & Rapor Terpadu</CardDescription>
          <p className="text-sm text-muted-foreground">Sekolah Syakila Yogyakarta</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="email@contoh.com" className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" placeholder="********" className="pl-10" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full flex-col gap-3">
             <Button className="w-full" variant="outline" size="lg" onClick={() => handleLogin('facilitator')}>
              <Briefcase className="mr-2 h-5 w-5" /> Masuk sebagai Fasilitator
            </Button>
            <Button className="w-full" variant="outline" size="lg" onClick={() => handleLogin('student')}>
              <GraduationCap className="mr-2 h-5 w-5" /> Masuk sebagai Siswa
            </Button>
            <Button className="w-full" variant="outline" size="lg" onClick={() => handleLogin('parent')}>
              <Shield className="mr-2 h-5 w-5" /> Masuk sebagai Orang Tua
            </Button>
          </div>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Lupa password?
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
