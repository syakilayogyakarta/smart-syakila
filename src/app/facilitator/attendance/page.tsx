
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentsByClass, classes } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type AttendanceStatus = "Hadir" | "Terlambat" | "Sakit" | "Izin";

export default function AttendancePage() {
  const [timestamp, setTimestamp] = useState("");
  const [attendance, setAttendance] = useState<{ [studentName: string]: AttendanceStatus }>({});
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "saved">("idle");
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Initialize all students with 'Hadir' status
    const initialAttendance: { [studentName: string]: AttendanceStatus } = {};
    classes.forEach(className => {
      (studentsByClass[className] || []).forEach(student => {
        initialAttendance[student] = 'Hadir';
      });
    });
    setAttendance(initialAttendance);

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

  const attendanceOptions: { id: AttendanceStatus; label: string; style: string; }[] = [
    { id: 'Hadir', label: 'Hadir', style: 'border-green-500 text-green-600 hover:bg-green-500/10 data-[active=true]:bg-green-500 data-[active=true]:text-white' },
    { id: 'Terlambat', label: 'Terlambat', style: 'border-yellow-500 text-yellow-600 hover:bg-yellow-500/10 data-[active=true]:bg-yellow-500 data-[active=true]:text-white' },
    { id: 'Sakit', label: 'Sakit', style: 'border-blue-500 text-blue-600 hover:bg-blue-500/10 data-[active=true]:bg-blue-500 data-[active=true]:text-white' },
    { id: 'Izin', label: 'Izin', style: 'border-red-500 text-red-600 hover:bg-red-500/10 data-[active=true]:bg-red-500 data-[active=true]:text-white' },
  ];

  const getStatusStyle = (status: AttendanceStatus) => {
    switch (status) {
      case 'Hadir': return 'text-green-600 border-green-500';
      case 'Terlambat': return 'text-yellow-600 border-yellow-500';
      case 'Sakit': return 'text-blue-600 border-blue-500';
      case 'Izin': return 'text-red-600 border-red-500';
      default: return 'text-foreground border-border';
    }
  };


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
                  <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:bg-primary/5">{`Kelas ${className}`}</AccordionTrigger>
                  <AccordionContent className="px-6 pt-0 pb-4">
                    <div className="space-y-4">
                      {(studentsByClass[className] || []).map((student, index) => (
                        <div key={student} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-card ${index % 2 === 0 ? 'bg-secondary/50' : ''}`}>
                          <p className="font-medium text-foreground mb-4 sm:mb-0">{student}</p>
                          
                          {/* Desktop: Buttons */}
                           <div className="hidden sm:grid sm:grid-cols-4 gap-2">
                            {attendanceOptions.map(option => (
                              <Button
                                key={option.id}
                                variant="outline"
                                data-active={attendance[student] === option.id}
                                className={cn(
                                  "border-2 transition-all duration-200",
                                  option.style
                                )}
                                onClick={() => handleStatusChange(student, option.id)}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                          
                          {/* Mobile: Dropdown */}
                          <div className="w-full sm:hidden">
                             <Select value={attendance[student]} onValueChange={(value: AttendanceStatus) => handleStatusChange(student, value)}>
                                <SelectTrigger className={cn("h-12 text-base font-semibold border-2", getStatusStyle(attendance[student]))}>
                                  <SelectValue placeholder="Pilih status..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {attendanceOptions.map(option => (
                                      <SelectItem key={option.id} value={option.id} className="text-base">
                                          {option.label}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                             </Select>
                          </div>

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
