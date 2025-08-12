
import { Atom, FunctionSquare, Laptop, Palette, BookText, Languages, Drama, BookOpen, BookHeart, BrainCircuit, BookOpenCheck, HeartPulse } from 'lucide-react';

export const facilitators = [
    { fullName: "Evan Setiawan Parusa", nickname: "Evan", email: "evansparusa@gmail.com", gender: "Laki-laki" },
    { fullName: "Naashiih Aamiinul Basyiir", nickname: "Ibas", email: "ibnufahrurozi02@gmail.com", gender: "Laki-laki" },
    { fullName: "Lisa Purwandari", nickname: "Lisa", email: "lisasyakila@gmail.com", gender: "Perempuan" },
    { fullName: "Amirotun Nafisah", nickname: "Sasa", email: "namirotun@gmail.com", gender: "Perempuan" },
    { fullName: "Rahmanisa Widhia Anggraini", nickname: "Nisa", email: "rahmanisaanggraini11@gmail.com", gender: "Perempuan" },
    { fullName: "Faddliyah", nickname: "Faddliyah", email: "faddliyah@example.com", gender: "Perempuan" },
    { fullName: "Michael", nickname: "Michael", email: "michael@example.com", gender: "Laki-laki" },
];

// This function should be called from client components only, as it uses localStorage.
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


export const classes = ["Tarbiyah", "Ta'dib", "Ta'lim 1", "Ta'lim 2"];

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
    "Ulin Najwa Nafi'a Ashari",
  ],
  "Ta'lim 1": [
    "Bima Andi Satria",
    "Ibrahim Viday Hafuza",
    "Muhammad Ismail Al-Fatih",
    "Muhammad Ziyad Dhiyaurrahman",
    "Rifa'a Windy Nur Pujiutami",
    "Rofi'i Sindy Nur Pujiutami",
    "Assafa Octaviola Putri Ismawan",
  ],
  "Ta'lim 2": [
    "Mayyada Zuhro",
    "Muhammad Hajid Al-Miqdad",
    "Muhammad Nabil",
    "Muhammad Nuhaa Naufali Ar-Rasis",
  ]
};

export const studentDetails: { [key: string]: any } = {
  "Muhammad Abdan Khioiri Tsabit": { nisn: "0123456001", nickname: "Abdan", dob: "14 November 2012", email: "abdan.muhammad2012@gmail.com", gender: "Laki-laki" },
  "Muhammad Aqifan al-Fatih": { nisn: "0123456002", nickname: "Aqif", dob: "12 April 2012", email: "aqif.muhammad2012@gmail.com", gender: "Laki-laki" },
  "Muhammad Irhab Mirza": { nisn: "0123456003", nickname: "Irhab", dob: "25 Mei 2013", email: "irhab.muhammad2013@gmail.com", gender: "Laki-laki" },
  "Yahya Ayyasyh Satriawan Hidayat": { nisn: "0123456004", nickname: "Ayyash", dob: "31 Maret 2011", email: "ayyash.yahya2011@gmail.com", gender: "Laki-laki" },
  "Athaniya Ghina Rafifa": { nisn: "0123456005", nickname: "Ghina", dob: "27 Februari 2012", email: "ghina.athaniya2012@gmail.com", gender: "Perempuan" },
  "Avicenna Akthar Dhiyaulhaq": { nisn: "0123456006", nickname: "Akhtar", dob: "10 Agustus 2011", email: "akhtar.avicenna2011@gmail.com", gender: "Laki-laki" },
  "Azzam Muhammad Matitaputi": { nisn: "0123456007", nickname: "Azzam", dob: "1 Maret 2011", email: "azzam.azzam2011@gmail.com", gender: "Laki-laki" },
  "Nailah Amirah Khoirunnisa'": { nisn: "0123456008", nickname: "Amirah", dob: "11 Desember 2010", email: "amirah.nailah2010@gmail.com", gender: "Perempuan" },
  "Ulin Najwa Nafi'a Ashari": { nisn: "0123456009", nickname: "Najwa", dob: "4 Januari 2011", email: "najwa.ulin2011@gmail.com", gender: "Perempuan" },
  "Bima Andi Satria": { nisn: "0123456010", nickname: "Bima", dob: "18 Juni 2009", email: "andi.bima2009@gmail.com", gender: "Laki-laki" },
  "Ibrahim Viday Hafuza": { nisn: "0123456011", nickname: "Fuza", dob: "6 Desember 2008", email: "fuza.ibrahim2008@gmail.com", gender: "Laki-laki" },
  "Muhammad Ismail Al-Fatih": { nisn: "0123456012", nickname: "Alfath", dob: "20 Agustus 2010", email: "alfath.muhammad2010@gmail.com", gender: "Laki-laki" },
  "Muhammad Ziyad Dhiyaurrahman": { nisn: "0123456013", nickname: "Ziyad", dob: "26 April 2009", email: "ziyad.muhammad2009@gmail.com", gender: "Laki-laki" },
  "Rifa'a Windy Nur Pujiutami": { nisn: "0123456014", nickname: "Indy", dob: "31 Agustus 2009", email: "indy.rifa'a2009@gmail.com", gender: "Perempuan" },
  "Rofi'i Sindy Nur Pujiutami": { nisn: "0123456015", nickname: "Fii", dob: "31 Agustus 2009", email: "fii.rofi'i2009@gmail.com", gender: "Perempuan" },
  "Assafa Octaviola Putri Ismawan": { nisn: "0123456016", nickname: "Assa", dob: "11 Oktober 2010", email: "assa.assafa2010@gmail.com", gender: "Perempuan" },
  "Mayyada Zuhro": { nisn: "0123456017", nickname: "May", dob: "1 Desember 2007", email: "may.mayyada2007@gmail.com", gender: "Perempuan" },
  "Muhammad Hajid Al-Miqdad": { nisn: "0123456018", nickname: "Hajid", dob: "11 Juni 2008", email: "hajid.muhammad2008@gmail.com", gender: "Laki-laki" },
  "Muhammad Nabil": { nisn: "0123456019", nickname: "Nabil", dob: "4 Maret 2008", email: "nabil.muhammad2008@gmail.com", gender: "Laki-laki" },
  "Muhammad Nuhaa Naufali Ar-Rasis": { nisn: "0123456020", nickname: "Nuha", dob: "16 Juni 2006", email: "nuha.muhammad2006@gmail.com", gender: "Laki-laki" },
};

// Create a list of all students with their details for easier access
export const allStudents = Object.keys(studentDetails).map(fullName => {
    const details = studentDetails[fullName];
    const className = Object.keys(studentsByClass).find(c => studentsByClass[c].includes(fullName));
    return {
        fullName,
        className,
        ...details
    };
});

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
      "Ta'lim 1": ["IoT", "IPA"],
      "Ta'lim 2": ["IoT", "IPA"],
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
  },
  "Naashiih Aamiinul Basyiir": {
    classes: {
      "Tarbiyah": ["B. Indonesia"],
      "Ta'dib": ["B. Indonesia"],
      "Ta'lim 1": ["IPSKn"],
      "Ta'lim 2": ["IPSKn"],
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
  },
  "Lisa Purwandari": {
    classes: {
      "Tarbiyah": ["B. Jawa"],
      "Ta'dib": ["B. Jawa"],
      "Ta'lim 1": ["B. Jawa"],
      "Ta'lim 2": ["B. Jawa"],
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
  },
  "Amirotun Nafisah": {
    classes: {
      "Tarbiyah": ["IPSKn"],
      "Ta'dib": ["IPSKn"],
      "Ta'lim 1": ["B. Indonesia"],
      "Ta'lim 2": ["B. Indonesia"],
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
  },
  "Rahmanisa Widhia Anggraini": {
    classes: {
      "Tarbiyah": ["B. Inggris", "IPA"],
      "Ta'dib": ["B. Inggris", "IPA"],
      "Ta'lim 1": ["B. Inggris"],
      "Ta'lim 2": ["B. Inggris"],
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

// Dummy data for academic overview - NOW EMPTY
export const academicData = {
  studentName: "",
  subjects: []
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
