# Starting the Development Servers

## IMPORTANT: You need TWO terminals running!

### Terminal 1 - Laravel Server
```powershell
cd laravelserver
php artisan serve
```
This starts Laravel on `http://127.0.0.1:8000`

### Terminal 2 - Vite Dev Server (REQUIRED!)
```powershell
cd laravelserver
npm run dev
```
This starts Vite on `http://localhost:5173` and serves your Vue assets.

## Access the Application
Open your browser to: `http://127.0.0.1:8000`

**Both servers must be running** for the application to work properly!

---

## Alternative: Build for Production

If you want to run without the Vite dev server (production mode):

```powershell
npm run build
php artisan serve
```

This builds the assets once and serves them from `public/build/`.

