# System Structure - Laravel Implementation

This document provides an overview of how the Laravel implementation is structured and how it maps to the legacy MERN stack.

## Architecture Overview

### Legacy MERN Stack
```
legacy-mern-server/          legacy-mern-client/
├── routes/                   ├── src/
│   ├── authRoutes.js        │   ├── pages/
│   ├── studentRoutes.js     │   │   ├── Teacher/
│   ├── teacherRoutes.js     │   │   ├── Admin/
│   └── ...                   │   │   ├── SuperAdmin/
│                              │   │   └── Public/
├── controller/               │   ├── components/
│   ├── authController.js    │   ├── lib/
│   ├── studentsController.js │   └── ...
├── model/                    └── ...
│   ├── User.js
│   ├── Teacher.js
│   └── ...
├── middleware/
└── ...
```

### Laravel Implementation
```
laravelserver/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/          # API Controllers
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── StudentController.php
│   │   │   │   └── ...
│   │   │   └── Auth/         # Inertia Controllers
│   │   ├── Middleware/       # Custom Middleware
│   │   │   ├── EnsureUserHasRole.php
│   │   │   ├── AttachTokenFromCookie.php
│   │   │   └── HandleCors.php
│   │   └── Services/         # Service Classes
│   │       └── TokenCookieFactory.php
│   ├── Models/               # Eloquent Models
│   │   ├── User.php
│   │   ├── TeacherProfile.php
│   │   ├── Student.php
│   │   └── ...
│   └── ...
├── routes/
│   ├── api.php               # API Routes
│   ├── web.php               # Web/Inertia Routes
│   └── auth.php              # Auth Routes
├── database/
│   ├── migrations/           # Database Migrations
│   └── seeders/              # Database Seeders
├── resources/
│   ├── js/
│   │   ├── Pages/            # Inertia Pages (Vue)
│   │   │   ├── Teacher/
│   │   │   ├── Admin/
│   │   │   ├── SuperAdmin/
│   │   │   └── Public/
│   │   ├── Components/       # Vue Components
│   │   │   ├── ui/           # shadcn-vue components
│   │   │   └── ...
│   │   ├── Layouts/          # Layout Components
│   │   └── lib/              # Utilities
│   └── css/
└── ...
```

---

## Directory Structure Mapping

### Backend Mapping

| Legacy MERN | Laravel Equivalent | Status |
|------------|-------------------|--------|
| `routes/*.js` | `routes/api.php` | ✅ Migrated |
| `controller/*.js` | `app/Http/Controllers/Api/*.php` | ✅ Migrated |
| `model/*.js` | `app/Models/*.php` | ✅ Migrated |
| `middleware/*.js` | `app/Http/Middleware/*.php` | ✅ Migrated |
| `helper/*.js` | `app/Helpers/*.php` or `app/Services/*.php` | ⚠️ Partial |
| `lib/*.js` | `app/Services/*.php` or `app/Libraries/*.php` | ⚠️ Partial |
| `database/connectDB.js` | `config/database.php` + `.env` | ✅ Migrated |
| `database/schema.sql` | `database/migrations/*.php` | ✅ Migrated |
| `seed.js` | `database/seeders/*.php` | ✅ Migrated |

### Frontend Mapping

| Legacy MERN | Laravel Equivalent | Status |
|------------|-------------------|--------|
| `src/pages/Public/*.jsx` | `resources/js/Pages/Public/*.vue` | ✅ Migrated |
| `src/pages/Teacher/*.jsx` | `resources/js/Pages/Teacher/*.vue` | ⚠️ Partial |
| `src/pages/Admin/*.jsx` | `resources/js/Pages/Admin/*.vue` | ⚠️ Partial |
| `src/pages/SuperAdmin/*.jsx` | `resources/js/Pages/SuperAdmin/*.vue` | ⚠️ Partial |
| `src/components/*.jsx` | `resources/js/Components/*.vue` | ⚠️ Partial |
| `src/lib/axios/*.js` | `resources/js/lib/api.js` | ✅ Migrated |
| `src/lib/zustand/*.js` | Inertia.js props | ✅ Migrated |
| `src/lib/reaactquery/*.js` | Vue Composition API + Axios | ✅ Migrated |

---

## Technology Stack Mapping

### Backend

| Legacy | Laravel | Purpose |
|--------|---------|---------|
| Node.js + Express | Laravel (PHP) | Web Framework |
| MongoDB + Mongoose | MySQL + Eloquent | Database & ORM |
| JWT (jsonwebtoken) | Laravel Sanctum | Authentication |
| bcrypt | Laravel Hash | Password Hashing |
| multer | Laravel Storage | File Uploads |
| Socket.IO | Laravel Broadcasting + Pusher | Real-time |
| Redis | Redis (Laravel Cache) | Caching |
| Nodemailer | Laravel Mail | Email |
| Swagger | Laravel API Documentation | API Docs |

### Frontend

| Legacy | Laravel | Purpose |
|--------|---------|---------|
| React | Vue.js 3 | UI Framework |
| React Router | Inertia.js | Routing |
| Zustand | Inertia.js Props | State Management |
| React Query | Vue Composition API | Data Fetching |
| Axios | Axios (same) | HTTP Client |
| Tailwind CSS | Tailwind CSS (same) | Styling |
| Heroicons | Heroicons (same) | Icons |
| shadcn/ui | shadcn-vue | UI Components |
| AOS | AOS (same) | Animations |

---

## API Route Structure

### Legacy MERN API Routes
```
/api/v1/auth/*
/api/v1/students/*
/api/v1/teacher/*
/api/v1/class/*
/api/v1/attendance/*
/api/v1/books/*
/api/v1/book-assign/*
/api/v1/payout/*
/api/v1/recording/*
/api/v1/screen-shot/*
/api/v1/message/*
/api/v1/notification/*
/api/v1/dashboard/*
```

### Laravel API Routes
```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        // Auth routes
    });
    
    Route::middleware(['auth:sanctum'])->group(function () {
        // Protected routes
    });
});
```

**Mapping:** ✅ Identical structure maintained

---

## Database Schema Mapping

### MongoDB Collections → MySQL Tables

| MongoDB Collection | MySQL Table | Status |
|-------------------|------------|--------|
| `users` | `users` | ✅ Migrated |
| `teacher_profiles` | `teacher_profiles` | ✅ Migrated |
| `admin_teacher` | `admin_teacher` (pivot) | ✅ Migrated |
| `students` | `students` | ✅ Migrated |
| `classes` | `classes` | ✅ Migrated |
| `attendances` | `attendances` | ✅ Migrated |
| `books` | `books` | ✅ Migrated |
| `book_assignments` | `book_assignments` | ✅ Migrated |
| `recordings` | `recordings` | ✅ Migrated |
| `screenshots` | `screenshots` | ✅ Migrated |
| `notifications` | `notifications` | ✅ Migrated |
| `messages` | `messages` | ✅ Migrated |
| `payouts` | `payouts` | ✅ Migrated |
| `personal_access_tokens` | `personal_access_tokens` | ✅ Migrated |

### Key Differences

**MongoDB (Legacy):**
- Document-based storage
- Embedded documents (e.g., `reset.otp`, `reset.expiration`)
- Flexible schema
- ObjectId references

**MySQL (Laravel):**
- Relational tables
- Foreign key relationships
- Structured schema
- Integer/string IDs
- Pivot tables for many-to-many

---

## Authentication Flow

### Legacy MERN
```
1. POST /api/v1/auth/login
   → Returns JWT token in cookie
   → Stores user in Zustand store

2. Subsequent requests:
   → Cookie sent automatically
   → authenticateToken middleware validates JWT
   → User attached to req.user
```

### Laravel
```
1. POST /api/v1/auth/login
   → Creates Sanctum token
   → Sets token in cookie
   → Returns user data

2. Subsequent requests:
   → Cookie sent automatically
   → AttachTokenFromCookie middleware extracts token
   → Sanctum validates token
   → User available via $request->user()
```

**Mapping:** ✅ Functionally equivalent

---

## File Upload Handling

### Legacy MERN
```javascript
// multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/books',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Route
router.post('/', upload.single('file'), addBook);
```

### Laravel
```php
// Controller
public function store(Request $request) {
    $request->validate([
        'file' => 'required|file|mimes:pdf|max:51200',
    ]);
    
    $path = $request->file('file')->store('books', 'public');
    // ...
}
```

**Mapping:** ✅ Functionally equivalent (Laravel Storage)

---

## Real-time Communication

### Legacy MERN
```javascript
// Socket.IO
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    socket.on('message', (data) => {
        io.emit('message', data);
    });
});
```

### Laravel (To Be Implemented)
```php
// Laravel Broadcasting + Pusher
use Illuminate\Broadcasting\Channel;

class MessageSent implements ShouldBroadcast {
    public function broadcastOn() {
        return new Channel('messages');
    }
}
```

**Mapping:** ⚠️ Needs implementation (Laravel Broadcasting)

---

## Caching Strategy

### Legacy MERN
```javascript
// Redis caching middleware
const cache = (key) => {
    return async (req, res, next) => {
        const cached = await redis.get(key);
        if (cached) return res.json(JSON.parse(cached));
        // ... fetch data
        await redis.set(key, JSON.stringify(data));
    };
};
```

### Laravel
```php
// Laravel Cache
use Illuminate\Support\Facades\Cache;

$data = Cache::remember("students:{$page}", 3600, function () {
    return Student::paginate(10);
});
```

**Mapping:** ✅ Functionally equivalent (Laravel Cache)

---

## Error Handling

### Legacy MERN
```javascript
// Custom error middleware
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        error: {
            message: err.message,
            statusCode: err.statusCode || 500
        }
    });
});
```

### Laravel
```php
// Exception Handler
public function render($request, Throwable $exception) {
    if ($exception instanceof ModelNotFoundException) {
        return response()->json([
            'error' => [
                'message' => 'Resource not found',
                'statusCode' => 404
            ]
        ], 404);
    }
    // ...
}
```

**Mapping:** ✅ Functionally equivalent

---

## Frontend State Management

### Legacy MERN
```javascript
// Zustand store
const useAuthStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null })
}));
```

### Laravel
```php
// Inertia middleware
HandleInertiaRequests::class => [
    'share' => [
        'auth' => fn () => Auth::user(),
    ],
],
```

```vue
<!-- Vue component -->
<script setup>
const page = usePage();
const user = computed(() => page.props.auth?.user);
</script>
```

**Mapping:** ✅ Functionally equivalent (Inertia.js props)

---

## Routing Structure

### Legacy MERN
```javascript
// React Router
<Route path="/portal/teacher/dashboard" element={<TeacherDashboard />} />
<Route path="/portal/admin/teachers" element={<AdminTeachers />} />
```

### Laravel
```php
// web.php
Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->middleware('auth')
    ->name('dashboard');

Route::get('/teachers', fn () => Inertia::render('Teachers/Index'))
    ->middleware(['auth', 'role:admin,super-admin'])
    ->name('teachers.index');
```

```vue
<!-- Vue component -->
<script setup>
import { router } from '@inertiajs/vue3';
router.visit(route('teachers.index'));
</script>
```

**Mapping:** ✅ Functionally equivalent (Inertia.js)

---

## Component Structure

### Legacy MERN (React)
```jsx
// Teacher/Students.jsx
import { useQuery } from '@tanstack/react-query';
import { studentsQuery } from '@/lib/reaactquery/teacher';

const Students = () => {
    const { data, isLoading } = useQuery(studentsQuery());
    return <div>{/* ... */}</div>;
};
```

### Laravel (Vue)
```vue
<!-- Students/Index.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import api from '@/lib/api';

const students = ref([]);
const loading = ref(false);

const fetchStudents = async () => {
    loading.value = true;
    const { data } = await api.get('/students');
    students.value = data.students;
    loading.value = false;
};

onMounted(fetchStudents);
</script>

<template>
    <div><!-- ... --></div>
</template>
```

**Mapping:** ✅ Functionally equivalent (Vue Composition API)

---

## Key Implementation Patterns

### 1. API Controllers
- **Location:** `app/Http/Controllers/Api/`
- **Pattern:** RESTful resource controllers
- **Response:** JSON with consistent structure
- **Validation:** Laravel Form Requests or inline validation

### 2. Inertia Pages
- **Location:** `resources/js/Pages/`
- **Pattern:** Vue Single File Components
- **Data:** Passed via Inertia::render()
- **Navigation:** Inertia router

### 3. Middleware
- **Location:** `app/Http/Middleware/`
- **Pattern:** Custom middleware for RBAC, CORS, token handling
- **Registration:** `bootstrap/app.php`

### 4. Models
- **Location:** `app/Models/`
- **Pattern:** Eloquent ORM
- **Relationships:** Defined in model classes
- **Scopes:** Query scopes for common queries

### 5. Migrations
- **Location:** `database/migrations/`
- **Pattern:** Laravel migration files
- **Relationships:** Foreign keys defined in migrations

### 6. Seeders
- **Location:** `database/seeders/`
- **Pattern:** DatabaseSeeder calls specific seeders
- **Data:** Matches legacy seed.js structure

---

## Environment Configuration

### Legacy MERN (.env)
```
MONGODB_URI=mongodb://localhost:27017/RichEnglish
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

### Laravel (.env)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravelrichenglish
DB_USERNAME=root
DB_PASSWORD=

APP_URL=http://127.0.0.1:8000
SANCTUM_STATEFUL_DOMAINS=127.0.0.1:8000,localhost:8000
SESSION_DOMAIN=127.0.0.1
```

---

## Development Workflow

### Legacy MERN
```bash
# Backend
cd server
npm install
npm run dev  # Port 5000

# Frontend
cd client
npm install
npm run dev  # Port 3000
```

### Laravel
```bash
# Backend + Frontend (unified)
cd laravelserver
composer install
npm install
php artisan migrate
php artisan db:seed
php artisan serve  # Port 8000
npm run dev        # Vite dev server
```

---

## Deployment Considerations

### Legacy MERN
- Separate Node.js server
- MongoDB database
- React build served statically
- Environment variables for both

### Laravel
- Single PHP application
- MySQL database
- Vite build for frontend assets
- Environment variables in .env
- Can use Laravel Forge, Vapor, or traditional hosting

---

## Performance Optimizations

### Implemented
- ✅ Database indexing (via migrations)
- ✅ Query optimization (Eloquent relationships)
- ✅ Caching middleware (can use Redis)
- ✅ Eager loading (to prevent N+1 queries)

### To Be Implemented
- ⚠️ Redis caching (configured but not actively used)
- ⚠️ Query result caching
- ⚠️ Asset optimization (Vite production build)
- ⚠️ Database query optimization
- ⚠️ API response caching

---

## Security Features

### Implemented
- ✅ CSRF protection (Laravel default)
- ✅ XSS protection (Laravel default)
- ✅ SQL injection protection (Eloquent)
- ✅ Authentication (Sanctum)
- ✅ Authorization (Role-based middleware)
- ✅ CORS handling (custom middleware)
- ✅ Password hashing (Laravel Hash)

### To Be Implemented
- ⚠️ Rate limiting
- ⚠️ Input sanitization
- ⚠️ File upload validation (partially done)
- ⚠️ API throttling

---

## Testing Strategy

### Legacy MERN
- Jest for unit tests
- Supertest for API tests
- React Testing Library for components

### Laravel (Recommended)
- PHPUnit for unit/feature tests
- Pest (alternative to PHPUnit)
- Laravel Dusk for browser tests
- Vue Test Utils for component tests

**Status:** ❌ Not yet implemented

---

## Documentation

### API Documentation
- **Legacy:** Swagger/OpenAPI (auto-generated from JSDoc)
- **Laravel:** Can use Laravel API Documentation packages or maintain Swagger

**Status:** ⚠️ Needs implementation

### Code Documentation
- **Legacy:** JSDoc comments
- **Laravel:** PHPDoc comments

**Status:** ⚠️ Partial (needs completion)

---

## Migration Checklist

### Backend
- [x] Routes migrated
- [x] Controllers migrated
- [x] Models migrated
- [x] Middleware migrated
- [x] Database schema migrated
- [x] Seeders created
- [x] Authentication system migrated
- [ ] Helper functions migrated
- [ ] Services migrated
- [ ] Real-time features migrated
- [ ] Caching implemented
- [ ] Error handling refined

### Frontend
- [x] Public pages migrated
- [x] Authentication pages migrated
- [x] Dashboard pages migrated
- [x] Basic listing pages migrated
- [ ] Detail pages migrated
- [ ] Advanced components migrated
- [ ] Forms migrated
- [ ] Real-time UI migrated
- [ ] Animations added
- [ ] Responsive design verified

---

## Conclusion

The Laravel implementation maintains the same functionality and structure as the legacy MERN stack while leveraging Laravel's built-in features and conventions. The migration preserves:

- ✅ All API endpoints
- ✅ All user roles and permissions
- ✅ Database relationships
- ✅ Authentication flow
- ✅ File upload handling
- ✅ Basic frontend pages

Remaining work focuses on:
- ⚠️ Completing detail pages
- ⚠️ Implementing advanced features
- ⚠️ Migrating real-time functionality
- ⚠️ Adding missing UI components
- ⚠️ Optimizing performance

