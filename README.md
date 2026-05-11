# 🚌 SakAI - Iloilo Commuting Guide

An AI-powered jeepney commuting guide web application for Iloilo City. SakAI helps users find jeepney routes, detect transfers, estimate fares, and generate human-readable commute instructions using Gemini AI.

## Project Structure

```
.
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── SearchBar.jsx        # Route search input
│   │   ├── RouteResult.jsx      # Route display
│   │   ├── MapView.jsx          # Google Maps integration
│   │   ├── SavedRoutes.jsx      # Saved routes list
│   │   ├── Navbar.jsx           # Navigation bar
│   │   └── LoadingSpinner.jsx   # Loading indicator
│   ├── services/           # Business logic & APIs
│   │   ├── router.js            # Route matching algorithm
│   │   ├── fareService.js       # Fare calculation
│   │   ├── geminiService.js     # Gemini AI integration
│   │   ├── mapsService.js       # Google Maps API
│   │   └── firebaseService.js   # Firebase auth & storage
│   ├── data/               # Static data
│   │   └── iloiloRoutes.js      # Iloilo jeepney routes
│   ├── pages/              # Page components
│   │   ├── Home.jsx             # Main search page
│   │   ├── Profile.jsx          # User profile & saved routes
│   │   └── Login.jsx            # Login page
│   ├── utils/              # Utility functions
│   │   ├── haversine.js         # Distance calculation
│   │   ├── constants.js         # App constants
│   │   └── helpers.js           # Helper functions
│   ├── App.jsx             # Main app component
│   ├── App.css             # App styling
│   ├── style.css           # Global styles
│   ├── firebase.js         # Firebase config
│   └── main.jsx            # React entry point
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
├── .env                    # Environment variables (local)
└── .env.example            # Environment template
```

## Quick Start

### 1. Install Dependencies

Dependencies are already installed. If needed:

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your keys:

```env
# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_key_here

# Gemini API
VITE_GEMINI_API_KEY=your_key_here

# Firebase
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 3. Get API Keys

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable: Maps JavaScript API, Places API, Geocoding API
4. Create an API key
5. Restrict to JavaScript origin

#### Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Get your API key (free tier available)

#### Firebase
1. Go to [Firebase Console](https://firebase.google.com/console/)
2. Create a new project
3. Enable: Authentication (Google Sign-In), Firestore Database
4. Get your config credentials

### 4. Run Development Server

```bash
npm run dev
```

Server starts at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

Output: `dist/` directory

## Features

### ✅ Implemented

- **Route Search**: Find jeepney routes between two locations
- **Route Calculation**: Direct and transfer route detection
- **Fare Estimation**: Calculate fares with discount support
- **Google Maps**: Display routes with markers and polylines
- **Gemini AI**: Generate human-readable commute instructions
- **Authentication**: Google Sign-In via Firebase
- **Saved Routes**: Users can save favorite routes to Firestore
- **Responsive Design**: Mobile-first UI

### 🔄 Architecture

```
User Input
    ↓
Google Geocoding (Address → Coordinates)
    ↓
Router Algorithm (Find nearby stops, match routes)
    ↓
Route Plan (Direct or Transfer)
    ↓
Fare Calculation (Based on distance & passenger type)
    ↓
Gemini AI (Convert plan to instructions)
    ↓
Display Results + Save Option
```

## Core Services

### router.js
- `findRoute(origin, destination)` - Main routing function
- Finds nearby stops within 400m walking radius
- Detects direct routes or transfer points
- Returns route with stops and distance

### fareService.js
- `calculateFare(distanceKm, passengerType)` - Calculate fares
- `calculateTransferFare(legs, passengerType)` - Multi-leg fares
- Supports: Regular, Student (20% discount), Senior Citizen, PWD

### geminiService.js
- `generateCommuteInstructions(routeData, passengerType)` - AI instructions
- Returns step-by-step commute guide
- Generates fallback if AI fails

### mapsService.js
- `initializeMaps()` - Initialize Google Maps
- `createMap(container, options)` - Create map instance
- `addMarker()`, `drawPolyline()`, `geocodeAddress()` - Map operations

### firebaseService.js
- `signInWithGoogle()` - Google authentication
- `saveRoute(uid, routeData)` - Save to Firestore
- `getSavedRoutes(uid)` - Retrieve saved routes
- `deleteSavedRoute(uid, routeId)` - Delete route

## Fare Rules

### Base Fare
- **₱13** for first 4 km
- **₱1.80** per additional km

### Discounts
- **20%** for Student, Senior Citizen, PWD

## Example Routes

SakAI includes sample Iloilo jeepney routes:

- Route 01: Mandurriao ↔ City Proper
- Route 02: Molo ↔ Pavia
- Route 03: Jaro ↔ Sarao
- Route 04: Lapaz ↔ Santa Barbara
- Route 05: Arevalo ↔ Oton

Routes can be expanded in `src/data/iloiloRoutes.js`

## Constants

Located in `src/utils/constants.js`:

- `WALK_RADIUS_METERS` = 400m
- `FARE_BASE` = ₱13
- `FARE_DISTANCE_BASE` = 4km
- `FARE_PER_KM` = ₱1.80
- `DISCOUNT_PERCENTAGE` = 0.20 (20%)

## Development Notes

### Important Design Decisions

1. **No AI Route Planning**: Routes are computed in JavaScript, not by Gemini
2. **Gemini Role**: Only explains routes and formats responses
3. **Walking Radius**: 400m default for jeepney stop detection
4. **Fare Per Leg**: Calculated based on total distance

### Error Handling

- Invalid addresses: User-friendly error message
- Failed Gemini calls: Fallback to template-based instructions
- No routes found: Suggest adjusting search locations
- Firebase errors: Graceful fallback, inform user

### Performance

- Route searches: < 3 seconds target
- Lazy load Google Maps: Only when needed
- Cache route data locally: `iloiloRoutes.js`
- Minimize API calls: Pre-compute common routes

## Future Features

- Real-time jeepney tracking
- Crowd-sourced route corrections
- Offline mode with cached routes
- Voice navigation
- Multi-language support
- Traffic-aware rerouting
- Dark mode

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

### Maps Not Loading
- Check API key in `.env`
- Verify API is enabled in Google Cloud Console
- Check browser console for errors

### Gemini Errors
- Verify API key is correct
- Check rate limits (free tier: 60 requests/minute)
- Check network connectivity

### Firebase Issues
- Verify credentials in `.env`
- Check Firestore rules allow read/write
- Verify Google Sign-In is enabled

### No Routes Found
- Check locations are in Iloilo City
- Verify jeepney routes in `iloiloRoutes.js`
- Increase `WALK_RADIUS_METERS` if needed

## Contributing

When adding new routes:

1. Add to `src/data/iloiloRoutes.js`
2. Include: code, name, depart[], return[]
3. Use accurate GPS coordinates
4. Test with nearby stop detection

## Support

For issues or questions, refer to:
- [Google Maps Documentation](https://developers.google.com/maps)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Reference](https://ai.google.dev)

