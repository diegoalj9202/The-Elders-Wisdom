'use client';

import { Student } from '@/types';
import { getWordCount } from '@/lib/firebase/operations';
import RichTextEditor from '@/components/shared/RichTextEditor';
import FileUpload from '@/components/shared/FileUpload';
import { Lightbulb, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface LessonsTabProps {
  student: Student;
  onUpdate: (updates: Partial<Student>) => void;
}

export default function LessonsTab({ student, onUpdate }: LessonsTabProps) {
  const [wordCount, setWordCount] = useState(0);
  const [newQuote, setNewQuote] = useState('');

  useEffect(() => {
    const count = getWordCount(student.lessonsLearned.content);
    setWordCount(count);
  }, [student.lessonsLearned.content]);

  const handleContentChange = (content: string) => {
    const count = getWordCount(content);
    onUpdate({
      lessonsLearned: {
        ...student.lessonsLearned,
        content,
        wordCount: count,
      },
    });
  };

  const handleImageUpload = (url: string, index: number) => {
    const newImages = [...student.lessonsLearned.images];
    if (url) {
      newImages[index] = url;
    } else {
      newImages.splice(index, 1);
    }
    onUpdate({
      lessonsLearned: {
        ...student.lessonsLearned,
        images: newImages,
      },
    });
  };

  const addImageSlot = () => {
    if (student.lessonsLearned.images.length < 3) {
      onUpdate({
        lessonsLearned: {
          ...student.lessonsLearned,
          images: [...student.lessonsLearned.images, ''],
        },
      });
    }
  };

  const addQuote = () => {
    if (newQuote.trim()) {
      onUpdate({
        lessonsLearned: {
          ...student.lessonsLearned,
          quotes: [...student.lessonsLearned.quotes, newQuote.trim()],
        },
      });
      setNewQuote('');
    }
  };

  const removeQuote = (index: number) => {
    const newQuotes = [...student.lessonsLearned.quotes];
    newQuotes.splice(index, 1);
    onUpdate({
      lessonsLearned: {
        ...student.lessonsLearned,
        quotes: newQuotes,
      },
    });
  };

  const feedback = student.teacherFeedback?.lessonsLearned;

  return (
    <div className="space-y-8 fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-gold" />
            <h2 className="text-3xl font-display text-gold">Lessons Learned</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gold">{wordCount} words</span>
          </div>
        </div>

        <div className="mb-4 p-4 parchment-bg rounded-lg border-l-4 border-gold">
          <p className="text-sepia italic">
            Reflect on the wisdom shared. What are the key takeaways? How can this knowledge be
            applied today?
          </p>
        </div>

        <div className="mb-8">
          <RichTextEditor
            content={student.lessonsLearned.content}
            onChange={handleContentChange}
            placeholder="What lessons can we learn from this wisdom? How does it apply to our lives today?"
          />
        </div>

        {/* Quotes Section */}
        <div className="mb-8 space-y-4">
          <h3 className="text-xl font-display text-gold">Important Quotes</h3>
          <p className="text-parchment-aged text-sm">
            Highlight memorable quotes or key phrases from the elder's wisdom
          </p>

          {/* Existing Quotes */}
          <div className="space-y-3">
            {student.lessonsLearned.quotes.map((quote, index) => (
              <div
                key={index}
                className="relative p-4 parchment-bg rounded-lg border-l-4 border-gold shadow-lg"
              >
                <button
                  onClick={() => removeQuote(index)}
                  className="absolute top-2 right-2 p-1 hover:bg-burgundy/20 rounded"
                  type="button"
                >
                  <X className="w-4 h-4 text-burgundy" />
                </button>
                <p className="text-sepia italic pr-8 allow-select">"{quote}"</p>
              </div>
            ))}
          </div>

          {/* Add New Quote */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addQuote()}
              className="input-field flex-1 allow-select"
              placeholder="Enter a meaningful quote..."
            />
            <button
              onClick={addQuote}
              className="btn-gold flex items-center gap-2"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Add Quote
            </button>
          </div>
        </div>

        {/* Images Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display text-gold">Supporting Images (1-3)</h3>
            {student.lessonsLearned.images.length < 3 && (
              <button onClick={addImageSlot} className="btn-gold text-sm" type="button">
                + Add Image
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {student.lessonsLearned.images.map((image, index) => (
              <FileUpload
                key={index}
                accept=".jpg,.jpeg,.png"
                maxSize={5}
                onUpload={(url) => handleImageUpload(url, index)}
                currentFile={image}
                label={`Image ${index + 1}`}
                type="image"
                storagePath={`elders-wisdom/${student.classCode}/${student.name}/lessons`}
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
