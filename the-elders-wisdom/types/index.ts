export interface Student {
  id: string;
  name: string;
  classCode: string;
  ebookTitle: string;
  selectedFont: string;
  lastUpdated: Date;
  completionPercentage: number;
  coverPage: CoverPage;
  introduction: Introduction;
  elderStory: ElderStory;
  lessonsLearned: LessonsLearned;
  culturalContext: CulturalContext;
  teacherFeedback: TeacherFeedback;
}

export interface CoverPage {
  imageUrl: string;
  title: string;
  subtitle: string;
  authorName: string;
  fontStyle: string;
}

export interface Introduction {
  content: string;
  images: string[];
  wordCount: number;
}

export interface ElderStory {
  content: string;
  images: string[];
  audioFiles: string[];
  videoFile: string;
  mediaCaptions: {
    [key: string]: string;
  };
  wordCount: number;
}

export interface LessonsLearned {
  content: string;
  images: string[];
  quotes: string[];
  wordCount: number;
}

export interface CulturalContext {
  content: string;
  culturalImages: string[];
  audioPronunciation: string;
  referenceLinks: string[];
  wordCount: number;
}

export interface TeacherFeedback {
  introduction?: FeedbackItem;
  elderStory?: FeedbackItem;
  lessonsLearned?: FeedbackItem;
  culturalContext?: FeedbackItem;
}

export interface FeedbackItem {
  comment: string;
  status: 'approved' | 'needs_revision';
  date: Date;
}

export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
  example: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'ancient-scroll',
    name: 'Ancient Scroll',
    fontFamily: 'EB Garamond',
    example: 'The Elders' Wisdom'
  },
  {
    id: 'gothic-wisdom',
    name: 'Gothic Wisdom',
    fontFamily: 'UnifrakturMaguntia',
    example: 'The Elders' Wisdom'
  },
  {
    id: 'royal-decree',
    name: 'Royal Decree',
    fontFamily: 'Cinzel',
    example: 'The Elders' Wisdom'
  },
  {
    id: 'elder-script',
    name: 'Elder Script',
    fontFamily: 'Crimson Text',
    example: 'The Elders' Wisdom'
  },
  {
    id: 'sacred-text',
    name: 'Sacred Text',
    fontFamily: 'Cormorant Garamond',
    example: 'The Elders' Wisdom'
  },
  {
    id: 'decorative-wisdom',
    name: 'Decorative Wisdom',
    fontFamily: 'Cinzel Decorative',
    example: 'The Elders' Wisdom'
  }
];

export type TabType = 'cover' | 'introduction' | 'story' | 'lessons' | 'cultural' | 'preview';

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}
