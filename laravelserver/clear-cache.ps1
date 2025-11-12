# Clear Vite cache
Write-Host "Clearing Vite cache..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# Clear Laravel caches
Write-Host "Clearing Laravel caches..." -ForegroundColor Yellow
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

Write-Host "Cache cleared! Please restart your dev servers." -ForegroundColor Green

