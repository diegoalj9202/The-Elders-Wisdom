'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { getAllStudents } from '@/lib/firebase/operations';
import { Student } from '@/types';
import { BookOpen, LogOut, Users, BookMarked, BarChart3 } from 'lucide-react';
import StudentsOverview from '@/components/teacher/StudentsOverview';
import StudentDetailView from '@/components/teacher/StudentDetailView';
import AnthologyView from '@/components/teacher/AnthologyView';
import AnalyticsView from '@/components/teacher/AnalyticsView';

type TeacherTab = 'overview' | 'detail' | 'anthology' | 'analytics';

export default function TeacherDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TeacherTab>('overview');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const user = auth.currentUser;

    if (!user || userType !== 'teacher') {
      router.push('/');
      return;
    }

    loadStudents();
  }, [router]);

  const loadStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem('userType');
    router.push('/');
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('detail');
  };

  const handleBackToOverview = () => {
    setSelectedStudent(null);
    setActiveTab('overview');
    loadStudents(); // Refresh data
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gold font-display text-xl">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TeacherTab, label: 'Student Overview', icon: Users },
    { id: 'anthology' as TeacherTab, label: 'Class Anthology', icon: BookMarked },
    { id: 'analytics' as TeacherTab, label: 'Analytics', icon: BarChart3 },
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
                <h1 className="text-2xl font-decorative text-gold">Teacher Dashboard</h1>
                <p className="text-parchment-aged text-sm">The Elders' Wisdom</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-parchment text-sm font-semibold">
                  {students.length} Students
                </p>
                <p className="text-parchment-aged text-xs">
                  {students.filter((s) => s.completionPercentage === 100).length} Completed
                </p>
              </div>

              <button onClick={handleLogout} className="btn-gold flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation - Only show if not in detail view */}
      {activeTab !== 'detail' && (
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
      )}

      {/* Tab Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <StudentsOverview students={students} onViewStudent={handleViewStudent} />
          )}
          {activeTab === 'detail' && selectedStudent && (
            <StudentDetailView
              student={selectedStudent}
              onBack={handleBackToOverview}
              onUpdate={loadStudents}
            />
          )}
          {activeTab === 'anthology' && <AnthologyView students={students} />}
          {activeTab === 'analytics' && <AnalyticsView students={students} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gold/30 text-sm">
        <div className="mb-2">◆ ❖ ◆</div>
        <p className="font-display">Guide the Wisdom</p>
      </footer>
    </div>
  );
}
