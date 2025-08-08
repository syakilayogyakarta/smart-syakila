

export const facilitators = [];

// For now, we'll just use the first facilitator for the dashboard display.
// This can be changed later to support multi-facilitator login.
export const facilitator = {
    fullName: "",
    nickname: "",
    email: "",
    class: "",
};

export const classes = [];

export const studentsByClass: { [key: string]: string[] } = {};

export const studentDetails: { [fullName: string]: any } = {};


export const studentProfile = {
  fullName: "",
  nickname: "",
  nisn: "",
  photoUrl: "https://placehold.co/100x100.png",
  photoHint: "student portrait",
  attendance: {
    present: 0,
    late: 0,
    sick: 0,
    excused: 0
  },
  savings: {
    balance: 0,
    deposits: [],
    withdrawals: []
  }
};
