# Admin Dashboard Implementation - Integration with Backend APIs

## Summary
The admin dashboard page at `/app/admin/dashboard/page.tsx` has been successfully updated to fetch dynamic data from the backend APIs and display real-time statistics.

## Changes Made

### 1. **Component Structure Updates**
- Added `useEffect` hook to fetch data on component mount
- Added state management with `useState` for:
  - `stats`: Stores appointment, doctor, and user counts
  - `loading`: Loading state indicator
  - `error`: Error message handling

### 2. **API Integration**
The component now fetches data from the backend using axios:

#### Endpoints Used:
```
GET /api/doctors          → Get doctors count
GET /api/appointments     → Get appointments count  
GET /api/admins          → Get users/admin count
```

#### API Calls:
```typescript
// Doctors Count
const doctorsResponse = await axios.get(
  `${API_BASE_URL}/api/doctors`,
  { headers }
);

// Appointments Count
const appointmentsResponse = await axios.get(
  `${API_BASE_URL}/api/appointments`,
  { headers }
);

// Users Count (Admin endpoint pattern)
const usersResponse = await axios.get(
  `${API_BASE_URL}/api/admins`,
  { headers }
);
```

### 3. **JWT Authentication**
- Automatically retrieves JWT token from `localStorage`
- Adds token to Authorization header: `Bearer ${token}`
- Gracefully handles requests even if token is not available

```typescript
const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const headers = {
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};
```

### 4. **Loading States**
- Shows skeleton loader for each stat card while fetching
- Displays "-" for values during loading
- `LoadingSkeleton` component for visual feedback

### 5. **Error Handling**
- Catches API errors and displays user-friendly alert
- Shows backend URL for debugging
- Includes error message in red banner
- Error banner suggests checking if backend is running

### 6. **Dynamic Stat Cards**
The three stat cards now display real data:

| Metric | API Source | Update |
|--------|-----------|--------|
| **Total Appointments** | `/api/appointments` | Count of appointments array |
| **Total Doctors** | `/api/doctors` | Count of doctors array |
| **Total Users** | `/api/admins` | Count property from response |

### 7. **UI Enhancements**
- Added `AlertCircle` icon from lucide-react for error display
- Responsive error banner with helpful information
- Loading skeleton cards that animate during data fetch
- Maintains existing design and layout

## Code Example: API Configuration

```typescript
const API_BASE_URL = "http://localhost:5000";

// Fetch stats from backend APIs
useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Fetch all counts...
      const doctorsResponse = await axios.get(
        `${API_BASE_URL}/api/doctors`,
        { headers }
      );
      // ... etc
      
      setStats({
        appointments: appointmentsCount,
        doctors: doctorsCount,
        users: usersCount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);
```

## Requirements Met

✅ **React Hooks**: Uses `useEffect`, `useState` for state and side effects  
✅ **Axios**: All API requests use axios  
✅ **JWT Authentication**: Token from localStorage sent in Authorization header  
✅ **Dynamic Values**: Replaces all static values with backend API responses  
✅ **UI Structure**: Maintains existing StatCard components and layout  
✅ **Next.js Client Component**: Uses `"use client"` directive  
✅ **API Base URL**: Configured to `http://localhost:5000`  
✅ **Loading States**: Shows skeleton loaders during data fetch  
✅ **Error Handling**: Displays user-friendly error messages  
✅ **Responsive Design**: Maintains existing responsive layout  

## Backend API Requirements

### Current Endpoints Used:
1. `GET /api/doctors` - Returns array of doctor objects
2. `GET /api/appointments` - Returns array of appointment objects
3. `GET /api/admins` - Returns `{ count: number, admins: [...] }`

### Mounted in server.js:
- `/api/doctors` ✓ (from doctorCrudRoutes)
- `/api/appointments` ✓ (from appointmentRoutes)
- `/api/admins` ✓ (from adminRoutes)

## Testing Instructions

### Prerequisites:
1. Backend server running at `http://localhost:5000`
2. Admin authenticated (JWT token in localStorage)
3. Database populated with sample data

### Steps:
1. Navigate to admin dashboard: `http://localhost:3000/admin/dashboard`
2. Dashboard will automatically fetch data on load
3. Watch for loading skeleton cards to appear
4. Verify real counts display:
   - Appointments count from appointments table
   - Doctors count from doctors table
   - Users count from users table

### Expected Behavior:
- **On Load**: Shows skeleton loaders for 1-2 seconds
- **Success**: Displays real counts from backend
- **Error**: Shows red error banner if API unreachable
- **No Token**: Still shows data if endpoints are public

## Notes for Backend Enhancement

### Optional Enhancement: Dedicated Stats Endpoint
If you want to optimize API calls, create a single `/api/stats` endpoint:

```javascript
// In a new admin.stats.controller.js
exports.getStatsCount = async (req, res) => {
  try {
    const [doctors] = await db.query('SELECT COUNT(*) as count FROM doctors');
    const [appointments] = await db.query('SELECT COUNT(*) as count FROM appointments');
    const [users] = await db.query('SELECT COUNT(*) as count FROM users WHERE role="patient"');
    
    res.json({
      doctors: doctors[0].count,
      appointments: appointments[0].count,
      users: users[0].count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```

Then in the component, replace the three calls with one:
```typescript
const statsResponse = await axios.get(`${API_BASE_URL}/api/stats`, { headers });
setStats({
  appointments: statsResponse.data.appointments,
  doctors: statsResponse.data.doctors,
  users: statsResponse.data.users,
});
```

## Files Modified
- `/frontend/app/admin/dashboard/page.tsx` - Updated with API integration

## Package Dependencies
All required packages are already installed:
- ✓ `axios` - HTTP client
- ✓ `lucide-react` - Icons
- ✓ `recharts` - Charts
- ✓ `tailwindcss` - Styling

---

**Status**: ✅ Complete and Ready for Testing
