import { db } from "../firebase/config";
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";

// 1. Create a job with 5 MCQs
export const createJob = (jobData) => addDoc(collection(db, "jobs"), jobData);

// 2. Save candidate application
export const startApplication = (appData) => addDoc(collection(db, "applications"), {
    ...appData,
    status: "applied",
    createdAt: new Date()
});

// 3. Update status (Knocked or Shortlisted)
export const updateAppStatus = (id, status, resumeURL = null) => {
    const ref = doc(db, "applications", id);
    return updateDoc(ref, { status, resumeURL });
};