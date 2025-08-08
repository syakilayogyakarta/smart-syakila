
import { Atom, FunctionSquare, Laptop, Palette, BookText, Languages, Drama, BookOpen, BookHeart, BrainCircuit, BookOpenCheck } from 'lucide-react';

export const facilitators = [
    { fullName: "Evan Setiawan Parusa", nickname: "Evan", email: "evansparusa@gmail.com", class: "Ta'lim 2" },
    { fullName: "Naashiih Aamiinul Basyiir", nickname: "Ibas", email: "ibnufahrurozi02@gmail.com", class: "Ta'lim 1" },
    { fullName: "Lisa Purwandari", nickname: "Lisa", email: "lisasyakila@gmail.com", class: "Tarbiyah" },
    { fullName: "Amirotun Nafisah", nickname: "Sasa", email: "namirotun@gmail.com", class: "Ta'dib" },
    { fullName: "Rahmanisa Widhia Anggraini", nickname: "Nisa", email: "rahmanisaanggraini11@gmail.com", class: "Ta'lim 2" },
];

// Set the currently logged-in facilitator.
export const facilitator = facilitators.find(f => f.fullName === "Evan Setiawan Parusa")!;

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

export const subjects = [
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

// New data structure for facilitator teaching assignments
export const facilitatorSubjects: { [facilitatorName: string]: { [subject: string]: string[] | 'all' } } = {
  "Evan Setiawan Parusa": {
    "IoT": "all",
    "IPA": ["Ta'lim 1", "Ta'lim 2"],
    "MFM": "all",
    "Minhaj": "all",
    "Al-Qur'an & Tajwid": "all",
    "Quran Tematik": "all"
  },
  "Naashiih Aamiinul Basyiir": {
    "B. Indonesia": ["Tarbiyah", "Ta'dib"],
    "IPSKn": ["Ta'lim 1", "Ta'lim 2"],
    "MFM": "all",
    "Minhaj": "all",
    "Al-Qur'an & Tajwid": "all",
    "Quran Tematik": "all"
  },
  "Lisa Purwandari": {
    "B. Jawa": "all",
    "MFM": "all",
    "Minhaj": "all",
    "Al-Qur'an & Tajwid": "all",
    "Quran Tematik": "all"
  },
  "Amirotun Nafisah": {
    "IPSKn": ["Tarbiyah", "Ta'dib"],
    "B. Indonesia": ["Ta'lim 1", "Ta'lim 2"],
    "MFM": "all",
    "Minhaj": "all",
    "Al-Qur'an & Tajwid": "all",
    "Quran Tematik": "all"
  },
  "Rahmanisa Widhia Anggraini": {
    "B. Inggris": "all",
    "IPA": ["Tarbiyah", "Ta'dib"],
    "MFM": "all",
    "Minhaj": "all",
    "Al-Qur'an & Tajwid": "all",
    "Quran Tematik": "all"
  }
};


export const studentDetails: { [fullName: string]: any } = {
  "Muhammad Abdan Khioiri Tsabit": { nickname: "abdan", dob: "14 November 2012", email: "abdan.muhammad2012@gmail.com" },
  "Muhammad Aqifan al-Fatih": { nickname: "aqif", dob: "12 April 2012", email: "aqif.muhammad2012@gmail.com" },
  "Muhammad Irhab Mirza": { nickname: "irhab", dob: "25 Mei 2013", email: "irhab.muhammad2013@gmail.com" },
  "Yahya Ayyasyh Satriawan Hidayat": { nickname: "ayyash", dob: "31 Maret 2011", email: "ayyash.yahya2011@gmail.com" },
  "Athaniya Ghina Rafifa": { nickname: "ghina", dob: "27 Februari 2012", email: "ghina.athaniya2012@gmail.com" },
  "Avicenna Akthar Dhiyaulhaq": { nickname: "akhtar", dob: "10 Agustus 2011", email: "akhtar.avicenna2011@gmail.com" },
  "Azzam Muhammad Matitaputi": { nickname: "azzam", dob: "1 Maret 2011", email: "azzam.azzam2011@gmail.com" },
  "Nailah Amirah Khoirunnisa'": { nickname: "amirah", dob: "11 Desember 2010", email: "amirah.nailah2010@gmail.com" },
  "Ulin Najwa Nafi'a Ashari": { nickname: "najwa", dob: "4 Januari 2011", email: "najwa.ulin2011@gmail.com" },
  "Bima Andi Satria": { nickname: "andi", dob: "18 Juni 2009", email: "andi.bima2009@gmail.com" },
  "Ibrahim Viday Hafuza": { nickname: "fuza", dob: "6 Desember 2008", email: "fuza.ibrahim2008@gmail.com" },
  "Muhammad Ismail Al-Fatih": { nickname: "alfath", dob: "20 Agustus 2010", email: "alfath.muhammad2010@gmail.com" },
  "Muhammad Ziyad Dhiyaurrahman": { nickname: "ziyad", dob: "26 April 2009", email: "ziyad.muhammad2009@gmail.com" },
  "Rifa'a Windy Nur Pujiutami": { nickname: "indy", dob: "31 Agustus 2009", email: "indy.rifa'a2009@gmail.com" },
  "Rofi'i Sindy Nur Pujiutami": { nickname: "fii", dob: "31 Agustus 2009", email: "fii.rofi'i2009@gmail.com" },
  "Assafa Octaviola Putri Ismawan": { nickname: "assa", dob: "11 Oktober 2010", email: "assa.assafa2010@gmail.com" },
  "Mayyada Zuhro": { nickname: "may", dob: "1 Desember 2007", email: "may.mayyada2007@gmail.com" },
  "Muhammad Hajid Al-Miqdad": { nickname: "hajid", dob: "11 Juni 2008", email: "hajid.muhammad2008@gmail.com" },
  "Muhammad Nabil": { nickname: "nabil", dob: "4 Maret 2008", email: "nabil.muhammad2008@gmail.com" },
  "Muhammad Nuhaa Naufali Ar-Rasis": { nickname: "nuha", dob: "16 Juni 2006", email: "nuha.muhammad2006@gmail.com" },
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
