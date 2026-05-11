# SakAI Setup Guide

Complete guide to setting up SakAI with all required API keys and services.

## Prerequisites

- Node.js 16+ installed
- npm or yarn
- Google account (for APIs and Firebase)
- Modern web browser

## Step 1: Google Maps API Setup

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter project name: `SakAI` (or your preferred name)
5. Click "CREATE"
6. Wait for project to be created

### 1.2 Enable Required APIs

1. In the search bar, search for "Maps JavaScript API"
2. Click on "Maps JavaScript API"
3. Click "ENABLE"
4. Repeat for:
   - "Places API" → Enable
   - "Geocoding API" → Enable
   - "Distance Matrix API" → Enable (optional, but recommended)

### 1.3 Create API Key

1. Go to "Credentials" in the left sidebar
2. Click "CREATE CREDENTIALS"
3. Select "API Key"
4. Copy the API key shown
5. Click "RESTRICT KEY" to set restrictions:
   - Application restrictions: "HTTP referrers (web sites)"
   - Add HTTP referrer: `localhost:*/*`
   - Add HTTP referrer: `127.0.0.1:*/*`
   - API restrictions: Select only Maps APIs enabled above
6. Click "SAVE"

**Save this API key** - you'll need it for `.env`

### 1.4 Enable Billing (Required for Production)

1. Click "Billing" in left sidebar
2. Link a payment method
3. Set budget alert if desired
4. Note: Maps API has free tier (most apps stay free)

---

## Step 2: Gemini AI Setup

### 2.1 Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API Key"
3. Select "Create API key in new Google Cloud project" or existing project
4. Copy the API key shown
5. **Note**: Free tier has rate limits (60 requests/minute)

**Save this API key** - you'll need it for `.env`

---

## Step 3: Firebase Setup

### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://firebase.google.com/console/)
2. Click "Add Project"
3. Enter project name: `SakAI`
4. Accept terms and click "Continue"
5. Disable Google Analytics (optional)
6. Click "Create Project"
7. Wait for setup to complete

### 3.2 Get Firebase Configuration

1. Click the gear icon → "Project settings"
2. Go to "General" tab
3. Scroll down to "Your apps" section
4. If no apps yet, click "Web" (</> icon)
5. Enter app name: `SakAI`
6. Check "Also set up Firebase Hosting"
7. Click "Register app"
8. Copy the configuration shown:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

**Save each value** - you'll need these for `.env`

### 3.3 Setup Authentication

1. Go to "Authentication" in left sidebar
2. Click "Get started"
3. Click on "Google" provider
4. Toggle "Enable" switch
5. Select default project account
6. Click "Save"

### 3.4 Setup Firestore Database

1. Go to "Firestore Database" in left sidebar
2. Click "Create database"
3. Select region: Asia Southeast 1 (or closest to you)
4. Start in **Test mode** (development)
   - ⚠️ **Important**: Before production, set proper security rules
5. Click "Create"
6. Note the database URL (usually auto-generated)

### 3.5 Set Firestore Security Rules (Test Mode)

For development/testing only:

1. Go to "Firestore Database" → "Rules" tab
2. Replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/savedRoutes/{routeId} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

3. Click "Publish"

⚠️ **For Production**: Use more restrictive rules!

---

## Step 4: Environment Variables Setup

### 4.1 Create .env File

1. Navigate to `SakAI/` directory
2. Copy `.env.example` to `.env`:

```bash
cd SakAI
cp .env.example .env
```

### 4.2 Fill in Environment Variables

Edit `.env` and fill in all values:

```env
# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=YOUR_MAPS_API_KEY

# Gemini API
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Firebase Configuration
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

**Example filled in:**

```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567890
VITE_GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567890
VITE_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567890
VITE_FIREBASE_AUTH_DOMAIN=sakai-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sakai-app
VITE_FIREBASE_STORAGE_BUCKET=sakai-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdefghijklmno123456789
```

⚠️ **Important**: Never commit `.env` to version control!

---

## Step 5: Install Dependencies & Run

### 5.1 Install Packages

```bash
cd SakAI
npm install
```

### 5.2 Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v8.0.10 ready in 215 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

### 5.3 Open in Browser

1. Browser should open automatically to `http://localhost:3000`
2. You should see the SakAI homepage with the search bar
3. Try searching for a route!

---

## Step 6: Test All Features

### Test Route Search

1. Enter origin: "Mandurriao Plaza"
2. Enter destination: "Robinson's Mall"
3. Select passenger type
4. Click "Find Route"
5. Should see route with fare and AI instructions

### Test Maps

- Map should display with origin/destination markers
- Should be able to interact with map

### Test Google Sign-In

1. Click "Sign In with Google" in navbar
2. Choose your Google account
3. Should redirect back and show logged in state

### Test Save Routes

1. After searching a route, click "❤ Save" button
2. Should show "Route saved successfully!"
3. Go to profile page (if logged in)
4. Saved route should appear

---

## Troubleshooting

### "Google Maps is not defined"
- Check `VITE_GOOGLE_MAPS_API_KEY` in `.env`
- Verify API is enabled in Google Cloud Console
- Check browser console for actual error

### "Gemini API Error"
- Verify `VITE_GEMINI_API_KEY` is correct
- Check if rate limit exceeded (60/min free tier)
- Check Gemini API is enabled in Google AI Studio

### "Firebase Error: auth/invalid-api-key"
- Verify `VITE_FIREBASE_API_KEY` matches Firebase project
- Check Firebase project is created and initialized
- Verify Google Sign-In is enabled in Firebase

### No routes found
- Try locations in Iloilo City (Mandurriao, Robinson's, etc.)
- Check if route exists in `src/data/iloiloRoutes.js`
- Increase walking radius if needed in `src/utils/constants.js`

### "Port 3000 already in use"
- Change port in `vite.config.js`:
  ```js
  server: {
    port: 3001,  // Change to different port
  }
  ```

---

## Production Deployment

### Before Going Live

1. **Update Firebase Rules**: Use restrictive security rules (not test mode)
2. **Add Production API Keys**: Create separate API keys for production
3. **Environment Variables**: Use production credentials
4. **Build**: `npm run build`
5. **Test**: `npm run preview`

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

---

## Security Checklist

- [ ] `.env` file not committed to git
- [ ] `.gitignore` includes `.env`
- [ ] API keys have proper restrictions
- [ ] Firebase Firestore has security rules
- [ ] Google Sign-In is only for trusted domain
- [ ] No hardcoded secrets in code
- [ ] Use HTTPS for production

---

## Support & Resources

### Documentation
- [Google Maps API Docs](https://developers.google.com/maps/documentation)
- [Firebase Docs](https://firebase.google.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)

### Getting Help
- Check browser console for errors (F12)
- Check Google Cloud Console logs
- Check Firebase Console logs
- Review error messages carefully

---

## Next Steps

After setup:

1. **Explore Routes**: Try different origin/destination combinations
2. **Add Routes**: Add more Iloilo jeepney routes to `iloiloRoutes.js`
3. **Customize UI**: Modify styles in `src/style.css`
4. **Improve Algorithm**: Enhance route matching logic in `router.js`
5. **Deploy**: Push to Firebase Hosting or Vercel

Happy commuting! 🚌✨
