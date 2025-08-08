export const facilitators = [
    { fullName: "Evan Setiawan Parusa", nickname: "Evan", email: "evansparusa@gmail.com", class: "Ta'lim 2" },
    { fullName: "Naashiih Aamiinul Basyiir", nickname: "Ibas", email: "ibnufahrurozi02@gmail.com", class: "Ta'lim 1" },
    { fullName: "Lisa Purwandari", nickname: "Lisa", email: "lisasyakila@gmail.com", class: "Tarbiyah" },
    { fullName: "Amirotun Nafisah", nickname: "Sasa", email: "namirotun@gmail.com", class: "Ta'dib" },
    { fullName: "Rahmanisa Widhia Anggraini", nickname: "Nisa", email: "rahmanisaanggraini11@gmail.com", class: "Ta'lim 2" },
];

// For now, we'll just use the first facilitator for the dashboard display.
// This can be changed later to support multi-facilitator login.
export const facilitator = facilitators[0];

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

export const studentDetails: { [fullName: string]: any } = {
  "Muhammad Abdan Khioiri Tsabit": { nickname: "Abdan", dob: "14 November 2012", email: "abdan.muhammad2012@gmail.com" },
  "Muhammad Aqifan al-Fatih": { nickname: "Aqif", dob: "12 April 2012", email: "aqif.muhammad2012@gmail.com" },
  "Muhammad Irhab Mirza": { nickname: "Irhab", dob: "25 Mei 2013", email: "irhab.muhammad2013@gmail.com" },
  "Yahya Ayyasyh Satriawan Hidayat": { nickname: "Ayyash", dob: "31 Maret 2011", email: "ayyash.yahya2011@gmail.com" },
  "Athaniya Ghina Rafifa": { nickname: "Ghina", dob: "27 Februari 2012", email: "ghina.athaniya2012@gmail.com" },
  "Avicenna Akthar Dhiyaulhaq": { nickname: "Akhtar", dob: "10 Agustus 2011", email: "akhtar.avicenna2011@gmail.com" },
  "Azzam Muhammad Matitaputi": { nickname: "Azzam", dob: "1 Maret 2011", email: "azzam.azzam2011@gmail.com" },
  "Nailah Amirah Khoirunnisa'": { nickname: "Amirah", dob: "11 Desember 2010", email: "amirah.nailah2010@gmail.com" },
  "Ulin Najwa Nafi'a Ashari": { nickname: "Najwa", dob: "4 Januari 2011", email: "najwa.ulin2011@gmail.com" },
  "Bima Andi Satria": { nickname: "Andi", dob: "18 Juni 2009", email: "andi.bima2009@gmail.com" },
  "Ibrahim Viday Hafuza": { nickname: "Fuza", dob: "6 Desember 2008", email: "fuza.ibrahim2008@gmail.com" },
  "Muhammad Ismail Al-Fatih": { nickname: "Alfath", dob: "20 Agustus 2010", email: "alfath.muhammad2010@gmail.com" },
  "Muhammad Ziyad Dhiyaurrahman": { nickname: "Ziyad", dob: "26 April 2009", email: "ziyad.muhammad2009@gmail.com" },
  "Rifa'a Windy Nur Pujiutami": { nickname: "Indy", dob: "31 Agustus 2009", email: "indy.rifa'a2009@gmail.com" },
  "Rofi'i Sindy Nur Pujiutami": { nickname: "Fii", dob: "31 Agustus 2009", email: "fii.rofi'i2009@gmail.com" },
  "Assafa Octaviola Putri Ismawan": { nickname: "Assa", dob: "11 Oktober 2010", email: "assa.assafa2010@gmail.com" },
  "Mayyada Zuhro": { nickname: "May", dob: "1 Desember 2007", email: "may.mayyada2007@gmail.com" },
  "Muhammad Hajid Al-Miqdad": { nickname: "Hajid", dob: "11 Juni 2008", email: "hajid.muhammad2008@gmail.com" },
  "Muhammad Nabil": { nickname: "Nabil", dob: "4 Maret 2008", email: "nabil.muhammad2008@gmail.com" },
  "Muhammad Nuhaa Naufali Ar-Rasis": { nickname: "Nuha", dob: "16 Juni 2006", email: "nuha.muhammad2006@gmail.com" },
};


// This is dummy data and will be replaced with real data later.
export const studentProfile = {
  fullName: "Athaniya Ghina Rafifa",
  nickname: "Ghina",
  nisn: "0123456789",
  photoUrl: "https://placehold.co/100x100.png",
  photoHint: "student portrait",
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
