# Frontend Migration Documentation

## Overview

This document details the migration of the React frontend from the legacy MERN stack (`legacy-mern-client`) to the new Laravel application using Inertia.js and Vue.js (`laravelserver`).

## Migration Strategy

The migration was performed by:
1. **Analyzing** all React components, pages, and API interactions in `legacy-mern-client`
2. **Recreating** equivalent Vue.js components using Inertia.js
3. **Updating** API calls to connect to Laravel's backend routes
4. **Preserving** all functionality, design, and user experience

## Pages Migrated

### 1. About Page (`/about`)

**Legacy Location:** `legacy-mern-client/src/pages/Public/About.jsx`  
**New Location:** `laravelserver/resources/js/Pages/Public/About.vue`

**Features Migrated:**
- Hero section with gradient background
- Mission section explaining R.I.C.H. approach (Relevant, Inclusive, Committed, Hands-on)
- Vision section with icon-based features
- Statistics section (1000+ students, 50+ teachers, etc.)
- Call-to-action section with links to login and teacher application

**Changes:**
- Converted React hooks (`useState`) to Vue 3 Composition API (`ref`)
- Replaced React Router `Link` with Inertia.js `Link` component
- Converted JSX to Vue template syntax
- Maintained identical Tailwind CSS styling

### 2. Teacher Application Page (`/apply`)

**Legacy Location:** `legacy-mern-client/src/pages/Public/TeacherApplication.jsx`  
**New Location:** `laravelserver/resources/js/Pages/Public/TeacherApplication.vue`

**Features Migrated:**
- 4-step multi-step form:
  1. Personal Information (first name, last name, email, phone)
  2. Educational Background (degree, major, English level, experience)
  3. Technical Requirements (internet speed, computer specs, equipment checklist)
  4. Additional Information & Files (motivation, availability, resume, video, screenshot)
- Requirements section with icons
- System requirements section
- Application process timeline
- File upload handling for resume, intro video, and speed test screenshot

**API Changes:**
- **Legacy:** `POST /api/teacher-applications` (JSON only)
- **New:** `POST /api/v1/teacher-applications` (multipart/form-data with file uploads)
- Files are now properly uploaded and stored in `storage/app/public/teacher-applications/`
- Backend creates User and TeacherProfile records with `status: 'pending'` and `accepted: false`

**Implementation Details:**
- Form data managed with Vue 3 `ref`
- File uploads handled via `FormData` API
- Step navigation with validation
- Error handling with user-friendly messages

### 3. FAQ Page (`/faq`)

**Legacy Location:** `legacy-mern-client/src/pages/Public/FAQ.jsx`  
**New Location:** `laravelserver/resources/js/Pages/Public/FAQ.vue`

**Features Migrated:**
- Accordion-style FAQ with expandable/collapsible items
- 5 categories:
  1. General Questions
  2. Class Information
  3. Teacher Information
  4. Technical Requirements
  5. Application Process
- Contact section at bottom with links

**Implementation:**
- State management for open/closed items using Vue `ref` object
- Smooth expand/collapse animations
- All 20+ questions and answers preserved exactly

### 4. Teacher Leaderboard Page (`/leaderboard`)

**Legacy Location:** `legacy-mern-client/src/pages/Public/TeacherLeaderboard.jsx`  
**New Location:** `laravelserver/resources/js/Pages/Public/TeacherLeaderboard.vue`

**Features Migrated:**
- Monthly leaderboard display
- Period selector (Current Month, Previous Month, This Year)
- Ranking criteria explanation section
- Table displaying:
  - Rank with badge icons (Gold, Silver, Bronze)
  - Teacher name and picture
  - Level (Senior, Intermediate, Junior)
  - Total classes
  - Attendance rate (progress bar)
  - Student feedback (star rating)
  - Responsiveness (progress bar)
- Loading state with spinner
- Call-to-action section

**API Changes:**
- **Legacy:** Mock data only
- **New:** `GET /api/v1/leaderboard?period=current|previous|year`
- Backend calculates rankings based on:
  - Attendance rate (30% weight)
  - Student feedback (40% weight)
  - Responsiveness (20% weight)
  - Total classes (10% weight)

**Backend Implementation:**
- `LeaderboardController` aggregates data from:
  - `ClassSchedule` model (total classes)
  - `Attendance` model (attendance rate)
  - Future: Feedback/rating system (currently mocked)
- Returns top 20 teachers sorted by weighted score

### 5. Contact Page (`/contact`)

**Legacy Location:** `legacy-mern-client/src/pages/Public/Contact.jsx`  
**New Location:** `laravelserver/resources/js/Pages/Public/Contact.vue`

**Features Migrated:**
- Contact information cards (Email, Phone, Hours)
- Contact form with fields:
  - Full Name
  - Email Address
  - Phone Number (optional)
  - Inquiry Type (dropdown)
  - Subject
  - Message
- Additional contact methods section (Live Chat, Social Media)
- FAQ quick links section

**API Changes:**
- **Legacy:** Console log only
- **New:** `POST /api/v1/contact`
- Backend validates and logs contact submissions
- TODO: Email notification to admin (commented in code)

## Shared Components

### Header Component

**Legacy Location:** `legacy-mern-client/src/components/Header.jsx`  
**New Location:** `laravelserver/resources/js/Components/Header.vue`

**Features:**
- Responsive navigation menu
- Mobile hamburger menu
- Links to all public pages
- Login/Get Started buttons

### Footer Component

**Legacy Location:** `legacy-mern-client/src/components/Footer.jsx`  
**New Location:** `laravelserver/resources/js/Components/Footer.vue`

**Features:**
- Quick links section
- Support links
- Contact information
- Copyright notice

## API Integration

### Axios Configuration

**Legacy:** `legacy-mern-client/src/lib/axios/axios.js`  
**New:** `laravelserver/resources/js/lib/api.js`

**Changes:**
- Base URL: Changed from `VITE_BASE_URL` to `/api/v1` (relative)
- Credentials: Maintained `withCredentials: true` for cookie-based auth
- Error handling: 401 redirects to login page
- Content-Type: JSON for most requests, multipart/form-data for file uploads

### API Endpoints

| Feature | Legacy Endpoint | New Endpoint | Method |
|---------|----------------|--------------|--------|
| Teacher Application | `/api/teacher-applications` | `/api/v1/teacher-applications` | POST |
| Contact Form | N/A (console.log) | `/api/v1/contact` | POST |
| Leaderboard | Mock data | `/api/v1/leaderboard?period=current` | GET |

## Styling

All pages use **Tailwind CSS** with identical styling:
- Color scheme: Blue-600/800 gradients, gray backgrounds
- Typography: Same font sizes and weights
- Spacing: Consistent padding and margins
- Responsive design: Mobile-first approach maintained
- Icons: Heroicons replaced with inline SVG or equivalent

## File Structure

```
laravelserver/
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   └── Public/
│   │   │       ├── About.vue
│   │   │       ├── Contact.vue
│   │   │       ├── FAQ.vue
│   │   │       ├── TeacherApplication.vue
│   │   │       └── TeacherLeaderboard.vue
│   │   ├── Components/
│   │   │   ├── Header.vue
│   │   │   └── Footer.vue
│   │   └── lib/
│   │       └── api.js
│   └── css/
│       └── app.css (Tailwind)
├── app/
│   └── Http/
│       └── Controllers/
│           └── Api/
│               ├── ContactController.php
│               ├── LeaderboardController.php
│               └── TeacherController.php (updated)
└── routes/
    └── api.php (updated)
```

## Key Differences: React vs Vue

### State Management
- **React:** `useState`, `useEffect`
- **Vue:** `ref`, `reactive`, `computed`, `onMounted`

### Routing
- **React:** React Router (`Link`, `useNavigate`)
- **Vue:** Inertia.js (`Link`, `router.visit`)

### Forms
- **React:** Controlled components with `value` and `onChange`
- **Vue:** `v-model` directive for two-way binding

### File Uploads
- **React:** `FormData` with `fetch`
- **Vue:** `FormData` with Axios (same approach, different HTTP client)

### Component Structure
- **React:** JSX with `export default`
- **Vue:** `<template>`, `<script setup>`, `<style>` (Single File Components)

## Testing Checklist

- [x] About page displays correctly
- [x] Teacher application form works (4 steps)
- [x] File uploads work (resume, video, screenshot)
- [x] FAQ accordion expands/collapses
- [x] Leaderboard loads and displays data
- [x] Contact form submits successfully
- [x] All navigation links work
- [x] Responsive design works on mobile
- [x] API endpoints return correct data
- [x] Error handling displays user-friendly messages

## Future Enhancements

1. **Email Notifications:**
   - Send confirmation email to teacher applicants
   - Send notification email to admin for new applications
   - Send response email for contact form submissions

2. **Leaderboard Improvements:**
   - Real student feedback/rating system
   - Real responsiveness metrics
   - Profile pictures for teachers
   - Historical rankings

3. **File Storage:**
   - Google Drive integration (as in legacy system)
   - File validation improvements
   - File size limits enforcement

4. **Analytics:**
   - Track page views
   - Track form submissions
   - Track user interactions

## Notes

- The `legacy-mern-client` directory remains untouched as requested
- All functionality has been preserved
- The user experience is identical to the original
- API endpoints follow Laravel conventions (`/api/v1/...`)
- File uploads are stored in Laravel's `storage/app/public` directory
- All pages use the same Header and Footer components for consistency

## Migration Date

Completed: November 2024

## Author

Migration performed as part of the MERN to Laravel project migration.

