# SakAI Developer Reference

Quick reference for developers working on SakAI.

## Project Architecture

```
Input Layer (UI)
    ↓
Business Logic Layer (Services)
    ↓
Data Layer (Firebase, APIs)
    ↓
Presentation Layer (Components)
```

## Key Files & Their Roles

### Core Services

| File | Purpose | Key Functions |
|------|---------|---|
| `router.js` | Route matching algorithm | `findRoute()`, `findDirectRoute()`, `findTransferRoute()` |
| `fareService.js` | Fare calculation | `calculateFare()`, `applyDiscount()`, `calculateTransferFare()` |
| `geminiService.js` | AI instruction generation | `generateCommuteInstructions()` |
| `mapsService.js` | Google Maps integration | `initializeMaps()`, `geocodeAddress()`, `addMarker()` |
| `firebaseService.js` | Firebase auth & data | `signInWithGoogle()`, `saveRoute()`, `getSavedRoutes()` |

### Utilities

| File | Purpose |
|------|---------|
| `haversine.js` | Distance calculations between coordinates |
| `constants.js` | App-wide constants (fares, radius, etc.) |
| `helpers.js` | Utility functions (formatting, parsing, etc.) |

### Data

| File | Purpose |
|------|---------|
| `iloiloRoutes.js` | Jeepney routes for Iloilo City |

### Components

| Component | Purpose |
|-----------|---------|
| `SearchBar` | User input for origin/destination |
| `RouteResult` | Display computed route with AI instructions |
| `MapView` | Google Maps visualization |
| `SavedRoutes` | List of user's saved routes |
| `Navbar` | Navigation and authentication |
| `LoadingSpinner` | Loading state indicator |

## Development Workflow

### 1. When Adding a New Route

Edit `src/data/iloiloRoutes.js`:

```javascript
{
  code: "06",
  name: "Molo to Arevalo",
  depart: [
    { name: "Molo Terminal", lat: 10.7050, lng: 122.5300 },
    { name: "Capitol", lat: 10.6950, lng: 122.5450 },
    { name: "Arevalo Terminal", lat: 10.7450, lng: 122.4900 }
  ],
  return: [
    { name: "Arevalo Terminal", lat: 10.7450, lng: 122.4900 },
    { name: "Capitol", lat: 10.6950, lng: 122.5450 },
    { name: "Molo Terminal", lat: 10.7050, lng: 122.5300 }
  ]
}
```

**Rules:**
- Stops must be in order (depart path, then return)
- Include accurate GPS coordinates
- Route code should be unique
- Name should describe the route clearly

### 2. When Modifying Fare Rules

Edit `src/utils/constants.js`:

```javascript
export const FARE_BASE = 13;           // Change base fare
export const FARE_DISTANCE_BASE = 4;   // Change base distance
export const FARE_PER_KM = 1.80;       // Change per-km rate
export const DISCOUNT_PERCENTAGE = 0.20; // Change discount
```

### 3. When Updating Walking Radius

Edit `src/utils/constants.js`:

```javascript
export const WALK_RADIUS_METERS = 400; // Increase/decrease as needed
```

### 4. When Adding New Passenger Type

1. Add to `src/utils/constants.js`:
   ```javascript
   PASSENGER_TYPES: {
     // ... existing types
     NEW_TYPE: 'new_type',
   }
   ```

2. Update discount eligibility if needed:
   ```javascript
   export const DISCOUNT_ELIGIBLE_TYPES = ['student', 'senior_citizen', 'pwd', 'new_type'];
   ```

3. Update SearchBar component dropdown

## Common Tasks

### Debug Route Matching

1. Add console logs in `router.js`:
   ```javascript
   console.log('Origin stops:', originStops);
   console.log('Destination stops:', destinationStops);
   ```

2. Check `iloiloRoutes.js` for coordinate accuracy

3. Test with known locations manually

### Test Fare Calculation

In browser console:

```javascript
import { calculateFare } from './src/services/fareService.js';

const result = calculateFare(10, 'regular'); // 10km, regular passenger
console.log(result);
```

### Test Geocoding

In browser console:

```javascript
import { geocodeAddress } from './src/services/mapsService.js';

const coords = await geocodeAddress("Mandurriao Plaza");
console.log(coords);
```

### Test Gemini Response

In browser console:

```javascript
import { generateCommuteInstructions } from './src/services/geminiService.js';

const route = { /* route object */ };
const response = await generateCommuteInstructions(route, 'regular');
console.log(response);
```

## Component Communication

### Data Flow

```
App.jsx (state: user, currentPage)
    ├── Navbar (receives: user, onUserChange)
    ├── Home (receives: user)
    │   ├── SearchBar (emits: onSearch)
    │   ├── MapView (receives: origin, destination, route)
    │   └── RouteResult (receives: route, fare, geminiResponse)
    └── Profile (receives: user)
        └── SavedRoutes (receives: user, onLoadRoute)
```

### Props Pattern

**Passing data down:**
```jsx
<Component propName={value} />
```

**Calling callbacks up:**
```jsx
<Component onEventName={handleEventName} />
```

## Styling

### CSS Variables (Global)

Available in `src/style.css`:

```css
--primary          /* Main brand color */
--secondary        /* Secondary accent */
--success          /* Success state */
--danger           /* Error/danger state */
--text             /* Main text color */
--bg               /* Background color */
--border           /* Border color */
--shadow           /* Drop shadow */
```

### Adding New Styles

1. Use CSS classes (BEM convention):
   ```css
   .component-name {}
   .component-name__element {}
   .component-name--modifier {}
   ```

2. Reference in components:
   ```jsx
   <div className="search-bar">
     <form className="search-bar__form">
       <input className="search-bar__input search-bar__input--active" />
     </form>
   </div>
   ```

## Testing

### Manual Testing Checklist

- [ ] Route search works for direct routes
- [ ] Transfer routes are detected correctly
- [ ] Fare calculation is accurate
- [ ] Map displays markers and polylines
- [ ] Google Sign-In works
- [ ] Routes can be saved (when logged in)
- [ ] Saved routes can be loaded
- [ ] AI instructions are generated
- [ ] Responsive on mobile devices

### Console Checks

Check browser console (F12) for:
- No errors (red)
- No warnings about missing props
- API calls are successful
- Firebase auth state changes

## Performance Tips

1. **Lazy load Google Maps**: Done in `initializeMaps()`
2. **Cache route data**: Already in `iloiloRoutes.js`
3. **Minimize re-renders**: Use React.memo for components
4. **Debounce search**: If adding auto-search
5. **Optimize images**: Keep assets in `public/` directory

## Security Reminders

- ✅ Never log API keys
- ✅ Keep `.env` out of git (in `.gitignore`)
- ✅ Use HTTPS in production
- ✅ Validate user input server-side (if backend exists)
- ✅ Use Firebase security rules in production

## Debugging Tips

### "Routes not found" Issue

Check in this order:
1. Verify address is in Iloilo City
2. Check `iloiloRoutes.js` has this area
3. Increase `WALK_RADIUS_METERS` temporarily
4. Check geocoding is working (test address manually)
5. Check route stop coordinates are accurate

### "Map not showing" Issue

1. Verify Maps API key is correct
2. Check API is enabled in Cloud Console
3. Check browser console for CORS errors
4. Verify map container has height (in CSS)
5. Check `initializeMaps()` completes successfully

### "Gemini not responding" Issue

1. Check API key is correct
2. Check rate limits (60/min free tier)
3. Check network tab for failed requests
4. Verify prompt format (should request JSON)
5. Try again after a moment

## Code Examples

### Adding a Button Handler

```jsx
function MyComponent() {
  const handleClick = async () => {
    try {
      const result = await someAsyncFunction();
      // Update state or trigger callback
    } catch (error) {
      console.error('Error:', error);
      // Show error to user
    }
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Adding a New API Call

```javascript
export async function newFunction(param) {
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ param })
    });

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: error.message };
  }
}
```

### Adding State Management

```jsx
function MyComponent() {
  const [state, setState] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAction = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await doSomething();
      setState(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <button onClick={handleAction}>Do Something</button>
    </div>
  );
}
```

## Resources

- [React Hooks Docs](https://react.dev/reference/react)
- [Vite HMR](https://vitejs.dev/guide/hmr.html)
- [Google Maps API](https://developers.google.com/maps)
- [Firebase Docs](https://firebase.google.com/docs)
- [Gemini API](https://ai.google.dev/docs)
