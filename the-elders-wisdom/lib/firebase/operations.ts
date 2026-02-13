import { db, storage } from './config';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable
} from 'firebase/storage';
import { Student } from '@/types';

// Student Operations
export const createStudent = async (studentData: Partial<Student>) => {
  const studentRef = doc(collection(db, 'students'));
  const newStudent: Student = {
    id: studentRef.id,
    name: studentData.name || '',
    classCode: studentData.classCode || '',
    ebookTitle: studentData.ebookTitle || 'Untitled E-Book',
    selectedFont: studentData.selectedFont || 'ancient-scroll',
    lastUpdated: new Date(),
    completionPercentage: 0,
    coverPage: {
      imageUrl: '',
      title: '',
      subtitle: '',
      authorName: studentData.name || '',
      fontStyle: 'ancient-scroll'
    },
    introduction: {
      content: '',
      images: [],
      wordCount: 0
    },
    elderStory: {
      content: '',
      images: [],
      audioFiles: [],
      videoFile: '',
      mediaCaptions: {},
      wordCount: 0
    },
    lessonsLearned: {
      content: '',
      images: [],
      quotes: [],
      wordCount: 0
    },
    culturalContext: {
      content: '',
      culturalImages: [],
      audioPronunciation: '',
      referenceLinks: [],
      wordCount: 0
    },
    teacherFeedback: {}
  };
  
  await setDoc(studentRef, {
    ...newStudent,
    lastUpdated: Timestamp.fromDate(newStudent.lastUpdated)
  });
  
  return newStudent;
};

export const getStudent = async (studentId: string): Promise<Student | null> => {
  const studentRef = doc(db, 'students', studentId);
  const studentSnap = await getDoc(studentRef);
  
  if (studentSnap.exists()) {
    const data = studentSnap.data();
    return {
      ...data,
      id: studentSnap.id,
      lastUpdated: data.lastUpdated.toDate()
    } as Student;
  }
  
  return null;
};

export const updateStudent = async (studentId: string, data: Partial<Student>) => {
  const studentRef = doc(db, 'students', studentId);
  const updateData = {
    ...data,
    lastUpdated: Timestamp.fromDate(new Date())
  };
  await updateDoc(studentRef, updateData);
};

export const getStudentsByClass = async (classCode: string): Promise<Student[]> => {
  const q = query(collection(db, 'students'), where('classCode', '==', classCode));
  const querySnapshot = await getDocs(q);
  
  const students: Student[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    students.push({
      ...data,
      id: doc.id,
      lastUpdated: data.lastUpdated.toDate()
    } as Student);
  });
  
  return students;
};

export const getAllStudents = async (): Promise<Student[]> => {
  const querySnapshot = await getDocs(collection(db, 'students'));
  
  const students: Student[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    students.push({
      ...data,
      id: doc.id,
      lastUpdated: data.lastUpdated.toDate()
    } as Student);
  });
  
  return students;
};

// File Upload Operations
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, path);
  
  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }
};

export const deleteFile = async (fileUrl: string) => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Helper function to calculate completion percentage
export const calculateCompletion = (student: Student): number => {
  let completed = 0;
  const total = 5; // 5 tabs (excluding preview)
  
  if (student.coverPage.imageUrl && student.coverPage.title) completed++;
  if (student.introduction.content && student.introduction.wordCount >= 150) completed++;
  if (student.elderStory.content && student.elderStory.wordCount >= 500) completed++;
  if (student.lessonsLearned.content && student.lessonsLearned.wordCount >= 100) completed++;
  if (student.culturalContext.content) completed++;
  
  return Math.round((completed / total) * 100);
};

// Word count helper
export const getWordCount = (html: string): number => {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.split(/\s+/).filter(word => word.length > 0).length;
};
