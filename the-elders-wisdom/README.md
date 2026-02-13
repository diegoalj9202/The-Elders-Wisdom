# The Elders' Wisdom - Mystical E-Book Platform

A beautiful, immersive educational web application for adult EFL students to create multimedia e-books about wisdom, elder knowledge, and life lessons. Built with Next.js 14, TypeScript, Tailwind CSS, and Firebase.

## 🎨 Features

### For Students
- **6 Interactive Tabs** for creating comprehensive e-books:
  1. **Cover Page** - Custom image upload, title, subtitle, and font selection
  2. **Introduction** - Rich text editor with image support (150-200 words)
  3. **Elder's Story** - Main narrative with images, audio, and video uploads (500-800 words)
  4. **Lessons Learned** - Reflections with quote boxes and images
  5. **Cultural Context** - Cultural background with artifacts and pronunciation guides
  6. **E-Book Preview** - 3D flipbook viewer with PDF export

- **Auto-save** every 2 seconds
- **Progress tracking** (0-100%)
- **Teacher feedback** display
- **Beautiful mystical UI** with leather textures and gold accents

### For Teachers
- **Student Overview** - Grid view of all student e-books with completion status
- **Individual Review** - Detailed view of each student's work with feedback tools
- **Class Anthology** - Combined flipbook of all student e-books
- **Analytics Dashboard** - Progress statistics and insights
- **Feedback System** - Approve/request revisions with comments

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom mystical theme)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Storage:** Firebase Storage
- **Rich Text:** Tiptap
- **PDF Export:** jsPDF + html2canvas
- **Icons:** Lucide React

## 📦 Installation

### Prerequisites
- Node.js 20+ installed
- npm or yarn
- Firebase project setup (already configured)

### Setup Steps

1. **Clone or download the project:**
```bash
cd the-elders-wisdom
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

## 🔥 Firebase Configuration

The Firebase configuration is already set up in the code:

```javascript
{
  apiKey: "AIzaSyCNH7X1c5kPlji_3rOju7bOhVST-3N-Bds",
  authDomain: "the-elders--wisdom.firebaseapp.com",
  projectId: "the-elders--wisdom",
  storageBucket: "the-elders--wisdom.firebasestorage.app",
  messagingSenderId: "566986328473",
  appId: "1:566986328473:web:f407c708ebe9d976a36b08"
}
```

### Firebase Services Enabled:
- ✅ Authentication (Email/Password)
- ✅ Firestore Database
- ✅ Storage (Blaze plan for file uploads)

### Teacher Account:
- **Email:** diegoal.9202@gmail.com
- **Password:** Pedroparques9202

### Student Login:
- **Name:** Any name
- **Class Code:** Example: INT-3_DAMD

## 🚀 Deployment to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
cd the-elders-wisdom
vercel
```

4. **Follow prompts:**
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name? **the-elders-wisdom**
   - Directory? **./`**
   - Override settings? **N**

5. **Production deployment:**
```bash
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository OR upload the project folder
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### Deployment Notes:
- No environment variables needed (Firebase config is in code)
- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 20.x

## 📁 Project Structure

```
the-elders-wisdom/
├── app/
│   ├── globals.css          # Global styles with mystical theme
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Login/landing page
│   ├── student/
│   │   └── page.tsx          # Student workspace
│   └── teacher/
│       └── page.tsx          # Teacher dashboard
├── components/
│   ├── shared/
│   │   ├── RichTextEditor.tsx
│   │   ├── FileUpload.tsx
│   │   └── ProgressIndicator.tsx
│   ├── student/
│   │   ├── CoverPageTab.tsx
│   │   ├── IntroductionTab.tsx
│   │   ├── ElderStoryTab.tsx
│   │   ├── LessonsTab.tsx
│   │   ├── CulturalTab.tsx
│   │   └── PreviewTab.tsx
│   └── teacher/
│       ├── StudentsOverview.tsx
│       ├── StudentDetailView.tsx
│       ├── AnthologyView.tsx
│       └── AnalyticsView.tsx
├── lib/
│   ├── firebase/
│   │   ├── config.ts         # Firebase initialization
│   │   └── operations.ts     # Database operations
│   └── utils/                # Utility functions
├── types/
│   └── index.ts              # TypeScript types
├── public/                   # Static assets
├── tailwind.config.js        # Custom theme config
├── next.config.js
├── tsconfig.json
└── package.json
```

## 🎨 Design System

### Colors
- **Mahogany** (#3E2723) - Main background
- **Leather** (#5D4037) - Cards, borders
- **Gold** (#D4AF37) - Accents, highlights
- **Parchment** (#F5E6D3) - Text backgrounds
- **Sepia** (#704214) - Body text
- **Burgundy** (#800020) - Headings

### Typography
- **Display:** EB Garamond, Cinzel
- **Body:** Crimson Text, Lora
- **Decorative:** Cinzel Decorative

### Effects
- Leather textures with CSS gradients
- Parchment backgrounds
- Gold glow animations
- Embossed text effects
- Page-turn animations

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📖 Usage Guide

### For Students:

1. **Login** with your name and class code
2. **Cover Page:** Upload an image and design your cover
3. **Introduction:** Write 150-200 words explaining why this wisdom matters
4. **Elder's Story:** Tell the main narrative (500-800 words) with multimedia
5. **Lessons Learned:** Reflect on the wisdom with quotes
6. **Cultural Context:** Provide background and references
7. **Preview:** View your e-book and download as PDF

### For Teachers:

1. **Login** with your email and password
2. **Student Overview:** See all student e-books and their progress
3. **Give Feedback:** Click "View & Feedback" to review and comment
4. **Class Anthology:** View the combined anthology of all students
5. **Analytics:** Track class progress and completion rates

## 🔒 Security Features

- Right-click disabled to prevent content theft
- Firebase Authentication for teachers
- Firestore security rules (currently open for development)
- File size limits: Images (5MB), Audio (10MB), Video (50MB)

## 🐛 Troubleshooting

### Build Errors:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Firebase Connection Issues:
- Check Firebase console for service status
- Verify API key is correct
- Ensure billing is enabled for Storage

### Styling Issues:
```bash
npm run build
# Tailwind will regenerate all styles
```

## 📝 Future Enhancements

- [ ] Multiple class code support
- [ ] Student-to-student comments
- [ ] Audio narration for text
- [ ] Print-ready PDF export
- [ ] Mobile app version
- [ ] Multilingual support

## 🤝 Support

For issues or questions, contact:
- **Email:** diegoal.9202@gmail.com

## 📄 License

This project is created for educational purposes.

---

**Built with ✦ by Claude for The Elders' Wisdom Project**
