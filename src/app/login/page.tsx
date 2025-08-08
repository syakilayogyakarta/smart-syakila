"use client"

import { useRouter } from "next/navigation"
import { KeyRound, Mail } from "lucide-react"
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
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <Button className="w-full" variant="outline" onClick={() => router.push('/student/dashboard')}>
              Masuk sebagai Siswa
            </Button>
            <Button className="w-full" variant="accent" onClick={() => router.push('/facilitator/dashboard')}>
              Masuk sebagai Fasilitator
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