# 🚀 QUICK START GUIDE

## Getting Your Site Live in 10 Minutes!

### Step 1: Extract Files
1. Download the `the-elders-wisdom` folder
2. Extract to: `C:\Users\ASUS\Desktop\Website projects\the-elders-wisdom`

### Step 2: Install Dependencies
Open Command Prompt and run:
```bash
cd C:\Users\ASUS\Desktop\Website projects\the-elders-wisdom
npm install
```
⏱️ This takes 2-3 minutes

### Step 3: Test Locally (Optional)
```bash
npm run dev
```
Open: http://localhost:3000

### Step 4: Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts → Your site is LIVE! 🎉

### Step 5: Access Your Site
URL will be like: `https://the-elders-wisdom-xxxxx.vercel.app`

## Login Credentials

**Teacher:**
- Email: diegoal.9202@gmail.com
- Password: Pedroparques9202

**Students:**
- Name: Any name
- Class Code: INT-3_DAMD (or create your own)

## What's Included

✅ Beautiful mystical UI with leather textures
✅ 6-tab student workspace
✅ Rich text editor with formatting
✅ Image, audio, video upload
✅ Auto-save every 2 seconds
✅ Teacher feedback system
✅ Class anthology viewer
✅ PDF export functionality
✅ Progress tracking
✅ Analytics dashboard

## File Structure

```
the-elders-wisdom/
├── app/                  # All pages
├── components/           # Reusable components
├── lib/                  # Firebase & utilities
├── types/                # TypeScript types
├── public/               # Static files
├── README.md            # Full documentation
├── DEPLOYMENT.md        # Detailed deployment guide
└── package.json         # Dependencies
```

## Features by Role

### Students Can:
- Design custom cover pages
- Write rich text content
- Upload images, audio, video
- See teacher feedback
- Preview e-book with page-flip
- Download as PDF

### Teachers Can:
- View all student e-books
- Give section-by-section feedback
- Mark sections as approved/needs revision
- View class anthology
- Track progress with analytics
- Download anthology as PDF

## Tech Stack

- Next.js 14 (React framework)
- TypeScript (Type safety)
- Tailwind CSS (Styling)
- Firebase (Database, Auth, Storage)
- Tiptap (Rich text editor)
- jsPDF (PDF generation)

## Support Files

- **README.md** - Complete documentation
- **DEPLOYMENT.md** - Step-by-step deployment guide
- **This file** - Quick reference

## Troubleshooting

**Build errors?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Can't login?**
- Check Firebase console status
- Verify credentials
- Try incognito mode

**Files won't upload?**
- Check Firebase billing (needs Blaze plan)
- Verify file size limits
- Check internet connection

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test teacher login
3. ✅ Create a test student
4. ✅ Upload sample content
5. ✅ Share URL with students!

## Need Help?

📧 Email: diegoal.9202@gmail.com
📚 Read: README.md for full docs
📖 Read: DEPLOYMENT.md for deployment help

---

**Ready to start? Run: `npm install` then `vercel`**

Your mystical e-book platform awaits! ✦
