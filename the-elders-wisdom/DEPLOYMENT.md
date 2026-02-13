# Deployment Guide - The Elders' Wisdom

## Quick Deployment to Vercel

### Method 1: Using Vercel CLI (Fastest)

1. **Open Terminal/Command Prompt in the project folder:**
   ```
   C:\Users\ASUS\Desktop\Website projects\the-elders-wisdom
   ```

2. **Install Vercel CLI globally (if not installed):**
   ```bash
   npm install -g vercel
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```
   - Enter your email
   - Check your email for verification
   - Click the link to verify

4. **Deploy the project:**
   ```bash
   vercel
   ```
   
5. **Answer the prompts:**
   - Set up and deploy? → **Yes**
   - Which scope? → **Select your account**
   - Link to existing project? → **No**
   - What's your project's name? → **the-elders-wisdom** (or any name)
   - In which directory is your code located? → **./** (press Enter)
   - Want to override the settings? → **No**

6. **Wait for deployment** (usually 2-3 minutes)

7. **Get your URL:**
   - Vercel will provide a URL like: `https://the-elders-wisdom-xxxxx.vercel.app`
   - Copy this URL to access your live site!

8. **For production deployment:**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard (Easier for beginners)

1. **Prepare your project:**
   - Zip the entire `the-elders-wisdom` folder
   - OR push it to GitHub/GitLab

2. **Go to Vercel:**
   - Visit [https://vercel.com](https://vercel.com)
   - Sign up or log in (use GitHub, GitLab, or email)

3. **Create new project:**
   - Click "Add New" → "Project"
   - Choose "Import Git Repository" OR "Deploy from ZIP"

4. **If importing from Git:**
   - Connect your GitHub/GitLab account
   - Select your repository
   - Click "Import"

5. **If deploying from ZIP:**
   - Upload your zipped project folder
   - Wait for upload to complete

6. **Configure project:**
   - Project Name: `the-elders-wisdom`
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` 
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `.next` (auto-filled)
   - Install Command: `npm install` (auto-filled)

7. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live!

### Method 3: Git + Vercel (Best for updates)

1. **Initialize Git (if not already):**
   ```bash
   cd the-elders-wisdom
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub repository:**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it: `the-elders-wisdom`
   - Don't initialize with README (we have one)
   - Click "Create repository"

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/the-elders-wisdom.git
   git branch -M main
   git push -u origin main
   ```

4. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Click "Deploy"

5. **Automatic deployments:**
   - Every time you push to GitHub, Vercel auto-deploys!

## Verifying Deployment

After deployment, test these features:

### 1. Teacher Login:
- URL: `your-url.vercel.app`
- Click "Teacher"
- Email: `diegoal.9202@gmail.com`
- Password: `Pedroparques9202`
- Should redirect to dashboard

### 2. Student Login:
- Click "Student"
- Name: `Test Student`
- Class Code: `INT-3_DAMD`
- Should create account and redirect to workspace

### 3. File Uploads:
- Try uploading a cover image
- Should upload to Firebase Storage
- Image should display immediately

### 4. Auto-save:
- Type in any text field
- Wait 2 seconds
- Should see "Last saved" message

## Troubleshooting

### Build Fails:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### "Module not found" errors:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Firebase connection issues:
- Check Firebase console: [https://console.firebase.google.com](https://console.firebase.google.com)
- Verify billing is enabled (Blaze plan)
- Check API key in `lib/firebase/config.ts`

### Styles not loading:
```bash
# Rebuild Tailwind
npm run build
```

### Vercel deployment stuck:
1. Cancel the deployment
2. Clear Vercel cache:
   - Go to Project Settings
   - Click "Functions"
   - Clear deployment cache
3. Redeploy

## Custom Domain (Optional)

1. **Buy a domain** (from Namecheap, GoDaddy, etc.)

2. **Add to Vercel:**
   - Go to your project on Vercel
   - Click "Settings" → "Domains"
   - Add your domain
   - Follow DNS instructions

3. **Update DNS:**
   - Add CNAME record pointing to Vercel
   - Wait 24-48 hours for propagation

## Performance Tips

### Optimize images before uploading:
- Resize to max 1920px width
- Compress using TinyPNG or similar
- Use JPG for photos, PNG for graphics

### Monitor usage:
- Check Firebase console for storage usage
- Monitor Firestore reads/writes
- Set up budget alerts

### Speed improvements:
- Enable Vercel Edge Network (automatic)
- Use Next.js Image optimization
- Minimize file uploads size

## Maintenance

### Regular updates:
```bash
git add .
git commit -m "Update description"
git push
# Vercel auto-deploys!
```

### Backup data:
- Export Firestore data regularly
- Download student e-books as PDFs
- Back up Firebase Storage files

### Monitor logs:
- Vercel Dashboard → Your Project → Logs
- Firebase Console → Firestore → Usage

## Support

If you encounter issues:

1. **Check logs:**
   - Vercel: Dashboard → Project → Logs
   - Firebase: Console → Firestore/Storage

2. **Common solutions:**
   - Clear browser cache
   - Try incognito mode
   - Check Firebase service status

3. **Contact:**
   - Email: diegoal.9202@gmail.com

## Success! 🎉

Your site should now be live at:
`https://the-elders-wisdom.vercel.app` (or your custom URL)

**Test everything:**
- ✅ Teacher login works
- ✅ Student creation works
- ✅ File uploads work
- ✅ Auto-save works
- ✅ PDF export works
- ✅ Beautiful mystical design loads

**Share the URL with your students and start creating wisdom e-books!**

---

**Need help?** Email: diegoal.9202@gmail.com
