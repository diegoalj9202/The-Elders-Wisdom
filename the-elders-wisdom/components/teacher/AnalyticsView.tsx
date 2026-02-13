'use client';

import { Student } from '@/types';
import { Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import ProgressIndicator from '@/components/shared/ProgressIndicator';

interface AnalyticsViewProps {
  students: Student[];
}

export default function AnalyticsView({ students }: AnalyticsViewProps) {
  const totalStudents = students.length;
  const completedStudents = students.filter((s) => s.completionPercentage === 100).length;
  const inProgressStudents = students.filter(
    (s) => s.completionPercentage > 0 && s.completionPercentage < 100
  ).length;
  const notStartedStudents = students.filter((s) => s.completionPercentage === 0).length;

  const averageCompletion =
    totalStudents > 0
      ? Math.round(
          students.reduce((sum, s) => sum + s.completionPercentage, 0) / totalStudents
        )
      : 0;

  // Most active students (recent updates)
  const mostActive = [...students]
    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
    .slice(0, 5);

  // Calculate class codes
  const classCodes = Array.from(new Set(students.map((s) => s.classCode)));

  return (
    <div className="space-y-8 fade-in">
      <h2 className="text-3xl font-display text-gold">Analytics</h2>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-gold/10 rounded-lg">
              <Users className="w-6 h-6 text-gold" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gold mb-1">{totalStudents}</div>
          <div className="text-parchment-aged text-sm">Total Students</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-emerald/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald mb-1">{completedStudents}</div>
          <div className="text-parchment-aged text-sm">Completed E-Books</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-amber/10 rounded-lg">
              <Clock className="w-6 h-6 text-amber" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber mb-1">{inProgressStudents}</div>
          <div className="text-parchment-aged text-sm">In Progress</div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-burgundy/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-burgundy" />
            </div>
          </div>
          <div className="text-3xl font-bold text-burgundy mb-1">{averageCompletion}%</div>
          <div className="text-parchment-aged text-sm">Average Completion</div>
        </div>
      </div>

      {/* Progress Breakdown */}
      <div className="card">
        <h3 className="text-2xl font-display text-gold mb-6">Progress Breakdown</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-parchment">Completed (100%)</span>
              <span className="text-emerald font-semibold">{completedStudents} students</span>
            </div>
            <ProgressIndicator
              percentage={totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-parchment">In Progress (1-99%)</span>
              <span className="text-amber font-semibold">{inProgressStudents} students</span>
            </div>
            <ProgressIndicator
              percentage={totalStudents > 0 ? (inProgressStudents / totalStudents) * 100 : 0}
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-parchment">Not Started (0%)</span>
              <span className="text-burgundy font-semibold">{notStartedStudents} students</span>
            </div>
            <ProgressIndicator
              percentage={totalStudents > 0 ? (notStartedStudents / totalStudents) * 100 : 0}
            />
          </div>
        </div>
      </div>

      {/* Most Active Students */}
      <div className="card">
        <h3 className="text-2xl font-display text-gold mb-6">Most Recently Active</h3>
        <div className="space-y-3">
          {mostActive.map((student, index) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 parchment-bg rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-gold text-mahogany rounded-full font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-semibold text-sepia">{student.name}</div>
                  <div className="text-sm text-sepia-light">
                    {student.coverPage.title || student.ebookTitle}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gold font-bold">{student.completionPercentage}%</div>
                <div className="text-xs text-parchment-aged">
                  {new Date(student.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Distribution */}
      {classCodes.length > 1 && (
        <div className="card">
          <h3 className="text-2xl font-display text-gold mb-6">Class Distribution</h3>
          <div className="space-y-4">
            {classCodes.map((code) => {
              const classStudents = students.filter((s) => s.classCode === code);
              return (
                <div key={code}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-parchment font-semibold">{code}</span>
                    <span className="text-gold">{classStudents.length} students</span>
                  </div>
                  <ProgressIndicator
                    percentage={
                      totalStudents > 0 ? (classStudents.length / totalStudents) * 100 : 0
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
