'use client';

import { Student, FONT_OPTIONS } from '@/types';
import FileUpload from '@/components/shared/FileUpload';
import { Palette } from 'lucide-react';

interface CoverPageTabProps {
  student: Student;
  onUpdate: (updates: Partial<Student>) => void;
}

export default function CoverPageTab({ student, onUpdate }: CoverPageTabProps) {
  const handleCoverUpdate = (field: string, value: string) => {
    onUpdate({
      coverPage: {
        ...student.coverPage,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-gold" />
          <h2 className="text-3xl font-display text-gold">Design Your Cover</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-parchment font-semibold mb-2">
                E-Book Title *
              </label>
              <input
                type="text"
                value={student.coverPage.title}
                onChange={(e) => handleCoverUpdate('title', e.target.value)}
                className="input-field allow-select"
                placeholder="The Wisdom of Our Ancestors"
                required
              />
            </div>

            <div>
              <label className="block text-parchment font-semibold mb-2">
                Subtitle (Optional)
              </label>
              <input
                type="text"
                value={student.coverPage.subtitle}
                onChange={(e) => handleCoverUpdate('subtitle', e.target.value)}
                className="input-field allow-select"
                placeholder="Stories Passed Through Generations"
              />
            </div>

            <div>
              <label className="block text-parchment font-semibold mb-2">
                Author Name
              </label>
              <input
                type="text"
                value={student.coverPage.authorName}
                onChange={(e) => handleCoverUpdate('authorName', e.target.value)}
                className="input-field allow-select"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block text-parchment font-semibold mb-3">
                Title Font Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => handleCoverUpdate('fontStyle', font.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      student.coverPage.fontStyle === font.id
                        ? 'border-gold bg-gold/10 shadow-gold-glow'
                        : 'border-leather hover:border-gold'
                    } parchment-bg`}
                    type="button"
                  >
                    <div
                      className="text-sepia text-lg mb-1"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.name}
                    </div>
                    <div
                      className="text-sepia-light text-sm"
                      style={{ fontFamily: font.fontFamily }}
                    >
                      {font.example}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Cover Preview & Upload */}
          <div className="space-y-6">
            <FileUpload
              accept=".jpg,.jpeg,.png"
              maxSize={5}
              onUpload={(url) => handleCoverUpdate('imageUrl', url)}
              currentFile={student.coverPage.imageUrl}
              label="Cover Image"
              type="image"
              storagePath={`elders-wisdom/${student.classCode}/${student.name}/cover`}
            />

            {/* Cover Preview */}
            {(student.coverPage.title || student.coverPage.imageUrl) && (
              <div className="card p-0 overflow-hidden">
                <div className="relative h-96 leather-bg flex items-center justify-center">
                  {student.coverPage.imageUrl && (
                    <img
                      src={student.coverPage.imageUrl}
                      alt="Cover"
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                  )}
                  <div className="relative z-10 text-center p-8">
                    {student.coverPage.title && (
                      <h1
                        className="text-4xl text-gold mb-4 emboss-text"
                        style={{
                          fontFamily:
                            FONT_OPTIONS.find(
                              (f) => f.id === student.coverPage.fontStyle
                            )?.fontFamily || 'EB Garamond',
                        }}
                      >
                        {student.coverPage.title}
                      </h1>
                    )}
                    {student.coverPage.subtitle && (
                      <p className="text-parchment text-lg italic mb-6">
                        {student.coverPage.subtitle}
                      </p>
                    )}
                    {student.coverPage.authorName && (
                      <p className="text-gold-bright font-display">
                        by {student.coverPage.authorName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
