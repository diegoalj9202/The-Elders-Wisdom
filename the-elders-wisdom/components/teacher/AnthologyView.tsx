'use client';

import { Student, FONT_OPTIONS } from '@/types';
import { useState } from 'react';
import { Download, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnthologyViewProps {
  students: Student[];
}

export default function AnthologyView({ students }: AnthologyViewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const completedStudents = students.filter((s) => s.completionPercentage >= 50);

  // Generate anthology pages
  const pages = [
    // Anthology Cover
    <div key="anthology-cover" className="w-full h-full leather-bg flex items-center justify-center relative">
      <div className="text-center p-12">
        <div className="text-gold text-6xl mb-8">✦</div>
        <h1 className="text-6xl font-decorative text-gold mb-6 emboss-text">
          The Elders' Wisdom
        </h1>
        <p className="text-parchment text-2xl italic mb-4">Class Anthology</p>
        <p className="text-gold-bright font-display text-lg">
          A Collection of {completedStudents.length} Stories
        </p>
        <div className="text-gold text-6xl mt-8">✦</div>
      </div>
    </div>,

    // Table of Contents
    <div key="toc" className="w-full h-full parchment-bg p-8 overflow-auto">
      <h2 className="text-4xl font-display text-burgundy mb-8 text-center border-b-2 border-gold pb-4">
        Table of Contents
      </h2>
      <div className="space-y-4 max-w-2xl mx-auto">
        {completedStudents.map((student, index) => (
          <div
            key={student.id}
            className="flex items-start justify-between p-4 hover:bg-white/30 rounded-lg transition-colors"
          >
            <div className="flex-1">
              <div className="font-display text-burgundy text-xl mb-1">
                Chapter {index + 1}
              </div>
              <div className="text-sepia font-semibold">
                {student.coverPage.title || student.ebookTitle}
              </div>
              <div className="text-sepia-light text-sm">by {student.name}</div>
            </div>
            <div className="text-gold font-semibold">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>,
  ];

  // Add each student's content as chapters
  completedStudents.forEach((student, index) => {
    // Chapter Divider
    pages.push(
      <div key={`divider-${student.id}`} className="w-full h-full leather-bg flex items-center justify-center">
        <div className="text-center p-12">
          <div className="text-gold text-4xl mb-6">◆ ❖ ◆</div>
          <h2 className="text-4xl font-display text-gold mb-4">Chapter {index + 1}</h2>
          <h3 className="text-3xl font-display text-parchment mb-2">
            {student.coverPage.title || student.ebookTitle}
          </h3>
          <p className="text-gold-bright text-xl">by {student.name}</p>
          <div className="text-gold text-4xl mt-6">◆ ❖ ◆</div>
        </div>
      </div>
    );

    // Student's Cover
    pages.push(
      <div key={`cover-${student.id}`} className="w-full h-full leather-bg flex items-center justify-center relative">
        {student.coverPage.imageUrl && (
          <img
            src={student.coverPage.imageUrl}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="relative z-10 text-center p-8">
          <h1
            className="text-5xl text-gold mb-6 emboss-text"
            style={{
              fontFamily:
                FONT_OPTIONS.find((f) => f.id === student.coverPage.fontStyle)?.fontFamily ||
                'EB Garamond',
            }}
          >
            {student.coverPage.title || student.ebookTitle}
          </h1>
          {student.coverPage.subtitle && (
            <p className="text-parchment text-xl italic mb-8">{student.coverPage.subtitle}</p>
          )}
          <p className="text-gold-bright font-display text-lg">
            by {student.coverPage.authorName || student.name}
          </p>
        </div>
      </div>
    );

    // Student's content pages
    if (student.introduction.content) {
      pages.push(
        <div key={`intro-${student.id}`} className="w-full h-full parchment-bg p-8 overflow-auto">
          <h3 className="text-2xl font-display text-burgundy mb-4 border-b-2 border-gold pb-2">
            Introduction
          </h3>
          <div
            className="prose prose-sepia"
            dangerouslySetInnerHTML={{ __html: student.introduction.content }}
          />
        </div>
      );
    }

    if (student.elderStory.content) {
      pages.push(
        <div key={`story-${student.id}`} className="w-full h-full parchment-bg p-8 overflow-auto">
          <h3 className="text-2xl font-display text-burgundy mb-4 border-b-2 border-gold pb-2">
            The Elder's Story
          </h3>
          <div
            className="prose prose-sepia"
            dangerouslySetInnerHTML={{ __html: student.elderStory.content }}
          />
        </div>
      );
    }
  });

  // Credits Page
  pages.push(
    <div key="credits" className="w-full h-full parchment-bg p-8 flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h2 className="text-4xl font-display text-burgundy mb-8">Acknowledgments</h2>
        <p className="text-sepia text-lg mb-6 italic">
          This anthology represents the collective wisdom and dedication of our students in
          preserving and sharing the knowledge of elders.
        </p>
        <div className="text-gold text-2xl mb-4">◆ ❖ ◆</div>
        <p className="text-sepia font-display">
          Created with The Elders' Wisdom Platform
        </p>
        <p className="text-sepia-light text-sm mt-4">
          {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        const pageElement = document.getElementById(`anthology-page-${i}`);
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

      pdf.save('elders-wisdom-anthology.pdf');
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

  if (completedStudents.length === 0) {
    return (
      <div className="card text-center py-12 fade-in">
        <BookOpen className="w-16 h-16 text-gold-dark mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-display text-gold mb-2">No Completed E-Books Yet</h2>
        <p className="text-parchment-aged">
          The anthology will appear once students complete at least 50% of their e-books.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-display text-gold">Class Anthology</h2>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="btn-gold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Generating PDF...' : 'Download Anthology'}
          </button>
        </div>

        <p className="text-parchment-aged mb-6">
          {completedStudents.length} student{completedStudents.length !== 1 ? 's' : ''} included
        </p>

        {/* Book Display */}
        <div className="relative bg-mahogany-dark rounded-lg p-8 shadow-ornate">
          <div className="aspect-[3/4] max-w-2xl mx-auto relative">
            <div
              id={`anthology-page-${currentPage}`}
              className="w-full h-full rounded-lg shadow-leather overflow-hidden"
            >
              {pages[currentPage]}
            </div>

            {/* Hidden pages for PDF generation */}
            <div className="hidden">
              {pages.map((page, i) => (
                <div key={i} id={`anthology-page-${i}`} className="w-[794px] h-[1123px]">
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
              {pages.slice(0, 10).map((_, i) => (
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
              {pages.length > 10 && <span className="text-parchment-aged">...</span>}
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

          <div className="text-center text-parchment-aged text-sm mt-4">
            Page {currentPage + 1} of {pages.length}
          </div>
        </div>
      </div>
    </div>
  );
}
