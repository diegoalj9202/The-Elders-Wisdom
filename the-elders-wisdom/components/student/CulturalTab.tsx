'use client';

import { Student } from '@/types';
import { getWordCount } from '@/lib/firebase/operations';
import RichTextEditor from '@/components/shared/RichTextEditor';
import FileUpload from '@/components/shared/FileUpload';
import { Globe, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CulturalTabProps {
  student: Student;
  onUpdate: (updates: Partial<Student>) => void;
}

export default function CulturalTab({ student, onUpdate }: CulturalTabProps) {
  const [wordCount, setWordCount] = useState(0);
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    const count = getWordCount(student.culturalContext.content);
    setWordCount(count);
  }, [student.culturalContext.content]);

  const handleContentChange = (content: string) => {
    const count = getWordCount(content);
    onUpdate({
      culturalContext: {
        ...student.culturalContext,
        content,
        wordCount: count,
      },
    });
  };

  const handleImageUpload = (url: string, index: number) => {
    const newImages = [...student.culturalContext.culturalImages];
    if (url) {
      newImages[index] = url;
    } else {
      newImages.splice(index, 1);
    }
    onUpdate({
      culturalContext: {
        ...student.culturalContext,
        culturalImages: newImages,
      },
    });
  };

  const handleAudioUpload = (url: string) => {
    onUpdate({
      culturalContext: {
        ...student.culturalContext,
        audioPronunciation: url,
      },
    });
  };

  const addImageSlot = () => {
    if (student.culturalContext.culturalImages.length < 3) {
      onUpdate({
        culturalContext: {
          ...student.culturalContext,
          culturalImages: [...student.culturalContext.culturalImages, ''],
        },
      });
    }
  };

  const addLink = () => {
    if (newLink.trim()) {
      onUpdate({
        culturalContext: {
          ...student.culturalContext,
          referenceLinks: [...student.culturalContext.referenceLinks, newLink.trim()],
        },
      });
      setNewLink('');
    }
  };

  const removeLink = (index: number) => {
    const newLinks = [...student.culturalContext.referenceLinks];
    newLinks.splice(index, 1);
    onUpdate({
      culturalContext: {
        ...student.culturalContext,
        referenceLinks: newLinks,
      },
    });
  };

  const feedback = student.teacherFeedback?.culturalContext;

  return (
    <div className="space-y-8 fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-gold" />
            <h2 className="text-3xl font-display text-gold">Cultural Context</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gold">{wordCount} words</span>
          </div>
        </div>

        <div className="mb-4 p-4 parchment-bg rounded-lg border-l-4 border-gold">
          <p className="text-sepia italic">
            Provide cultural background, historical context, traditions, and customs related to
            this wisdom. Help readers understand the cultural significance.
          </p>
        </div>

        <div className="mb-8">
          <RichTextEditor
            content={student.culturalContext.content}
            onChange={handleContentChange}
            placeholder="Describe the cultural background... What traditions or customs are connected to this wisdom?"
          />
        </div>

        {/* Cultural Images Section */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display text-gold">Cultural Artifacts/Images (up to 3)</h3>
            {student.culturalContext.culturalImages.length < 3 && (
              <button onClick={addImageSlot} className="btn-gold text-sm" type="button">
                + Add Image
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {student.culturalContext.culturalImages.map((image, index) => (
              <FileUpload
                key={index}
                accept=".jpg,.jpeg,.png"
                maxSize={5}
                onUpload={(url) => handleImageUpload(url, index)}
                currentFile={image}
                label={`Cultural Image ${index + 1}`}
                type="image"
                storagePath={`elders-wisdom/${student.classCode}/${student.name}/cultural`}
              />
            ))}
          </div>
        </div>

        {/* Audio Pronunciation Section */}
        <div className="space-y-6 mb-8">
          <h3 className="text-xl font-display text-gold">
            Audio Pronunciation Guide (Optional)
          </h3>
          <p className="text-parchment-aged text-sm">
            Upload audio to help with pronunciation of cultural terms or names
          </p>
          <FileUpload
            accept=".mp3,.m4a,.wav"
            maxSize={10}
            onUpload={handleAudioUpload}
            currentFile={student.culturalContext.audioPronunciation}
            label="Pronunciation Audio"
            type="audio"
            storagePath={`elders-wisdom/${student.classCode}/${student.name}/cultural`}
          />
        </div>

        {/* Reference Links Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-display text-gold">Reference Links</h3>
          <p className="text-parchment-aged text-sm">
            Add external resources for further reading about this culture or tradition
          </p>

          {/* Existing Links */}
          <div className="space-y-2">
            {student.culturalContext.referenceLinks.map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 parchment-bg rounded-lg"
              >
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-bright underline flex-1 truncate allow-select"
                >
                  {link}
                </a>
                <button
                  onClick={() => removeLink(index)}
                  className="ml-2 p-1 hover:bg-burgundy/20 rounded"
                  type="button"
                >
                  <X className="w-4 h-4 text-burgundy" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Link */}
          <div className="flex gap-2">
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addLink()}
              className="input-field flex-1 allow-select"
              placeholder="https://example.com/resource"
            />
            <button
              onClick={addLink}
              className="btn-gold flex items-center gap-2"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
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
