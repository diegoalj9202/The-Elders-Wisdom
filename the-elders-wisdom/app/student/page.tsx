'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getStudent, updateStudent, calculateCompletion } from '@/lib/firebase/operations';
import { Student, TabType } from '@/types';
import { BookOpen, Save, LogOut, Scroll } from 'lucide-react';
import ProgressIndicator from '@/components/shared/ProgressIndicator';
import CoverPageTab from '@/components/student/CoverPageTab';
import IntroductionTab from '@/components/student/IntroductionTab';
import ElderStoryTab from '@/components/student/ElderStoryTab';
import LessonsTab from '@/components/student/LessonsTab';
import CulturalTab from '@/components/student/CulturalTab';
import PreviewTab from '@/components/student/PreviewTab';

export default function StudentWorkspace() {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('cover');
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    const userType = localStorage.getItem('userType');

    if (!studentId || userType !== 'student') {
      router.push('/');
      return;
    }

    loadStudent(studentId);
  }, [router]);

  const loadStudent = async (studentId: string) => {
    try {
      const data = await getStudent(studentId);
      if (data) {
        setStudent(data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading student:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveStudent = useCallback(async (updatedStudent: Student) => {
    if (!updatedStudent.id) return;

    setSaving(true);
    try {
      const completion = calculateCompletion(updatedStudent);
      await updateStudent(updatedStudent.id, {
        ...updatedStudent,
        completionPercentage: completion,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  }, []);

  const handleStudentUpdate = useCallback((updates: Partial<Student>) => {
    setStudent((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      
      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      // Set new auto-save timeout
      const timeout = setTimeout(() => {
        saveStudent(updated);
      }, 2000); // Auto-save after 2 seconds of inactivity
      
      setAutoSaveTimeout(timeout);
      return updated;
    });
  }, [autoSaveTimeout, saveStudent]);

  const handleManualSave = () => {
    if (student) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      saveStudent(student);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    localStorage.removeItem('userType');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gold font-display text-xl">Loading your manuscript...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'cover', label: 'Cover Page', icon: BookOpen },
    { id: 'introduction', label: 'Introduction', icon: Scroll },
    { id: 'story', label: "Elder's Story", icon: Scroll },
    { id: 'lessons', label: 'Lessons Learned', icon: Scroll },
    { id: 'cultural', label: 'Cultural Context', icon: Scroll },
    { id: 'preview', label: 'E-Book Preview', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="leather-bg border-b-4 border-gold/20 shadow-ornate sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-gold" />
              <div>
                <h1 className="text-2xl font-decorative text-gold">The Elders' Wisdom</h1>
                <p className="text-parchment-aged text-sm">
                  {student.name} • {student.ebookTitle || 'Untitled E-Book'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block w-48">
                <ProgressIndicator percentage={student.completionPercentage} />
              </div>

              <button
                onClick={handleManualSave}
                disabled={saving}
                className="btn-leather flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>

              <button
                onClick={handleLogout}
                className="btn-gold flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Save Status */}
          {lastSaved && !saving && (
            <div className="text-center text-emerald text-sm mt-2">
              ✓ Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="leather-bg border-b-2 border-leather-dark">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'cover' && (
            <CoverPageTab student={student} onUpdate={handleStudentUpdate} />
          )}
          {activeTab === 'introduction' && (
            <IntroductionTab student={student} onUpdate={handleStudentUpdate} />
          )}
          {activeTab === 'story' && (
            <ElderStoryTab student={student} onUpdate={handleStudentUpdate} />
          )}
          {activeTab === 'lessons' && (
            <LessonsTab student={student} onUpdate={handleStudentUpdate} />
          )}
          {activeTab === 'cultural' && (
            <CulturalTab student={student} onUpdate={handleStudentUpdate} />
          )}
          {activeTab === 'preview' && (
            <PreviewTab student={student} />
          )}
        </div>
      </main>

      {/* Footer Ornament */}
      <footer className="text-center py-8 text-gold/30 text-sm">
        <div className="mb-2">◆ ❖ ◆</div>
        <p className="font-display">Chronicle Your Wisdom</p>
      </footer>
    </div>
  );
}
