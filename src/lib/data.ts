
'use server';

// This file will contain all the functions to interact with the Vercel Blob storage.
// We will replace all the mock data with functions that fetch data from the blob storage.

import { put, del, list } from '@vercel/blob';
import { 
    DB_KEY_ACADEMIC_LOG,
    DB_KEY_ASSIGNMENTS,
    DB_KEY_ATTENDANCE,
    DB_KEY_CLASSES,
    DB_KEY_FACILITATORS,
    DB_KEY_SAVINGS,
    DB_KEY_STIMULATION_LOG,
    DB_KEY_STUDENTS,
    DB_KEY_SUBJECTS
} from './kv';

// Define interfaces for our data structures

export interface Facilitator {
    id: string;
    fullName: string;
    nickname: string;
    email: string;
    gender: "Laki-laki" | "Perempuan";
}

export interface Class {
    id: string;
    name: string;
}

export interface Student {
    id: string;
    fullName: string;
    nickname: string;
    nisn: string;
    classId: string;
    gender: "Laki-laki" | "Perempuan";
}

export interface Subject {
    id: string;
    name: string;
}

export interface FacilitatorAssignments {
    [facilitatorId: string]: {
        classes: { [classId: string]: string[] }; // subjectIds
        groups: string[]; // subjectIds
    };
}

export interface AcademicJournalLog {
    id: string;
    timestamp: string;
    facilitatorId: string;
    classId: string;
    subjectId: string;
    topic: string;
    importantNotes: string;
    studentActiveness: { [studentId: string]: number };
    studentHomeworkScores: { [studentId: string]: number };
    personalNotes: {
        id: string;
        studentId: string;
        note: string;
        facilitatorId: string;
    }[];
}

export interface StimulationJournalLog {
    id: string;
    timestamp: string;
    facilitatorName: string; // Keep name for display
    mode: "klasikal" | "kelas" | "kelompok";
    class: string; // Keep name for display
    students: string[]; // Keep names for display
    kegiatan: string;
    namaPemateri: string;
    jenisStimulasi: string;
    lokasi: string;
    catatanPenting: string;
    personalNotes: {
        id: string;
        studentName: string;
        note: string;
        facilitatorName: string;
        timestamp: string;
    }[];
}

export interface AttendanceLog {
    id: string;
    date: string; // ISO string
    records: {
        [studentId: string]: "Hadir" | "Terlambat" | "Sakit" | "Izin";
    };
}

export interface SavingTransaction {
    id: string;
    date: string; // ISO string
    studentId: string;
    type: 'setoran' | 'penarikan';
    amount: number;
    description: string;
}

const VERCEL_BLOB_STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.split("_")[2]?.toLowerCase();
const VERCEL_BLOB_BASE_URL = VERCEL_BLOB_STORE_ID 
    ? `https://${VERCEL_BLOB_STORE_ID}.public.blob.vercel-storage.com`
    : '';

// Helper function to fetch data from blob
async function getFromBlob<T>(key: string, isObject: boolean = false): Promise<T> {
    const initialData = isObject ? {} : [];
    if (!VERCEL_BLOB_BASE_URL) {
        console.warn("Vercel Blob URL is not configured. Returning initial data.");
        return initialData as T;
    }

    try {
        const blobUrl = `${VERCEL_BLOB_BASE_URL}/${key}`;
        const response = await fetch(blobUrl, { cache: 'no-store' });

        if (response.status === 404) {
             // File doesn't exist, create it with initial data
            await saveToBlob(key, initialData);
            return initialData as T;
        }

        if (!response.ok) {
            console.error(`Failed to fetch blob ${key}, status: ${response.status}`);
            return initialData as T;
        }

        const text = await response.text();
        if (!text) {
             return initialData as T;
        }

        return JSON.parse(text) as T;

    } catch (error) {
        console.error(`Error fetching or parsing data for key ${key}:`, error);
        return initialData as T;
    }
}

// Helper function to save data to blob
async function saveToBlob(key: string, data: any) {
    // Overwrite the file by deleting the old one and putting the new one.
    // This is more efficient than using list() to check for existence.
    await put(key, JSON.stringify(data, null, 2), {
        access: 'public',
        contentType: 'application/json',
        allowOverwrite: true,
    });
}

// --- Facilitators ---
export async function getFacilitators(): Promise<Facilitator[]> {
 return await getFromBlob<Facilitator[]>(DB_KEY_FACILITATORS);
}

export async function addFacilitator(facilitatorData: Omit<Facilitator, 'id'>) {
    const facilitators = await getFacilitators();

    if (facilitators.some(f => f.email === facilitatorData.email)) {
        throw new Error('A facilitator with this email already exists.');
    }
    
    const newFacilitator = { ...facilitatorData, id: crypto.randomUUID() };
    facilitators.push(newFacilitator);
    await saveToBlob(DB_KEY_FACILITATORS, facilitators);
    return newFacilitator;
}

export async function updateFacilitator(id: string, data: Partial<Omit<Facilitator, 'id'>>) {
    let facilitators = await getFacilitators();
    const existingFacilitator = facilitators.find(f => f.email === data.email && f.id !== id);
    if (existingFacilitator) {
        throw new Error('Another facilitator with this email already exists.');
    }
    facilitators = facilitators.map(f => f.id === id ? { ...f, ...data } : f);
    await saveToBlob(DB_KEY_FACILITATORS, facilitators);
}

export async function deleteFacilitator(id: string) {
    let facilitators = await getFacilitators();
    facilitators = facilitators.filter(f => f.id !== id);
    await saveToBlob(DB_KEY_FACILITATORS, facilitators);
}

// --- Classes ---
export async function getClasses(): Promise<Class[]> {
    return await getFromBlob<Class[]>(DB_KEY_CLASSES);
}
export async function addClass(name: string): Promise<Class> {
    const classes = await getClasses();
     if (classes.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        throw new Error('Class with this name already exists.');
    }
    const newClass = { id: crypto.randomUUID(), name };
    classes.push(newClass);
    await saveToBlob(DB_KEY_CLASSES, classes);
    return newClass;
}
export async function updateClass(id: string, name: string) {
    let classes = await getClasses();
    if (classes.some(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== id)) {
        throw new Error('Another class with this name already exists.');
    }
    classes = classes.map(c => c.id === id ? { ...c, name } : c);
    await saveToBlob(DB_KEY_CLASSES, classes);
}
export async function deleteClass(id: string) {
    let classes = await getClasses();
    classes = classes.filter(c => c.id !== id);
    await saveToBlob(DB_KEY_CLASSES, classes);
}

// --- Students ---
export async function getStudents(): Promise<Student[]> {
    return await getFromBlob<Student[]>(DB_KEY_STUDENTS);
}
export async function getStudentsByClass() {
    const students = await getStudents();
    const classes = await getClasses();
    const studentsByClass: { [className: string]: Student[] } = {};

    for (const c of classes) {
        studentsByClass[c.name] = students.filter(s => s.classId === c.id);
    }
    return studentsByClass;
}
export async function addStudent(student: Omit<Student, 'id'>) {
    const students = await getStudents();
    if (student.nisn && students.some(s => s.nisn === student.nisn)) {
        throw new Error('A student with this NISN already exists.');
    }
    const newStudent = { ...student, id: crypto.randomUUID() };
    students.push(newStudent);
    await saveToBlob(DB_KEY_STUDENTS, students);
}
export async function updateStudent(id: string, data: Partial<Student>) {
    let students = await getStudents();
    if (data.nisn && students.some(s => s.nisn === data.nisn && s.id !== id)) {
         throw new Error('Another student with this NISN already exists.');
    }
    students = students.map(s => s.id === id ? { ...s, ...data } : s);
    await saveToBlob(DB_KEY_STUDENTS, students);
}
export async function deleteStudent(id: string) {
    let students = await getStudents();
    students = students.filter(s => s.id !== id);
    await saveToBlob(DB_KEY_STUDENTS, students);
}


// --- Subjects ---
export async function getSubjects(): Promise<Subject[]> {
    return await getFromBlob<Subject[]>(DB_KEY_SUBJECTS);
}
export async function addSubject(name: string): Promise<Subject> {
    const subjects = await getSubjects();
     if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        throw new Error('Subject with this name already exists.');
    }
    const newSubject = { id: crypto.randomUUID(), name };
    subjects.push(newSubject);
    await saveToBlob(DB_KEY_SUBJECTS, subjects);
    return newSubject;
}
export async function updateSubject(id: string, name: string) {
    let subjects = await getSubjects();
    if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase() && s.id !== id)) {
         throw new Error('Another subject with this name already exists.');
    }
    subjects = subjects.map(s => s.id === id ? { ...s, name } : s);
    await saveToBlob(DB_KEY_SUBJECTS, subjects);
}
export async function deleteSubject(id: string) {
    let subjects = await getSubjects();
    subjects = subjects.filter(s => s.id !== id);
    await saveToBlob(DB_KEY_SUBJECTS, subjects);
}


// --- Assignments ---
export async function getFacilitatorAssignments(): Promise<FacilitatorAssignments> {
    return await getFromBlob<FacilitatorAssignments>(DB_KEY_ASSIGNMENTS, true);
}
export async function saveFacilitatorAssignments(assignments: FacilitatorAssignments) {
    await saveToBlob(DB_KEY_ASSIGNMENTS, assignments);
}

// --- Academic Journal ---
export async function getAcademicJournalLog(): Promise<AcademicJournalLog[]> {
    return await getFromBlob<AcademicJournalLog[]>(DB_KEY_ACADEMIC_LOG);
}
export async function addAcademicJournalLog(entry: Omit<AcademicJournalLog, 'id'>) {
    const logs = await getAcademicJournalLog();
    const newLog = { ...entry, id: crypto.randomUUID() };
    logs.unshift(newLog); // Add to the beginning
    await saveToBlob(DB_KEY_ACADEMIC_LOG, logs);
}
export async function deleteAcademicJournal(journalId: string) {
    let logs = await getAcademicJournalLog();
    logs = logs.filter(j => j.id !== journalId);
    await saveToBlob(DB_KEY_ACADEMIC_LOG, logs);
}
export async function addPersonalNoteToAcademicLog(journalId: string, noteData: AcademicJournalLog['personalNotes'][0]) {
    let logs = await getAcademicJournalLog();
    logs = logs.map(log => {
        if (log.id === journalId) {
            if (!log.personalNotes) {
              log.personalNotes = [];
            }
            log.personalNotes.push(noteData);
        }
        return log;
    });
    await saveToBlob(DB_KEY_ACADEMIC_LOG, logs);
}


// --- Stimulation Journal ---
export async function getStimulationJournalLog(): Promise<StimulationJournalLog[]> {
     return await getFromBlob<StimulationJournalLog[]>(DB_KEY_STIMULATION_LOG);
}
export async function addStimulationJournalLog(entry: Omit<StimulationJournalLog, 'id'>) {
    const logs = await getStimulationJournalLog();
    const newLog = { ...entry, id: crypto.randomUUID() };
    logs.unshift(newLog); // Add to the beginning
    await saveToBlob(DB_KEY_STIMULATION_LOG, logs);
}
export async function deleteStimulationJournal(journalId: string) {
    let logs = await getStimulationJournalLog();
    logs = logs.filter(j => j.id !== journalId);
    await saveToBlob(DB_KEY_STIMULATION_LOG, logs);
}


// --- Student Profile Data Aggregation ---
export async function getKegiatanForStudent(studentName: string) {
    const log = await getStimulationJournalLog();
    const history = log.filter(journal => journal.students.includes(studentName));
    
    const personalNotes = log.flatMap(journal => 
        (journal.personalNotes || []).filter((note: any) => note.studentName === studentName)
    );

    return { history, personalNotes };
};

// --- Attendance ---
export async function getAttendanceLog(): Promise<AttendanceLog[]> {
    return await getFromBlob<AttendanceLog[]>(DB_KEY_ATTENDANCE);
}

export async function saveAttendanceLog(log: Omit<AttendanceLog, 'id'>): Promise<AttendanceLog> {
    const logs = await getAttendanceLog();
    const newLog: AttendanceLog = { ...log, id: crypto.randomUUID() };
    logs.unshift(newLog);
    await saveToBlob(DB_KEY_ATTENDANCE, logs);
    return newLog;
}


// --- Savings ---
export async function getSavingsTransactions(): Promise<SavingTransaction[]> {
    return await getFromBlob<SavingTransaction[]>(DB_KEY_SAVINGS);
}

export async function addSavingTransaction(transaction: Omit<SavingTransaction, 'id'>): Promise<SavingTransaction> {
    const transactions = await getSavingsTransactions();
    const newTransaction: SavingTransaction = { ...transaction, id: crypto.randomUUID() };
    transactions.unshift(newTransaction);
    await saveToBlob(DB_KEY_SAVINGS, transactions);
    return newTransaction;
}

// Helper function to initialize all DB files if they don't exist
async function initializeDatabase() {
    await Promise.all([
        getFacilitators(),
        getClasses(),
        getStudents(),
        getSubjects(),
        getFacilitatorAssignments(),
        getAcademicJournalLog(),
        getStimulationJournalLog(),
        getAttendanceLog(),
        getSavingsTransactions()
    ]);
}


// --- User Session ---
export async function getLoggedInUser(): Promise<(Facilitator & { isAdmin: false }) | { id: 'admin', fullName: string, nickname: string, isAdmin: true } | null> {
    // This is a server-side function, so we can't use localStorage here directly.
    // The logic has been moved to the client-side components (dashboard/page.tsx).
    // This function can still be used to fetch facilitator data by ID if needed,
    // but the session checking part is now on the client.

    // Proactively initialize all database files on first load
    await initializeDatabase();
    
    // The rest of the function is kept for potential server-side usage if needed,
    // but the primary login logic is now client-side.
    return null; // Return null as client-side will handle the session.
}


// --- Student Profile Data Aggregation ---
export async function getStudentProfileData(studentId: string) {
    const student = (await getStudents()).find(s => s.id === studentId);
    if (!student) return null;

    const classes = await getClasses();
    const studentClass = classes.find(c => c.id === student.classId);
    
    // Aggregate Attendance
    const attendanceLogs = await getAttendanceLog();
    const attendance = { present: 0, late: 0, sick: 0, excused: 0 };
    attendanceLogs.forEach(log => {
        const status = log.records[studentId];
        if (status === 'Hadir') attendance.present++;
        else if (status === 'Terlambat') attendance.late++;
        else if (status === 'Sakit') attendance.sick++;
        else if (status === 'Izin') attendance.excused++;
    });

    // Aggregate Savings
    const savingsLogs = await getSavingsTransactions();
    const studentSavings = savingsLogs.filter(t => t.studentId === studentId);
    let balance = 0;
    const deposits: SavingTransaction[] = [];
    const withdrawals: SavingTransaction[] = [];
    
    // Sort transactions by date ascending to calculate balance correctly
    studentSavings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    studentSavings.forEach(t => {
        if (t.type === 'setoran') {
            balance += t.amount;
            deposits.push(t);
        } else {
            balance -= t.amount;
            withdrawals.push(t);
        }
    });

    return {
        ...student,
        className: studentClass?.name || "Tidak ada kelas",
        attendance,
        savings: {
            balance,
            deposits: deposits.reverse(), // Show most recent first
            withdrawals: withdrawals.reverse() // Show most recent first
        }
    };
}
