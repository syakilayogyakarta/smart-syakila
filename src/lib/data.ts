
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
        return facilitators[0]; 
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

export const studentDetails: { [fullName: string]: any } = {
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


// New, more detailed data structure for facilitator assignments
export const facilitatorAssignments: { 
  [facilitatorName: string]: { 
    classes: { [className: string]: string[] };
    groups: string[];
    mfm: string[]; // This can be deprecated or repurposed if MFM is fully a group subject
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
    mfm: []
  },
  "Naashiih Aamiinul Basyiir": {
    classes: {
      "Tarbiyah": ["B. Indonesia"],
      "Ta'dib": ["B. Indonesia"],
      "Ta'lim 1": ["IPSKn"],
      "Ta'lim 2": ["IPSKn"],
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
    mfm: []
  },
  "Lisa Purwandari": {
    classes: {
      "Tarbiyah": ["B. Jawa"],
      "Ta'dib": ["B. Jawa"],
      "Ta'lim 1": ["B. Jawa"],
      "Ta'lim 2": ["B. Jawa"],
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
    mfm: []
  },
  "Amirotun Nafisah": {
    classes: {
      "Tarbiyah": ["IPSKn"],
      "Ta'dib": ["IPSKn"],
      "Ta'lim 1": ["B. Indonesia"],
      "Ta'lim 2": ["B. Indonesia"],
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
    mfm: []
  },
  "Rahmanisa Widhia Anggraini": {
    classes: {
      "Tarbiyah": ["B. Inggris", "IPA"],
      "Ta'dib": ["B. Inggris", "IPA"],
      "Ta'lim 1": ["B. Inggris"],
      "Ta'lim 2": ["B. Inggris"],
    },
    groups: ["MFM", "Minhaj", "Al-Qur'an & Tajwid", "Quran Tematik"],
    mfm: []
  },
  "Faddliyah": {
    classes: {},
    groups: ["MFM"],
    mfm: []
  },
  "Michael": {
    classes: {},
    groups: ["MFM"],
    mfm: []
  }
};


// Function to get the facilitator for a specific subject and student
export const getFacilitatorForSubject = (subjectName: string, studentName: string, studentClass: string | undefined): string => {
  for (const facilitatorName in facilitatorAssignments) {
    const assignments = facilitatorAssignments[facilitatorName];
    // Check class assignments
    if (studentClass && assignments.classes[studentClass]?.includes(subjectName)) {
      return facilitatorName;
    }
    // Check group assignments
    if (assignments.groups.includes(subjectName)) {
      // This is complex as multiple facilitators can teach groups. 
      // This simplistic check returns the first one found.
      // A more robust system would be needed for a real app.
      return facilitatorName;
    }
    // Check MFM assignments
    if (subjectName === 'MFM' && assignments.mfm.includes(studentName)) {
      return facilitatorName;
    }
  }
  return "N/A"; // Default if no facilitator is found
};


export const studentDetailsList: { [fullName: string]: any } = {
  "Muhammad Abdan Khioiri Tsabit": { nisn: "0123456001", nickname: "abdan", dob: "14 November 2012", email: "abdan.muhammad2012@gmail.com" },
  "Muhammad Aqifan al-Fatih": { nisn: "0123456002", nickname: "aqif", dob: "12 April 2012", email: "aqif.muhammad2012@gmail.com" },
  "Muhammad Irhab Mirza": { nisn: "0123456003", nickname: "irhab", dob: "25 Mei 2013", email: "irhab.muhammad2013@gmail.com" },
  "Yahya Ayyasyh Satriawan Hidayat": { nisn: "0123456004", nickname: "ayyash", dob: "31 Maret 2011", email: "ayyash.yahya2011@gmail.com" },
  "Athaniya Ghina Rafifa": { nisn: "0123456005", nickname: "ghina", dob: "27 Februari 2012", email: "ghina.athaniya2012@gmail.com" },
  "Avicenna Akthar Dhiyaulhaq": { nisn: "0123456006", nickname: "akhtar", dob: "10 Agustus 2011", email: "akhtar.avicenna2011@gmail.com" },
  "Azzam Muhammad Matitaputi": { nisn: "0123456007", nickname: "azzam", dob: "1 Maret 2011", email: "azzam.azzam2011@gmail.com" },
  "Nailah Amirah Khoirunnisa'": { nisn: "0123456008", nickname: "amirah", dob: "11 Desember 2010", email: "amirah.nailah2010@gmail.com" },
  "Ulin Najwa Nafi'a Ashari": { nisn: "0123456009", nickname: "najwa", dob: "4 Januari 2011", email: "najwa.ulin2011@gmail.com" },
  "Bima Andi Satria": { nisn: "0123456010", nickname: "andi", dob: "18 Juni 2009", email: "andi.bima2009@gmail.com" },
  "Ibrahim Viday Hafuza": { nisn: "0123456011", nickname: "fuza", dob: "6 Desember 2008", email: "fuza.ibrahim2008@gmail.com" },
  "Muhammad Ismail Al-Fatih": { nisn: "0123456012", nickname: "alfath", dob: "20 Agustus 2010", email: "alfath.muhammad2010@gmail.com" },
  "Muhammad Ziyad Dhiyaurrahman": { nisn: "0123456013", nickname: "ziyad", dob: "26 April 2009", email: "ziyad.muhammad2009@gmail.com" },
  "Rifa'a Windy Nur Pujiutami": { nisn: "0123456014", nickname: "indy", dob: "31 Agustus 2009", email: "indy.rifa'a2009@gmail.com" },
  "Rofi'i Sindy Nur Pujiutami": { nisn: "0123456015", nickname: "fii", dob: "31 Agustus 2009", email: "fii.rofi'i2009@gmail.com" },
  "Assafa Octaviola Putri Ismawan": { nisn: "0123456016", nickname: "assa", dob: "11 Oktober 2010", email: "assa.assafa2010@gmail.com" },
  "Mayyada Zuhro": { nisn: "0123456017", nickname: "may", dob: "1 Desember 2007", email: "may.mayyada2007@gmail.com" },
  "Muhammad Hajid Al-Miqdad": { nisn: "0123456018", nickname: "hajid", dob: "11 Juni 2008", email: "hajid.muhammad2008@gmail.com" },
  "Muhammad Nabil": { nisn: "0123456019", nickname: "nabil", dob: "4 Maret 2008", email: "nabil.muhammad2008@gmail.com" },
  "Muhammad Nuhaa Naufali Ar-Rasis": { nisn: "0123456020", nickname: "nuha", dob: "16 Juni 2006", email: "nuha.muhammad2006@gmail.com" },
};

// This is dummy data and will be replaced with real data later.
export const studentProfile = {
  fullName: "Athaniya Ghina Rafifa",
  nickname: "Ghina",
  nisn: "0123456789",
  photoUrl: "https://placehold.co/100x100.png",
  photoHint: "student portrait",
  class: "Ta'dib",
  attendance: {
    present: 110,
    late: 2,
    sick: 1,
    excused: 0
  },
  savings: {
    balance: 250000,
    deposits: [
      { date: "15 Jul 2024", description: "Setoran rutin", amount: 50000 },
      { date: "08 Jul 2024", description: "Setoran rutin", amount: 50000 },
      { date: "01 Jul 2024", description: "Setoran rutin", amount: 50000 },
      { date: "24 Jun 2024", description: "Setoran rutin", amount: 50000 },
      { date: "17 Jun 2024", description: "Setoran rutin", amount: 50000 },
    ],
    withdrawals: [
        { date: "10 Jul 2024", description: "Beli buku", amount: 25000 },
    ]
  }
};

// Dummy data for academic overview
// The facilitator name will be dynamically assigned based on the student's class.
// This is a sample for a student in "Ta'dib" class.
export const academicData = {
  studentName: "Athaniya Ghina Rafifa",
  subjects: [
    {
      name: "IPA",
      facilitator: "Rahmanisa Widhia Anggraini", // Mengajar IPA di Tarbiyah & Ta'dib
      averageActivity: 4.5,
      icon: Atom,
      color: "text-green-500",
      task: {
        description: "Membuat rangkuman Bab 5 tentang Rantai Makanan.",
        deadline: "25 Juli 2024"
      },
      meetings: [
        { date: "16 Juli 2024", topic: "Mempelajari Ekosistem dan Komponennya" },
        { date: "09 Juli 2024", topic: "Praktikum Fotosintesis" },
        { date: "02 Juli 2024", topic: "Klasifikasi Makhluk Hidup" },
      ],
      personalNotes: [
        { date: "16 Juli 2024", note: "Ghina menunjukkan peningkatan signifikan dalam diskusi kelompok, sangat proaktif." },
        { date: "09 Juli 2024", note: "Perlu lebih teliti dalam mencatat hasil praktikum, namun antusiasmenya sangat baik." },
      ]
    },
    {
      name: "IPSKn",
      facilitator: "Amirotun Nafisah", // Mengajar IPSKn di Tarbiyah & Ta'dib
      averageActivity: 4.0,
      icon: Drama,
      color: "text-red-500",
      task: null,
      meetings: [
        { date: "17 Juli 2024", topic: "Sejarah Kerajaan Majapahit" },
        { date: "10 Juli 2024", topic: "Pahlawan Kemerdekaan Indonesia" },
        { date: "03 Juli 2024", topic: "Memahami Pancasila" },
      ],
      personalNotes: []
    },
    {
      name: "IoT",
      facilitator: "Evan Setiawan Parusa", // Mengajar IoT di semua kelas
      averageActivity: 4.8,
      icon: BrainCircuit,
      color: "text-blue-500",
      task: null,
      meetings: [
        { date: "18 Juli 2024", topic: "Dasar-dasar Arduino dan Sensor" },
        { date: "11 Juli 2024", topic: "Proyek Lampu Otomatis" },
      ],
      personalNotes: []
    },
     {
      name: "MFM",
      facilitator: "Naashiih Aamiinul Basyiir", // Asumsi
      averageActivity: 4.2,
      icon: FunctionSquare,
      color: "text-purple-500",
      task: {
        description: "Mengerjakan Latihan Soal Halaman 50.",
        deadline: "22 Juli 2024"
      },
       meetings: [
        { date: "15 Juli 2024", topic: "Aljabar dan Persamaan Linear" },
        { date: "08 Juli 2024", topic: "Geometri Bidang Datar" },
      ],
      personalNotes: []
    },
    {
      name: "B. Indonesia",
      facilitator: "Naashiih Aamiinul Basyiir", // Mengajar B. Indonesia di Tarbiyah & Ta'dib
      averageActivity: 4.3,
      icon: BookText,
      color: "text-orange-500",
      task: null,
       meetings: [
        { date: "19 Juli 2024", topic: "Menganalisis Unsur Intrinsik Cerpen" },
        { date: "12 Juli 2024", topic: "Menulis Puisi dengan Tema Bebas" },
      ],
      personalNotes: []
    },
    {
      name: "B. Jawa",
      facilitator: "Lisa Purwandari", // Mengajar B. Jawa di semua kelas
      averageActivity: 4.1,
      icon: Languages,
      color: "text-yellow-600",
      task: null,
       meetings: [
        { date: "19 Juli 2024", topic: "Nulis Aksara Jawa" },
        { date: "12 Juli 2024", topic: "Maca Geguritan" },
      ],
      personalNotes: []
    },
     {
      name: "B. Inggris",
      facilitator: "Rahmanisa Widhia Anggraini", // Mengajar B. Inggris di semua kelas
      averageActivity: 4.6,
      icon: Languages,
      color: "text-pink-500",
      task: {
        description: "Write a short story about your holiday.",
        deadline: "28 Juli 2024"
      },
       meetings: [
        { date: "20 Juli 2024", topic: "Simple Present Tense" },
        { date: "13 Juli 2024", topic: "Introduction and Greetings" },
      ],
      personalNotes: []
    },
     {
      name: "Minhaj",
      facilitator: "Amirotun Nafisah", // Asumsi
      averageActivity: 4.7,
      icon: BookHeart,
      color: "text-indigo-500",
      task: null,
       meetings: [
        { date: "20 Juli 2024", topic: "Adab dan Akhlak Seorang Muslim" },
        { date: "13 Juli 2024", topic: "Kisah Sahabat Nabi" },
      ],
      personalNotes: []
    },
     {
      name: "Al-Qur'an & Tajwid",
      facilitator: "Lisa Purwandari", // Asumsi
      averageActivity: 4.9,
      icon: BookOpen,
      color: "text-teal-500",
      task: {
        description: "Hafalan surat Al-Mulk ayat 1-5",
        deadline: "24 Juli 2024"
      },
       meetings: [
        { date: "21 Juli 2024", topic: "Hukum Nun Sukun dan Tanwin" },
        { date: "14 Juli 2024", topic: "Makharijul Huruf" },
      ],
      personalNotes: []
    },
     {
      name: "Quran Tematik",
      facilitator: "Evan Setiawan Parusa", // Asumsi
      averageActivity: 4.4,
      icon: BookOpenCheck,
      color: "text-cyan-500",
      task: null,
       meetings: [
        { date: "21 Juli 2024", topic: "Kisah Nabi Musa dalam Al-Qur'an" },
        { date: "14 Juli 2024", topic: "Tadabbur Alam" },
      ],
      personalNotes: []
    },
  ]
};

export const kegiatanData = {
  icon: HeartPulse,
  color: "text-rose-500",
  history: [
    {
      date: "22 Juli 2024",
      activity: "Bermain peran profesi (Dokter, Polisi, Guru)",
      location: "Ruang Kelas Tarbiyah",
    },
    {
      date: "15 Juli 2024",
      activity: "Membaca buku cerita bersama di taman",
      location: "Taman Sekolah",
    },
    {
      date: "08 Juli 2024",
      activity: "Senam pagi dan permainan tradisional",
      location: "Halaman Sekolah",
    }
  ],
  personalNotes: [
    {
      studentName: "Athaniya Ghina Rafifa",
      date: "22 Juli 2024",
      note: "Sangat antusias saat berperan sebagai dokter. Menunjukkan jiwa kepemimpinan saat bermain dengan teman-temannya."
    },
    {
      studentName: "Muhammad Irhab Mirza",
      date: "15 Juli 2024",
      note: "Membutuhkan dorongan untuk mau bercerita di depan teman-temannya, namun pendengar yang baik."
    }
  ]
};

// Dummy data for the academic journal log
export const academicJournalLog = [
  {
    id: 1,
    timestamp: "2024-07-23T10:00:00.000Z",
    facilitatorName: "Evan Setiawan Parusa",
    class: "Ta'lim 2",
    subject: "IoT",
    topic: "Pengenalan Proyek Smart School",
    importantNotes: "Siswa sangat antusias. Perlu disiapkan komponen tambahan untuk pertemuan berikutnya.",
    personalNotes: [
      { id: 101, studentName: "Muhammad Nabil", note: "Nabil menunjukkan bakat dalam programming, idenya sangat inovatif.", facilitatorName: "Evan Setiawan Parusa" },
      { id: 102, studentName: "Mayyada Zuhro", note: "Perlu bimbingan lebih dalam hal perakitan komponen.", facilitatorName: "Evan Setiawan Parusa" }
    ]
  },
  {
    id: 2,
    timestamp: "2024-07-23T08:00:00.000Z",
    facilitatorName: "Rahmanisa Widhia Anggraini",
    class: "Ta'dib",
    subject: "IPA",
    topic: "Praktikum Rantai Makanan",
    importantNotes: "Praktikum berjalan lancar. Semua kelompok berhasil menyelesaikan tugasnya.",
    personalNotes: [
      { id: 201, studentName: "Athaniya Ghina Rafifa", note: "Sangat aktif bertanya dan memimpin diskusi di kelompoknya.", facilitatorName: "Rahmanisa Widhia Anggraini" }
    ]
  },
  {
    id: 3,
    timestamp: "2024-07-22T09:00:00.000Z",
    facilitatorName: "Amirotun Nafisah",
    class: "Ta'lim 1",
    subject: "B. Indonesia",
    topic: "Menganalisis Puisi Chairil Anwar",
    importantNotes: "",
    personalNotes: []
  }
];

// Dummy data for the stimulation/activity journal log
export const stimulationJournalLog = [
  {
    id: 1,
    timestamp: "2024-07-25T09:30:00.000Z",
    facilitatorName: "Lisa Purwandari",
    kegiatan: "Senam Pagi Ceria",
    namaPemateri: "",
    jenisStimulasi: "Stimulasi Kesehatan Mental",
    lokasi: "Halaman Sekolah",
    catatanPenting: "Semua siswa mengikuti dengan gembira. Musik yang digunakan sangat disukai anak-anak.",
    personalNotes: [
      { id: 301, studentName: "Muhammad Aqifan al-Fatih", note: "Aqifan terlihat paling bersemangat dan mengikuti semua gerakan dengan baik.", facilitatorName: "Lisa Purwandari" }
    ]
  },
  {
    id: 2,
    timestamp: "2024-07-24T14:00:00.000Z",
    facilitatorName: "Evan Setiawan Parusa",
    kegiatan: "Workshop Robotik Dasar",
    namaPemateri: "Komunitas Robotika UGM",
    jenisStimulasi: "Stimulasi Bakat",
    lokasi: "Aula",
    catatanPenting: "Kerjasama dengan komunitas eksternal berjalan sukses. Perlu dijadwalkan lagi untuk sesi lanjutan.",
    personalNotes: [
      { id: 401, studentName: "Avicenna Akthar Dhiyaulhaq", note: "Akhtar sangat tertarik pada bagian perakitan, menunjukkan ketelitian yang baik.", facilitatorName: "Evan Setiawan Parusa" },
      { id: 402, studentName: "Ibrahim Viday Hafuza", note: "Menunjukkan minat pada logika pemrograman robot.", facilitatorName: "Evan Setiawan Parusa" }
    ]
  }
];
