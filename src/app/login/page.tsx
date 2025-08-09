"use client"

import { useRouter } from "next/navigation"
import { KeyRound, Mail, Briefcase } from "lucide-react"

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
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/facilitator/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="text-center mb-8">
          <Image src="/logo.png" alt="Syakila Logo" width={80} height={80} className="mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight font-headline">SMART SYAKILA</h1>
          <p className="text-muted-foreground text-lg mt-1">Sistem Monitoring Aktivitas & Rapor Terpadu</p>
          <p className="text-muted-foreground text-lg">Sekolah Syakila Yogyakarta</p>
        </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Login Fasilitator</CardTitle>
          <CardDescription>Masuk ke akun Anda untuk melanjutkan</CardDescription>
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
          <Button className="w-full" size="lg" onClick={handleLogin}>
            <Briefcase className="mr-2 h-5 w-5" /> Masuk
          </Button>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Lupa password?
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
