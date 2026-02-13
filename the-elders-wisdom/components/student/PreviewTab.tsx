'use client';

import { Student, FONT_OPTIONS } from '@/types';
import { useState } from 'react';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PreviewTabProps {
  student: Student;
}

export default function PreviewTab({ student }: PreviewTabProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate pages from student data
  const pages = [
    // Cover page
    <div key="cover" className="w-full h-full leather-bg flex items-center justify-center relative">
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
            className="text-5xl text-gold mb-6 emboss-text"
            style={{
              fontFamily:
                FONT_OPTIONS.find((f) => f.id === student.coverPage.fontStyle)?.fontFamily ||
                'EB Garamond',
            }}
          >
            {student.coverPage.title}
          </h1>
        )}
        {student.coverPage.subtitle && (
          <p className="text-parchment text-xl italic mb-8">{student.coverPage.subtitle}</p>
        )}
        {student.coverPage.authorName && (
          <p className="text-gold-bright font-display text-lg">
            by {student.coverPage.authorName}
          </p>
        )}
      </div>
    </div>,

    // Introduction
    <div key="intro" className="w-full h-full parchment-bg p-8 overflow-auto">
      <h2 className="text-3xl font-display text-burgundy mb-4 border-b-2 border-gold pb-2">
        Introduction
      </h2>
      <div
        className="prose prose-sepia"
        dangerouslySetInnerHTML={{ __html: student.introduction.content }}
      />
      {student.introduction.images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {student.introduction.images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-full h-48 object-cover rounded-lg" />
          ))}
        </div>
      )}
    </div>,

    // Elder's Story
    <div key="story" className="w-full h-full parchment-bg p-8 overflow-auto">
      <h2 className="text-3xl font-display text-burgundy mb-4 border-b-2 border-gold pb-2">
        The Elder's Story
      </h2>
      <div
        className="prose prose-sepia"
        dangerouslySetInnerHTML={{ __html: student.elderStory.content }}
      />
    </div>,

    // Elder's Story Media (if present)
    ...(student.elderStory.images.length > 0 || student.elderStory.audioFiles.length > 0
      ? [
          <div key="story-media" className="w-full h-full parchment-bg p-8 overflow-auto">
            <h3 className="text-2xl font-display text-burgundy mb-4">Story Media</h3>
            {student.elderStory.images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {student.elderStory.images.slice(0, 4).map((img, i) => (
                  <div key={i}>
                    <img src={img} alt="" className="w-full h-40 object-cover rounded-lg mb-2" />
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
                {student.elderStory.audioFiles.map((audio, i) => (
                  <div key={i}>
                    <audio src={audio} controls className="w-full" />
                    {student.elderStory.mediaCaptions[`audio${i}`] && (
                      <p className="text-sm text-sepia italic mt-1">
                        {student.elderStory.mediaCaptions[`audio${i}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>,
        ]
      : []),

    // Lessons Learned
    <div key="lessons" className="w-full h-full parchment-bg p-8 overflow-auto">
      <h2 className="text-3xl font-display text-burgundy mb-4 border-b-2 border-gold pb-2">
        Lessons Learned
      </h2>
      <div
        className="prose prose-sepia"
        dangerouslySetInnerHTML={{ __html: student.lessonsLearned.content }}
      />
      {student.lessonsLearned.quotes.length > 0 && (
        <div className="space-y-4 mt-6">
          <h3 className="text-xl font-display text-burgundy">Important Quotes</h3>
          {student.lessonsLearned.quotes.map((quote, i) => (
            <div key={i} className="p-4 border-l-4 border-gold bg-white/50 rounded italic">
              "{quote}"
            </div>
          ))}
        </div>
      )}
    </div>,

    // Cultural Context
    <div key="cultural" className="w-full h-full parchment-bg p-8 overflow-auto">
      <h2 className="text-3xl font-display text-burgundy mb-4 border-b-2 border-gold pb-2">
        Cultural Context
      </h2>
      <div
        className="prose prose-sepia"
        dangerouslySetInnerHTML={{ __html: student.culturalContext.content }}
      />
      {student.culturalContext.culturalImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {student.culturalContext.culturalImages.map((img, i) => (
            <img key={i} src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
          ))}
        </div>
      )}
      {student.culturalContext.referenceLinks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-display text-burgundy mb-2">References</h3>
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
    </div>,
  ];

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const pageElement = document.getElementById(`page-${i}`);
        if (pageElement) {
          const canvas = await html2canvas(pageElement, {
            scale: 2,
            useCORS: true,
            logging: false,
          });
          const imgData = canvas.toDataURL('image/jpeg', 0.95);

          if (i > 0) {
            pdf.addPage();
          }

          pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
        }
      }

      pdf.save(`${student.ebookTitle || 'ebook'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-display text-gold">E-Book Preview</h2>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="btn-gold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
          </button>
        </div>

        {/* Flipbook Viewer */}
        <div className="relative">
          {/* Book Display */}
          <div className="relative bg-mahogany-dark rounded-lg p-8 shadow-ornate">
            <div className="aspect-[3/4] max-w-2xl mx-auto relative">
              {/* Current Page */}
              <div
                id={`page-${currentPage}`}
                className="w-full h-full rounded-lg shadow-leather overflow-hidden"
              >
                {pages[currentPage]}
              </div>

              {/* Hidden pages for PDF generation */}
              <div className="hidden">
                {pages.map((page, i) => (
                  <div key={i} id={`page-${i}`} className="w-[794px] h-[1123px]">
                    {page}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="btn-leather disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentPage
                        ? 'bg-gold scale-125'
                        : 'bg-leather-light hover:bg-gold/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === pages.length - 1}
                className="btn-leather disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Page Counter */}
            <div className="text-center text-parchment-aged text-sm mt-4">
              Page {currentPage + 1} of {pages.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
