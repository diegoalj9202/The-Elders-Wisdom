'use client';

import { useState } from 'react';
import { Student } from '@/types';
import { updateStudent } from '@/lib/firebase/operations';
import { ArrowLeft, Save, CheckCircle, AlertTriangle } from 'lucide-react';

interface StudentDetailViewProps {
  student: Student;
  onBack: () => void;
  onUpdate: () => void;
}

type Section = 'introduction' | 'elderStory' | 'lessonsLearned' | 'culturalContext';

export default function StudentDetailView({ student, onBack, onUpdate }: StudentDetailViewProps) {
  const [activeSection, setActiveSection] = useState<Section>('introduction');
  const [feedback, setFeedback] = useState({
    introduction: student.teacherFeedback?.introduction?.comment || '',
    elderStory: student.teacherFeedback?.elderStory?.comment || '',
    lessonsLearned: student.teacherFeedback?.lessonsLearned?.comment || '',
    culturalContext: student.teacherFeedback?.culturalContext?.comment || '',
  });
  const [status, setStatus] = useState({
    introduction: student.teacherFeedback?.introduction?.status || 'needs_revision',
    elderStory: student.teacherFeedback?.elderStory?.status || 'needs_revision',
    lessonsLearned: student.teacherFeedback?.lessonsLearned?.status || 'needs_revision',
    culturalContext: student.teacherFeedback?.culturalContext?.status || 'needs_revision',
  });
  const [saving, setSaving] = useState(false);

  const handleSaveFeedback = async (section: Section) => {
    setSaving(true);
    try {
      await updateStudent(student.id, {
        teacherFeedback: {
          ...student.teacherFeedback,
          [section]: {
            comment: feedback[section],
            status: status[section],
            date: new Date(),
          },
        },
      });
      onUpdate();
      alert('Feedback saved successfully!');
    } catch (error) {
      console.error('Error saving feedback:', error);
      alert('Failed to save feedback. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'introduction' as Section, label: 'Introduction' },
    { id: 'elderStory' as Section, label: "Elder's Story" },
    { id: 'lessonsLearned' as Section, label: 'Lessons Learned' },
    { id: 'culturalContext' as Section, label: 'Cultural Context' },
  ];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="card">
        <button
          onClick={onBack}
          className="text-gold hover:text-gold-bright mb-4 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-display text-gold mb-2">
              {student.coverPage.title || student.ebookTitle}
            </h2>
            <p className="text-parchment text-lg">by {student.name}</p>
            <p className="text-parchment-aged">Class: {student.classCode}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gold">{student.completionPercentage}%</div>
            <div className="text-sm text-parchment-aged">Complete</div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="leather-bg rounded-lg p-2 flex gap-2 overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeSection === section.id
                ? 'bg-leather-light text-gold shadow-gold-glow'
                : 'text-parchment hover:bg-leather-light/50'
            }`}
          >
            {section.label}
            {student.teacherFeedback?.[section.id] && (
              <span className="ml-2">
                {student.teacherFeedback[section.id]?.status === 'approved' ? (
                  <CheckCircle className="w-4 h-4 inline text-emerald" />
                ) : (
                  <AlertTriangle className="w-4 h-4 inline text-amber" />
                )}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Preview */}
      <div className="card">
        <h3 className="text-2xl font-display text-gold mb-4">
          {sections.find((s) => s.id === activeSection)?.label} Content
        </h3>

        {/* Introduction */}
        {activeSection === 'introduction' && (
          <div className="space-y-4">
            <div
              className="parchment-bg p-6 rounded-lg prose prose-sepia max-w-none"
              dangerouslySetInnerHTML={{ __html: student.introduction.content || '<p class="text-gray-500 italic">No content yet</p>' }}
            />
            {student.introduction.images.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {student.introduction.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            <div className="text-sm text-parchment-aged">
              Word count: {student.introduction.wordCount} (Target: 150-200)
            </div>
          </div>
        )}

        {/* Elder's Story */}
        {activeSection === 'elderStory' && (
          <div className="space-y-4">
            <div
              className="parchment-bg p-6 rounded-lg prose prose-sepia max-w-none"
              dangerouslySetInnerHTML={{ __html: student.elderStory.content || '<p class="text-gray-500 italic">No content yet</p>' }}
            />
            {student.elderStory.images.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {student.elderStory.images.map((img, i) => (
                  <div key={i}>
                    <img src={img} alt="" className="w-full h-48 object-cover rounded-lg mb-2" />
                    {student.elderStory.mediaCaptions[`image${i}`] && (
                      <p className="text-sm text-sepia italic">
                        {student.elderStory.mediaCaptions[`image${i}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            {student.elderStory.audioFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-display text-burgundy">Audio Files:</h4>
                {student.elderStory.audioFiles.map((audio, i) => (
                  <audio key={i} src={audio} controls className="w-full" />
                ))}
              </div>
            )}
            {student.elderStory.videoFile && (
              <div>
                <h4 className="font-display text-burgundy mb-2">Video:</h4>
                <video src={student.elderStory.videoFile} controls className="w-full rounded-lg" />
              </div>
            )}
            <div className="text-sm text-parchment-aged">
              Word count: {student.elderStory.wordCount} (Target: 500-800)
            </div>
          </div>
        )}

        {/* Lessons Learned */}
        {activeSection === 'lessonsLearned' && (
          <div className="space-y-4">
            <div
              className="parchment-bg p-6 rounded-lg prose prose-sepia max-w-none"
              dangerouslySetInnerHTML={{ __html: student.lessonsLearned.content || '<p class="text-gray-500 italic">No content yet</p>' }}
            />
            {student.lessonsLearned.quotes.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-display text-burgundy">Important Quotes:</h4>
                {student.lessonsLearned.quotes.map((quote, i) => (
                  <div key={i} className="p-4 border-l-4 border-gold parchment-bg rounded italic">
                    "{quote}"
                  </div>
                ))}
              </div>
            )}
            {student.lessonsLearned.images.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                {student.lessonsLearned.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cultural Context */}
        {activeSection === 'culturalContext' && (
          <div className="space-y-4">
            <div
              className="parchment-bg p-6 rounded-lg prose prose-sepia max-w-none"
              dangerouslySetInnerHTML={{ __html: student.culturalContext.content || '<p class="text-gray-500 italic">No content yet</p>' }}
            />
            {student.culturalContext.culturalImages.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4">
                {student.culturalContext.culturalImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
            {student.culturalContext.audioPronunciation && (
              <div>
                <h4 className="font-display text-burgundy mb-2">Pronunciation Guide:</h4>
                <audio src={student.culturalContext.audioPronunciation} controls className="w-full" />
              </div>
            )}
            {student.culturalContext.referenceLinks.length > 0 && (
              <div>
                <h4 className="font-display text-burgundy mb-2">Reference Links:</h4>
                <ul className="list-disc pl-6">
                  {student.culturalContext.referenceLinks.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold-bright underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback Form */}
      <div className="card">
        <h3 className="text-2xl font-display text-gold mb-4">Provide Feedback</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-parchment font-semibold mb-2">Status</label>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  setStatus({ ...status, [activeSection]: 'approved' as const })
                }
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  status[activeSection] === 'approved'
                    ? 'bg-emerald text-white shadow-lg'
                    : 'bg-emerald/20 text-emerald hover:bg-emerald/30'
                }`}
              >
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Approved
              </button>
              <button
                onClick={() =>
                  setStatus({ ...status, [activeSection]: 'needs_revision' as const })
                }
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  status[activeSection] === 'needs_revision'
                    ? 'bg-amber text-white shadow-lg'
                    : 'bg-amber/20 text-amber hover:bg-amber/30'
                }`}
              >
                <AlertTriangle className="w-5 h-5 inline mr-2" />
                Needs Revision
              </button>
            </div>
          </div>

          <div>
            <label className="block text-parchment font-semibold mb-2">Comments</label>
            <textarea
              value={feedback[activeSection]}
              onChange={(e) =>
                setFeedback({ ...feedback, [activeSection]: e.target.value })
              }
              className="input-field allow-select min-h-[150px]"
              placeholder="Provide specific feedback for the student..."
            />
          </div>

          <button
            onClick={() => handleSaveFeedback(activeSection)}
            disabled={saving}
            className="btn-gold w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}
