
// This file will contain all the functions to interact with the Vercel Blob storage.
// We will replace all the mock data with functions that fetch data from the blob storage.

import { put, del, list, head } from '@vercel/blob';
import { 
    DB_KEY_ACADEMIC_LOG,
    DB_KEY_ASSIGNMENTS,
    DB_KEY_CLASSES,
    DB_KEY_FACILITATORS,
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
        id: number;
        studentName: string;
        note: string;
        facilitatorName: string;
        timestamp: string;
    }[];
}

// Helper function to fetch data from blob
async function getFromBlob<T>(key: string): Promise<T[]> {
    try {
        const data = await list({ prefix: key });
        if (data.blobs.length === 0) {
            // If the blob doesn't exist, create it with an empty array
            await saveToBlob(key, []);
            return [];
        };
        const response = await fetch(data.blobs[0].url);
        if (!response.ok) return [];
        return await response.json() as T[];
    } catch (error) {
        console.error(`Error fetching data for key ${key}:`, error);
        return [];
    }
}

// Helper function to save data to blob
async function saveToBlob(key: string, data: any) {
    await put(key, JSON.stringify(data, null, 2), {
        access: 'public',
        contentType: 'application/json',
    });
}

// --- Facilitators ---
export async function getFacilitators(): Promise<Facilitator[]> {
 return await getFromBlob<Facilitator>(DB_KEY_FACILITATORS);
}

export async function addFacilitator(facilitator: Omit<Facilitator, 'id'>) {
    const facilitators = await getFacilitators();
    const newFacilitator = { ...facilitator, id: crypto.randomUUID() };
    facilitators.push(newFacilitator);
    await saveToBlob(DB_KEY_FACILITATORS, facilitators);
    return newFacilitator;
}

export async function getLoggedInUser() {
    if (typeof window === 'undefined') return null;
    const facilitatorId = localStorage.getItem("loggedInFacilitatorId");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (isAdmin) {
        return {
            id: 'admin',
            fullName: 'Admin Utama',
            nickname: 'Admin',
            isAdmin: true,
        }
    }

    if (!facilitatorId) return null;
    const facilitators = await getFacilitators();
    const facilitator = facilitators.find(f => f.id === facilitatorId) || null;
    return facilitator ? { ...facilitator, isAdmin: false } : null;
}

// --- Classes ---
export async function getClasses(): Promise<Class[]> {
    return await getFromBlob<Class>(DB_KEY_CLASSES);
}
export async function addClass(name: string): Promise<Class> {
    const classes = await getClasses();
    const newClass = { id: crypto.randomUUID(), name };
    classes.push(newClass);
    await saveToBlob(DB_KEY_CLASSES, classes);
    return newClass;
}
export async function updateClass(id: string, name: string) {
    let classes = await getClasses();
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
    return await getFromBlob<Student>(DB_KEY_STUDENTS);
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
    const newStudent = { ...student, id: crypto.randomUUID() };
    students.push(newStudent);
    await saveToBlob(DB_KEY_STUDENTS, students);
}
export async function updateStudent(id: string, data: Partial<Student>) {
    let students = await getStudents();
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
    return await getFromBlob<Subject>(DB_KEY_SUBJECTS);
}
export async function addSubject(name: string): Promise<Subject> {
    const subjects = await getSubjects();
    const newSubject = { id: crypto.randomUUID(), name };
    subjects.push(newSubject);
    await saveToBlob(DB_KEY_SUBJECTS, subjects);
    return newSubject;
}
export async function updateSubject(id: string, name: string) {
    let subjects = await getSubjects();
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
    try {
        const data = await list({ prefix: DB_KEY_ASSIGNMENTS });
        if (data.blobs.length === 0) {
            await saveToBlob(DB_KEY_ASSIGNMENTS, {});
            return {};
        }
        const response = await fetch(data.blobs[0].url);
        if (!response.ok) return {};
        const assignmentsData = await response.json();
        
        // Handle cases where the blob might contain an array or an object
        if (Array.isArray(assignmentsData)) {
            return assignmentsData[0] || {};
        }
        return assignmentsData || {};

    } catch (error) {
        console.error(`Error fetching data for key ${DB_KEY_ASSIGNMENTS}:`, error);
        return {};
    }
}
export async function saveFacilitatorAssignments(assignments: FacilitatorAssignments) {
    await saveToBlob(DB_KEY_ASSIGNMENTS, assignments);
}

// --- Academic Journal ---
export async function getAcademicJournalLog(): Promise<AcademicJournalLog[]> {
    return await getFromBlob<AcademicJournalLog>(DB_KEY_ACADEMIC_LOG);
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
            log.personalNotes.push(noteData);
        }
        return log;
    });
    await saveToBlob(DB_KEY_ACADEMIC_LOG, logs);
}


// --- Stimulation Journal ---
export async function getStimulationJournalLog(): Promise<StimulationJournalLog[]> {
     return await getFromBlob<StimulationJournalLog>(DB_KEY_STIMULATION_LOG);
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
        journal.personalNotes.filter((note: any) => note.studentName === studentName)
    );

    return { history, personalNotes };
};

// This function needs to be adapted for savings and attendance once those features save to blob storage.
export async function getStudentProfileData(studentId: string) {
    const students = await getStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    const classes = await getClasses();
    const studentClass = classes.find(c => c.id === student.classId);

    // TODO: Fetch and aggregate attendance and savings data from blob storage
    // For now, return dummy data for these.
    return {
        ...student,
        className: studentClass?.name || "Tidak ada kelas",
        attendance: { present: 0, late: 0, sick: 0, excused: 0 },
        savings: {
            balance: 0,
            deposits: [],
            withdrawals: []
        }
    }
}

    