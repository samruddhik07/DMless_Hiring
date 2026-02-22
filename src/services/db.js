import { db } from "../firebase/config";
import { collection, addDoc, doc, updateDoc, getDocs, getDoc } from "firebase/firestore";

// Requirement: Create a job with 5 MCQs
export const createJobWithMCQs = async (jobTitle, company, questions) => {
  return await addDoc(collection(db, "jobs"), {
    title: jobTitle,
    company: company,
    questions: questions, // Array of 5 question objects
    createdAt: new Date()
  });
};

// Requirement: Save candidate application & Update status
export const saveCandidateApplication = async (data) => {
  return await addDoc(collection(db, "applications"), {
    ...data,
    appliedAt: new Date()
  });
};

// Requirement: Update status as "knocked" or "shortlisted"
export const updateStatus = async (appId, status) => {
  const ref = doc(db, "applications", appId);
  return await updateDoc(ref, { status: status });
};