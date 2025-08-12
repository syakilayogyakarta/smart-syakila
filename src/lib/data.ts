
import { Atom, FunctionSquare, Laptop, Palette, BookText, Languages, Drama, BookOpen, BookHeart, BrainCircuit, BookOpenCheck, HeartPulse } from 'lucide-react';

export const facilitators = [
    { fullName: "Evan Setiawan Parusa", nickname: "Evan", email: "evansparusa@gmail.com", gender: "Laki-laki" },
    { fullName: "Naashiih Aamiinul Basyiir", nickname: "Ibas", email: "ibnufahrurozi02@gmail.com", gender: "Laki-laki" },
    { fullName: "Lisa Purwandari", nickname: "Lisa", email: "", gender: "Perempuan" },
    { fullName: "Rahmanisa Widhia Anggraini", nickname: "Nisa", email: "", gender: "Perempuan" },
    { fullName: "Faddliyah", nickname: "Faddliyah", email: "", gender: "Perempuan" },
    { fullName: "Michael", nickname: "Michael", email: "", gender: "Laki-laki" },
];
export const getLoggedInFacilitator = () => {
    if (typeof window === 'undefined') {
        // Return a default or placeholder facilitator if on the server
        return null; 
    }
    const facilitatorName = localStorage.getItem("loggedInFacilitator");
    if (!facilitatorName) {
        return null;
    }
    return facilitators.find(f => f.fullName === facilitatorName) || null;
};


export const classes = ["Tarbiyah", "Ta'dib"];

export const studentsByClass: { [key: string]: string[] } = {
  "Tarbiyah": [
    "Muhammad Abdan Khioiri Tsabit",
    "Muhammad Aqifan al-Fatih",
    "Muhammad Irhab Mirza",
    "Yahya Ayyasyh Satriawan Hidayat",
  ],
  "Ta'dib": [
    "Athaniya Ghina Rafifa",
    "Avicenna Akthar Dhiyaulhaq",
    "Azzam Muhammad Matitaputi",
    "Nailah Amirah Khoirunnisa'",
  ],
};

export const studentDetails: { [key: string]: any } = {
    "Muhammad Abdan Khioiri Tsabit": { nickname: "Abdan", nisn: "1234567890", gender: "Laki-laki" },
    "Muhammad Aqifan al-Fatih": { nickname: "Aqifan", nisn: "1234567891", gender: "Laki-laki" },
    "Muhammad Irhab Mirza": { nickname: "Irhab", nisn: "1234567892", gender: "Laki-laki" },
    "Yahya Ayyasyh Satriawan Hidayat": { nickname: "Yahya", nisn: "1234567893", gender: "Laki-laki" },
    "Athaniya Ghina Rafifa": { nickname: "Niya", nisn: "1234567894", gender: "Perempuan" },
    "Avicenna Akthar Dhiyaulhaq": { nickname: "Avi", nisn: "1234567895", gender: "Laki-laki" },
    "Azzam Muhammad Matitaputi": { nickname: "Azzam", nisn: "1234567896", gender: "Laki-laki" },
    "Nailah Amirah Khoirunnisa'": { nickname: "Nailah", nisn: "1234567897", gender: "Perempuan" },
};


// Create a list of all students with their details for easier access
export const allStudents = Object.keys(studentsByClass).flatMap(className => 
    studentsByClass[className].map(fullName => {
        const details = studentDetails[fullName] || {};
        return {
            fullName,
            nickname: details.nickname,
            nisn: details.nisn,
            gender: details.gender,
            className,
        };
    })
);


export const allSubjects = [
  "IPA",
  "IPSKn",
  "IoT",
  "MFM",
  "B. Indonesia",
  "B. Jawa",
  "B. Inggris",
  "Minhaj",
  "Al-Qur'an & Tajwid",
  "Quran Tematik"
];


// New, more detailed data structure for facilitator assignments
export const facilitatorAssignments: { 
  [facilitatorName: string]: { 
    classes: { [className: string]: string[] };
    groups: string[];
  } 
} = {
  "Evan Setiawan Parusa": {
    classes: {
      "Tarbiyah": ["IoT", "IPA"],
      "Ta'dib": ["IoT", "IPA"],
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
  },
  "Naashiih Aamiinul Basyiir": {
    classes: {
      "Tarbiyah": ["B. Indonesia"],
      "Ta'dib": ["B. Indonesia"]
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
  },
  "Lisa Purwandari": {
    classes: {},
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
  },
  "Rahmanisa Widhia Anggraini": {
    classes: {
      "Tarbiyah": ["B. Inggris", "IPA"],
      "Ta'dib": ["B. Inggris", "IPA"],
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
  },
  "Faddliyah": {
    classes: {},
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
  },
  "Michael": {
    classes: {},
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
  }
};

// Dummy data for the academic journal log - NOW EMPTY
export const academicJournalLog: any[] = [];

// Dummy data for the stimulation/activity journal log - NOW EMPTY
export const stimulationJournalLog: any[] = [];

// New function to filter kegiatan data for a specific student
export const getKegiatanForStudent = (studentName: string) => {
    const history = stimulationJournalLog.filter(journal => journal.students.includes(studentName));
    
    const personalNotes = stimulationJournalLog.flatMap(journal => 
        journal.personalNotes.filter((note: any) => note.studentName === studentName)
    );

    return { history, personalNotes };
};
