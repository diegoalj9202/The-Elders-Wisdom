'use client';

import { Student } from '@/types';
import { getWordCount } from '@/lib/firebase/operations';
import RichTextEditor from '@/components/shared/RichTextEditor';
import FileUpload from '@/components/shared/FileUpload';
import { Scroll, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface IntroductionTabProps {
  student: Student;
  onUpdate: (updates: Partial<Student>) => void;
}

export default function IntroductionTab({ student, onUpdate }: IntroductionTabProps) {
  const [wordCount, setWordCount] = useState(0);
  const targetMin = 150;
  const targetMax = 200;

  useEffect(() => {
    const count = getWordCount(student.introduction.content);
    setWordCount(count);
  }, [student.introduction.content]);

  const handleContentChange = (content: string) => {
    const count = getWordCount(content);
    onUpdate({
      introduction: {
        ...student.introduction,
        content,
        wordCount: count,
      },
    });
  };

  const handleImageUpload = (url: string, index: number) => {
    const newImages = [...student.introduction.images];
    if (url) {
      newImages[index] = url;
    } else {
      newImages.splice(index, 1);
    }
    onUpdate({
      introduction: {
        ...student.introduction,
        images: newImages,
      },
    });
  };

  const addImageSlot = () => {
    onUpdate({
      introduction: {
        ...student.introduction,
        images: [...student.introduction.images, ''],
      },
    });
  };

  const feedback = student.teacherFeedback?.introduction;

  return (
    <div className="space-y-8 fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Scroll className="w-6 h-6 text-gold" />
            <h2 className="text-3xl font-display text-gold">Introduction / Preface</h2>
          </div>
          <div className="flex items-center gap-2">
            {wordCount >= targetMin && wordCount <= targetMax ? (
              <CheckCircle className="w-5 h-5 text-emerald" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber" />
            )}
            <span className={`font-semibold ${
              wordCount >= targetMin && wordCount <= targetMax
                ? 'text-emerald'
                : 'text-amber'
            }`}>
              {wordCount} / {targetMin}-{targetMax} words
            </span>
          </div>
        </div>

        <div className="mb-4 p-4 parchment-bg rounded-lg border-l-4 border-gold">
          <p className="text-sepia italic">
            <strong>Theme:</strong> "Why this wisdom matters" - Introduce your topic and explain
            why preserving this elder knowledge is important.
          </p>
        </div>

        <div className="mb-8">
          <RichTextEditor
            content={student.introduction.content}
            onChange={handleContentChange}
            placeholder="Begin your introduction here... Why is this wisdom important to preserve?"
          />
        </div>

        {/* Images Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display text-gold">Supporting Images (1-2)</h3>
            {student.introduction.images.length < 2 && (
              <button
                onClick={addImageSlot}
                className="btn-gold text-sm"
                type="button"
              >
                + Add Image
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {student.introduction.images.map((image, index) => (
              <FileUpload
                key={index}
                accept=".jpg,.jpeg,.png"
                maxSize={5}
                onUpload={(url) => handleImageUpload(url, index)}
                currentFile={image}
                label={`Image ${index + 1}`}
                type="image"
                storagePath={`elders-wisdom/${student.classCode}/${student.name}/introduction`}
              />
            ))}
          </div>
        </div>

        {/* Teacher Feedback */}
        {feedback && (
          <div className={`mt-8 p-6 rounded-lg border-2 ${
            feedback.status === 'approved'
              ? 'border-emerald bg-emerald/5'
              : 'border-amber bg-amber/5'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-display">Teacher Feedback</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                feedback.status === 'approved'
                  ? 'bg-emerald text-white'
                  : 'bg-amber text-white'
              }`}>
                {feedback.status === 'approved' ? 'Approved' : 'Needs Revision'}
              </span>
            </div>
            <p className="text-sepia allow-select">{feedback.comment}</p>
            <p className="text-xs text-sepia-light mt-2">
              {new Date(feedback.date).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
