'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { createStudent } from '@/lib/firebase/operations';
import { BookOpen, Sparkles, User, Lock, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<'select' | 'student' | 'teacher'>('select');
  
  // Student state
  const [studentName, setStudentName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState('');
  
  // Teacher state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherError, setTeacherError] = useState('');

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentLoading(true);
    setStudentError('');

    try {
      // Check if student already exists
      const q = query(
        collection(db, 'students'),
        where('name', '==', studentName),
        where('classCode', '==', classCode)
      );
      const querySnapshot = await getDocs(q);

      let studentId: string;

      if (!querySnapshot.empty) {
        // Student exists
        studentId = querySnapshot.docs[0].id;
      } else {
        // Create new student
        const newStudent = await createStudent({
          name: studentName,
          classCode: classCode
        });
        studentId = newStudent.id;
      }

      // Save to localStorage
      localStorage.setItem('userType', 'student');
      localStorage.setItem('studentId', studentId);
      localStorage.setItem('studentName', studentName);

      router.push('/student');
    } catch (error: any) {
      setStudentError('Failed to login. Please try again.');
      console.error(error);
    } finally {
      setStudentLoading(false);
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherLoading(true);
    setTeacherError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      localStorage.setItem('userType', 'teacher');
      router.push('/teacher');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        setTeacherError('Invalid email or password');
      } else {
        setTeacherError('Failed to login. Please try again.');
      }
      console.error(error);
    } finally {
      setTeacherLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <div className="flex justify-center mb-6">
            <BookOpen className="w-20 h-20 text-gold animate-glow" strokeWidth={1.5} />
          </div>
          <h1 className="text-6xl font-decorative text-gold mb-4 text-shadow-gold">
            The Elders' Wisdom
          </h1>
          <div className="flex items-center justify-center gap-3 text-parchment-aged text-xl">
            <span>✦</span>
            <p className="font-display italic">Chronicle the Knowledge of Ages</p>
            <span>✦</span>
          </div>
        </div>

        {/* Selection Mode */}
        {mode === 'select' && (
          <div className="grid md:grid-cols-2 gap-8 slide-up">
            {/* Student Card */}
            <button
              onClick={() => setMode('student')}
              className="card hover:shadow-gold-glow transition-all duration-300 group cursor-pointer"
            >
              <div className="flex flex-col items-center text-center p-8">
                <Users className="w-16 h-16 text-gold mb-6 group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl font-display text-gold mb-4">Student</h2>
                <p className="text-parchment-aged text-lg leading-relaxed">
                  Create your mystical e-book and share the wisdom of elders
                </p>
                <div className="mt-6 flex items-center gap-2 text-gold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Begin Your Journey</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </button>

            {/* Teacher Card */}
            <button
              onClick={() => setMode('teacher')}
              className="card hover:shadow-gold-glow transition-all duration-300 group cursor-pointer"
            >
              <div className="flex flex-col items-center text-center p-8">
                <User className="w-16 h-16 text-gold mb-6 group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl font-display text-gold mb-4">Teacher</h2>
                <p className="text-parchment-aged text-lg leading-relaxed">
                  Guide your students and compile the class anthology
                </p>
                <div className="mt-6 flex items-center gap-2 text-gold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Access Dashboard</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Student Login */}
        {mode === 'student' && (
          <div className="max-w-md mx-auto slide-up">
            <div className="card">
              <button
                onClick={() => setMode('select')}
                className="text-gold hover:text-gold-bright mb-6 flex items-center gap-2 transition-colors"
              >
                ← Back to Selection
              </button>
              
              <h2 className="text-3xl font-display text-gold mb-8 text-center">
                Student Login
              </h2>

              <form onSubmit={handleStudentLogin} className="space-y-6">
                <div>
                  <label className="block text-parchment mb-2 font-semibold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="input-field allow-select"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-parchment mb-2 font-semibold">
                    Class Code
                  </label>
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value)}
                    className="input-field allow-select"
                    placeholder="e.g., INT-3_DAMD"
                    required
                  />
                </div>

                {studentError && (
                  <div className="text-amber text-center p-3 parchment-bg rounded-lg border border-amber">
                    {studentError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={studentLoading}
                  className="w-full btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {studentLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner border-mahogany border-t-leather" />
                      Entering...
                    </span>
                  ) : (
                    'Enter the Archive'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Teacher Login */}
        {mode === 'teacher' && (
          <div className="max-w-md mx-auto slide-up">
            <div className="card">
              <button
                onClick={() => setMode('select')}
                className="text-gold hover:text-gold-bright mb-6 flex items-center gap-2 transition-colors"
              >
                ← Back to Selection
              </button>
              
              <h2 className="text-3xl font-display text-gold mb-8 text-center">
                Teacher Login
              </h2>

              <form onSubmit={handleTeacherLogin} className="space-y-6">
                <div>
                  <label className="block text-parchment mb-2 font-semibold">
                    Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sepia w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-12 allow-select"
                      placeholder="teacher@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-parchment mb-2 font-semibold">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sepia w-5 h-5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-12 allow-select"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                {teacherError && (
                  <div className="text-amber text-center p-3 parchment-bg rounded-lg border border-amber">
                    {teacherError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={teacherLoading}
                  className="w-full btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {teacherLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner border-mahogany border-t-leather" />
                      Authenticating...
                    </span>
                  ) : (
                    'Access the Sanctum'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer Ornament */}
        <div className="text-center mt-16 text-gold/30 text-sm fade-in">
          <div className="mb-2">◆ ❖ ◆</div>
          <p className="font-display">Est. MMXXVI</p>
        </div>
      </div>
    </div>
  );
}
