# Quick Start Guide - Running Laravel with Vue/Inertia Frontend

Since this application uses **Inertia.js + Vue** (not Blade templates), you need to run **TWO servers simultaneously**:
1. **Laravel PHP server** (backend API + Inertia responses)
2. **Vite dev server** (Vue.js hot-reload + asset compilation)

---

## Step-by-Step Commands

### 1. Navigate to Laravel Directory
```powershell
cd laravelserver
```

### 2. Install Dependencies (if not done already)
```powershell
composer install
npm install
```

### 3. Configure Environment
Make sure your `.env` file has the correct database settings:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=richenglish
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 4. Generate Application Key (if not done)
```powershell
php artisan key:generate
```

### 5. Create Database Tables
```powershell
php artisan migrate
```

### 6. Seed Database with Sample Data
```powershell
php artisan db:seed --class=RichEnglishSeeder
```

This will create:
- Super admin user: `richenglish@admin.com` (password: check seeder)
- Admin users
- Teacher users
- Students
- Classes
- Books
- And more sample data

### 7. Link Storage (for file uploads)
```powershell
php artisan storage:link
```

---

## Running the Application

### Option A: Run Both Servers Manually (Recommended for Development)

**Terminal 1 - Laravel Server:**
```powershell
php artisan serve
```
This starts Laravel on `http://localhost:8000`

**Terminal 2 - Vite Dev Server:**
```powershell
npm run dev
```
This starts Vite on `http://localhost:5173` (for hot-reload)

**Access the application at:** `http://localhost:8000`

---

### Option B: Use Composer Script (Runs Both Together)

The project includes a `dev` script that runs both servers concurrently:

```powershell
composer run dev
```

This will start:
- Laravel server on port 8000
- Vite dev server on port 5173
- Queue worker (optional)
- Log viewer (optional)

Press `Ctrl+C` to stop all services.

---

## Production Build

For production, build the assets first, then run only the Laravel server:

```powershell
npm run build
php artisan serve
```

Or deploy to your PHP hosting with:
- `public/` as web root
- `php artisan optimize` for performance
- Queue workers running in background

---

## Default Login Credentials

After seeding, check the `RichEnglishSeeder.php` file for default credentials, or create your own user:

```powershell
php artisan tinker
```

Then in tinker:
```php
$user = App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
    'role' => 'super-admin',
    'status' => 'active'
]);
```

---

## Troubleshooting

### Port Already in Use
If port 8000 is busy:
```powershell
php artisan serve --port=8001
```

### Database Connection Error
- Check MySQL is running
- Verify `.env` database credentials
- Ensure database `richenglish` exists

### Vite Not Loading Assets
- Make sure `npm run dev` is running
- Check browser console for errors
- Verify `APP_URL` in `.env` matches your server URL

### Clear Cache
```powershell
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

---

## Important Notes

- **Both servers must run** for the Vue/Inertia frontend to work properly
- The Laravel server handles API requests and Inertia responses
- The Vite server compiles Vue components and provides hot-reload
- In production, run `npm run build` once, then only the Laravel server is needed

