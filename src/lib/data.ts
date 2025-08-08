export const facilitator = {
    name: "Ahmad Dahlan",
    class: "Kelas C",
  };
  
  export const classes = ["Kelas A", "Kelas B", "Kelas C", "Kelas D"];
  
  export const studentsByClass: { [key: string]: string[] } = {
    "Kelas A": ["Adi Saputra", "Budi Santoso", "Citra Lestari", "Dewi Anggraini", "Eka Wijaya"],
    "Kelas B": ["Fajar Nugroho", "Gita Puspita", "Hendra Gunawan", "Indah Permata", "Joko Susilo"],
    "Kelas C": ["Kartika Sari", "Lia Amelia", "Muhammad Rizky", "Nadia Fitriani", "Putri Ayu"],
    "Kelas D": ["Rian Hidayat", "Siti Nurhaliza", "Teguh Prakoso", "Utami Dewi", "Yoga Pratama"],
  };
  
  export const studentProfile = {
    fullName: "Syakila Putri",
    nickname: "Syakila",
    nisn: "1234567890",
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