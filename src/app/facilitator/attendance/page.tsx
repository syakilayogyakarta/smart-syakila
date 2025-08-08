"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { studentsByClass, classes } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type AttendanceStatus = "Hadir" | "Terlambat" | "Sakit" | "Izin";

export default function AttendancePage() {
  const [timestamp, setTimestamp] = useState("");
  const [attendance, setAttendance] = useState<{ [studentName: string]: AttendanceStatus }>({});
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "saved">("idle");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', timeZoneName: 'short'
    };
    setTimestamp(new Intl.DateTimeFormat('id-ID', options).format(now));
  }, []);

  const handleStatusChange = (studentName: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentName]: status }));
  };
  
  const handleSave = () => {
    setButtonState("loading");
    console.log("Saving attendance:", attendance);
    setTimeout(() => {
      setButtonState("saved");
      toast({
        title: "Sukses!",
        description: "Data presensi berhasil disimpan.",
      });
      setTimeout(() => setButtonState("idle"), 2000);
    }, 1500);
  };

  const attendanceOptions: { id: AttendanceStatus, label: string }[] = [
    { id: 'Hadir', label: 'Hadir' },
    { id: 'Terlambat', label: 'Terlambat' },
    { id: 'Sakit', label: 'Sakit' },
    { id: 'Izin', label: 'Izin' },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="relative mb-8 text-center">
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Presensi Siswa</h1>
          <div className="text-muted-foreground mt-2 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {timestamp.split(',')[0]}, {timestamp.split(',')[1]}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {timestamp.split(' Pukul ')[1]}</div>
          </div>
        </header>

        <Card>
          <CardContent className="p-0">
            <Accordion type="multiple" className="w-full" defaultValue={classes.length > 0 ? [`kelas-${classes[0].toLowerCase().replace(' ', '-')}`] : []}>
              {classes.map((className) => (
                <AccordionItem value={`kelas-${className.toLowerCase().replace(' ', '-')}`} key={className}>
                  <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:bg-primary/5">{className}</AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-4">
                    <div className="space-y-4">
                      {(studentsByClass[className] || []).map((student, index) => (
                        <div key={student} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-card ${index % 2 === 0 ? 'bg-secondary/50' : ''}`}>
                          <p className="font-medium text-foreground mb-2 sm:mb-0">{student}</p>
                          <RadioGroup 
                            defaultValue="Hadir" 
                            className="flex flex-wrap gap-4"
                            onValueChange={(value) => handleStatusChange(student, value as AttendanceStatus)}
                          >
                            {attendanceOptions.map(option => (
                              <div className="flex items-center space-x-2" key={option.id}>
                                <RadioGroupItem value={option.id} id={`${student}-${option.id}`} />
                                <Label htmlFor={`${student}-${option.id}`}>{option.label}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <footer className="mt-12 text-center">
          <Button 
            size="lg" 
            className="w-full max-w-xs transition-all duration-300"
            onClick={handleSave}
            disabled={buttonState === 'loading' || buttonState === 'saved'}
            variant="accent"
          >
            {buttonState === "loading" && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {buttonState === "saved" && <Check className="mr-2 h-5 w-5" />}
            {buttonState === "loading" ? "Menyimpan..." : buttonState === "saved" ? "Tersimpan" : "Simpan Presensi"}
          </Button>
        </footer>
      </div>
    </div>
  );
}
