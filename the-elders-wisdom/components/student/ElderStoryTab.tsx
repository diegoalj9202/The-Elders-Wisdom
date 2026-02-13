'use client';

import { Student } from '@/types';
import { getWordCount } from '@/lib/firebase/operations';
import RichTextEditor from '@/components/shared/RichTextEditor';
import FileUpload from '@/components/shared/FileUpload';
import { Book, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ElderStoryTabProps {
  student: Student;
  onUpdate: (updates: Partial<Student>) => void;
}

export default function ElderStoryTab({ student, onUpdate }: ElderStoryTabProps) {
  const [wordCount, setWordCount] = useState(0);
  const targetMin = 500;
  const targetMax = 800;

  useEffect(() => {
    const count = getWordCount(student.elderStory.content);
    setWordCount(count);
  }, [student.elderStory.content]);

  const handleContentChange = (content: string) => {
    const count = getWordCount(content);
    onUpdate({
      elderStory: {
        ...student.elderStory,
        content,
        wordCount: count,
      },
    });
  };

  const handleImageUpload = (url: string, index: number) => {
    const newImages = [...student.elderStory.images];
    if (url) {
      newImages[index] = url;
    } else {
      newImages.splice(index, 1);
    }
    onUpdate({
      elderStory: {
        ...student.elderStory,
        images: newImages,
      },
    });
  };

  const handleAudioUpload = (url: string, index: number) => {
    const newAudio = [...student.elderStory.audioFiles];
    if (url) {
      newAudio[index] = url;
    } else {
      newAudio.splice(index, 1);
    }
    onUpdate({
      elderStory: {
        ...student.elderStory,
        audioFiles: newAudio,
      },
    });
  };

  const handleVideoUpload = (url: string) => {
    onUpdate({
      elderStory: {
        ...student.elderStory,
        videoFile: url,
      },
    });
  };

  const handleCaptionChange = (key: string, value: string) => {
    onUpdate({
      elderStory: {
        ...student.elderStory,
        mediaCaptions: {
          ...student.elderStory.mediaCaptions,
          [key]: value,
        },
      },
    });
  };

  const addImageSlot = () => {
    if (student.elderStory.images.length < 5) {
      onUpdate({
        elderStory: {
          ...student.elderStory,
          images: [...student.elderStory.images, ''],
        },
      });
    }
  };

  const addAudioSlot = () => {
    if (student.elderStory.audioFiles.length < 2) {
      onUpdate({
        elderStory: {
          ...student.elderStory,
          audioFiles: [...student.elderStory.audioFiles, ''],
        },
      });
    }
  };

  const feedback = student.teacherFeedback?.elderStory;

  return (
    <div className="space-y-8 fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Book className="w-6 h-6 text-gold" />
            <h2 className="text-3xl font-display text-gold">The Elder's Story</h2>
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
            Share the main narrative: the elder's story, their experiences, and the wisdom they've
            accumulated. Include rich details and context.
          </p>
        </div>

        <div className="mb-8">
          <RichTextEditor
            content={student.elderStory.content}
            onChange={handleContentChange}
            placeholder="Tell the elder's story... What wisdom do they share? What experiences shaped their knowledge?"
          />
        </div>

        {/* Images Section */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display text-gold">Images (up to 5)</h3>
            {student.elderStory.images.length < 5 && (
              <button onClick={addImageSlot} className="btn-gold text-sm" type="button">
                + Add Image
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {student.elderStory.images.map((image, index) => (
              <div key={index} className="space-y-3">
                <FileUpload
                  accept=".jpg,.jpeg,.png"
                  maxSize={5}
                  onUpload={(url) => handleImageUpload(url, index)}
                  currentFile={image}
                  label={`Image ${index + 1}`}
                  type="image"
                  storagePath={`elders-wisdom/${student.classCode}/${student.name}/elder-story`}
                />
                {image && (
                  <input
                    type="text"
                    value={student.elderStory.mediaCaptions[`image${index}`] || ''}
                    onChange={(e) =>
                      handleCaptionChange(`image${index}`, e.target.value)
                    }
                    className="input-field allow-select text-sm"
                    placeholder="Image caption (optional)"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audio Section */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display text-gold">Audio Files (up to 2)</h3>
            {student.elderStory.audioFiles.length < 2 && (
              <button onClick={addAudioSlot} className="btn-gold text-sm" type="button">
                + Add Audio
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {student.elderStory.audioFiles.map((audio, index) => (
              <div key={index} className="space-y-3">
                <FileUpload
                  accept=".mp3,.m4a,.wav"
                  maxSize={10}
                  onUpload={(url) => handleAudioUpload(url, index)}
                  currentFile={audio}
                  label={`Audio ${index + 1}`}
                  type="audio"
                  storagePath={`elders-wisdom/${student.classCode}/${student.name}/elder-story`}
                />
                {audio && (
                  <input
                    type="text"
                    value={student.elderStory.mediaCaptions[`audio${index}`] || ''}
                    onChange={(e) =>
                      handleCaptionChange(`audio${index}`, e.target.value)
                    }
                    className="input-field allow-select text-sm"
                    placeholder="Audio description (optional)"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-display text-gold">Video (max 1, up to 5 minutes)</h3>
          <div className="space-y-3">
            <FileUpload
              accept=".mp4,.mov,.webm"
              maxSize={50}
              onUpload={handleVideoUpload}
              currentFile={student.elderStory.videoFile}
              label="Video"
              type="video"
              storagePath={`elders-wisdom/${student.classCode}/${student.name}/elder-story`}
            />
            {student.elderStory.videoFile && (
              <input
                type="text"
                value={student.elderStory.mediaCaptions['video'] || ''}
                onChange={(e) => handleCaptionChange('video', e.target.value)}
                className="input-field allow-select text-sm"
                placeholder="Video description (optional)"
              />
            )}
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
