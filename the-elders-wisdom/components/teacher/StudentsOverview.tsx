'use client';

import { Student } from '@/types';
import { Eye, MessageSquare, Clock } from 'lucide-react';
import ProgressIndicator from '@/components/shared/ProgressIndicator';

interface StudentsOverviewProps {
  students: Student[];
  onViewStudent: (student: Student) => void;
}

export default function StudentsOverview({ students, onViewStudent }: StudentsOverviewProps) {
  const sortedStudents = [...students].sort((a, b) => 
    b.lastUpdated.getTime() - a.lastUpdated.getTime()
  );

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display text-gold">Student E-Books</h2>
        <p className="text-parchment-aged">{students.length} total students</p>
      </div>

      {students.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-parchment-aged text-lg">No students yet</p>
          <p className="text-parchment-aged text-sm mt-2">
            Students will appear here once they start creating their e-books
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedStudents.map((student) => (
            <div key={student.id} className="card hover:shadow-gold-glow transition-all">
              {/* Thumbnail */}
              {student.coverPage.imageUrl ? (
                <div className="relative h-48 -m-6 mb-4 rounded-t-xl overflow-hidden">
                  <img
                    src={student.coverPage.imageUrl}
                    alt={student.coverPage.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 leather-bg opacity-40" />
                </div>
              ) : (
                <div className="relative h-48 -m-6 mb-4 rounded-t-xl leather-bg flex items-center justify-center">
                  <p className="text-gold-dark text-4xl opacity-30">No Cover</p>
                </div>
              )}

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-display text-gold mb-1">
                    {student.coverPage.title || student.ebookTitle || 'Untitled'}
                  </h3>
                  <p className="text-parchment-aged text-sm">by {student.name}</p>
                  <p className="text-parchment-aged text-xs">Class: {student.classCode}</p>
                </div>

                <ProgressIndicator
                  percentage={student.completionPercentage}
                  label="Progress"
                />

                <div className="flex items-center gap-2 text-xs text-parchment-aged">
                  <Clock className="w-4 h-4" />
                  <span>Updated {new Date(student.lastUpdated).toLocaleDateString()}</span>
                </div>

                {/* Feedback indicators */}
                <div className="flex gap-2 text-xs">
                  {student.teacherFeedback?.introduction && (
                    <span
                      className={`px-2 py-1 rounded ${
                        student.teacherFeedback.introduction.status === 'approved'
                          ? 'bg-emerald/20 text-emerald'
                          : 'bg-amber/20 text-amber'
                      }`}
                    >
                      Intro
                    </span>
                  )}
                  {student.teacherFeedback?.elderStory && (
                    <span
                      className={`px-2 py-1 rounded ${
                        student.teacherFeedback.elderStory.status === 'approved'
                          ? 'bg-emerald/20 text-emerald'
                          : 'bg-amber/20 text-amber'
                      }`}
                    >
                      Story
                    </span>
                  )}
                  {student.teacherFeedback?.lessonsLearned && (
                    <span
                      className={`px-2 py-1 rounded ${
                        student.teacherFeedback.lessonsLearned.status === 'approved'
                          ? 'bg-emerald/20 text-emerald'
                          : 'bg-amber/20 text-amber'
                      }`}
                    >
                      Lessons
                    </span>
                  )}
                  {student.teacherFeedback?.culturalContext && (
                    <span
                      className={`px-2 py-1 rounded ${
                        student.teacherFeedback.culturalContext.status === 'approved'
                          ? 'bg-emerald/20 text-emerald'
                          : 'bg-amber/20 text-amber'
                      }`}
                    >
                      Cultural
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onViewStudent(student)}
                    className="flex-1 btn-gold flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View & Feedback
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
