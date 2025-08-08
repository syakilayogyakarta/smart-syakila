

export const facilitators = [
    {
        fullName: "Evan Setiawan Parusa",
        nickname: "Evan",
        email: "evansparusa@gmail.com",
        class: "Kelas Ta'lim 2",
    },
    {
        fullName: "Naashiih Aamiinul Basyiir",
        nickname: "Ibas",
        email: "ibnufahrurozi02@gmail.com",
        class: "Kelas Ta'lim 1",
    },
    {
        fullName: "Lisa Purwandari",
        nickname: "Lisa",
        email: "lisasyakila@gmail.com",
        class: "Kelas Tarbiyah",
    },
    {
        fullName: "Amirotun Nafisah",
        nickname: "Sasa",
        email: "namirotun@gmail.com",
        class: "Kelas Ta'dib",
    },
    {
        fullName: "Rahmanisa Widhia Anggraini",
        nickname: "Nisa",
        email: "rahmanisaanggraini11@gmail.com",
        class: "Kelas Ta'lim 2",
    }
];

// For now, we'll just use the first facilitator for the dashboard display.
// This can be changed later to support multi-facilitator login.
export const facilitator = facilitators[0];

export const classes = ["Kelas Tarbiyah", "Kelas Ta'dib", "Kelas Ta'lim 1", "Kelas Ta'lim 2"];

export const studentsByClass: { [key: string]: string[] } = {
  "Kelas Tarbiyah": [
      "Muhammad Abdan Khioiri Tsabit",
      "Muhammad Aqifan al-Fatih",
      "Muhammad Irhab Mirza",
      "Yahya Ayyasyh Satriawan Hidayat",
  ],
  "Kelas Ta'dib": [
      "Athaniya Ghina Rafifa",
      "Avicenna Akthar Dhiyaulhaq",
      "Azzam Muhammad Matitaputi",
      "Nailah Amirah Khoirunnisa'",
      "Ulin Najwa Nafi'a Ashari",
  ],
  "Kelas Ta'lim 1": [
      "Bima Andi Satria",
      "Ibrahim Viday Hafuza",
      "Muhammad Ismail Al-Fatih",
      "Muhammad Ziyad Dhiyaurrahman",
      "Rifa'a Windy Nur Pujiutami",
      "Rofi'i Sindy Nur Pujiutami",
      "Assafa Octaviola Putri Ismawan",
  ],
  "Kelas Ta'lim 2": [
      "Mayyada Zuhro",
      "Muhammad Hajid Al-Miqdad",
      "Muhammad Nabil",
      "Muhammad Nuhaa Naufali Ar-Rasis",
  ],
};

export const studentDetails: { [fullName: string]: any } = {
  "Muhammad Abdan Khioiri Tsabit": { nickname: "Abdan", dob: "14 November 2012" },
  "Muhammad Aqifan al-Fatih": { nickname: "Aqif", dob: "12 April 2012" },
  "Muhammad Irhab Mirza": { nickname: "Irhab", dob: "25 Mei 2013" },
  "Yahya Ayyasyh Satriawan Hidayat": { nickname: "Ayyash", dob: "31 Maret 2011" },
  "Athaniya Ghina Rafifa": { nickname: "Ghina", dob: "27 Februari 2012" },
  "Avicenna Akthar Dhiyaulhaq": { nickname: "Akhtar", dob: "10 Agustus 2011" },
  "Azzam Muhammad Matitaputi": { nickname: "Azzam", dob: "1 Maret 2011" },
  "Nailah Amirah Khoirunnisa'": { nickname: "Amirah", dob: "11 Desember 2010" },
  "Ulin Najwa Nafi'a Ashari": { nickname: "Najwa", dob: "4 Januari 2011" },
  "Bima Andi Satria": { nickname: "Andi", dob: "18 Juni 2009" },
  "Ibrahim Viday Hafuza": { nickname: "Fuza", dob: "6 Desember 2008" },
  "Muhammad Ismail Al-Fatih": { nickname: "Alfath", dob: "20 Agustus 2010" },
  "Muhammad Ziyad Dhiyaurrahman": { nickname: "Ziyad", dob: "26 April 2009" },
  "Rifa'a Windy Nur Pujiutami": { nickname: "Indy", dob: "31 Agustus 2009" },
  "Rofi'i Sindy Nur Pujiutami": { nickname: "Fii", dob: "31 Agustus 2009" },
  "Assafa Octaviola Putri Ismawan": { nickname: "Assa", dob: "11 Oktober 2010" },
  "Mayyada Zuhro": { nickname: "May", dob: "1 Desember 2007" },
  "Muhammad Hajid Al-Miqdad": { nickname: "Hajid", dob: "11 Juni 2008" },
  "Muhammad Nabil": { nickname: "Nabil", dob: "4 Maret 2008" },
  "Muhammad Nuhaa Naufali Ar-Rasis": { nickname: "Nuha", dob: "16 Juni 2006" },
};


export const studentProfile = {
  fullName: "Muhammad Abdan Khioiri Tsabit",
  nickname: "Abdan",
  nisn: "0012111401",
  photoUrl: "https://placehold.co/100x100.png",
  photoHint: "student portrait",
  attendance: {
    present: 18,
    late: 1,
    sick: 1,
    excused: 0
  },
  savings: {
    balance: 500000,
    deposits: [
      { date: "01 Mei 2024", amount: 100000, description: "Uang saku" },
      { date: "08 Mei 2024", amount: 150000, description: "Dari Nenek" },
      { date: "15 Mei 2024", amount: 100000, description: "Uang saku" },
      { date: "22 Mei 2024", amount: 200000, description: "Hadiah Lomba" },
    ],
    withdrawals: [
      { date: "10 Mei 2024", amount: 50000, description: "Beli buku" },
    ]
  }
};
