# Script pour créer l'architecture complète du projet BachataVibe V4

# Dossiers Backend (Django)
$backendDirs = @(
    "backend\config\settings",
    "backend\apps\core\models",
    "backend\apps\core\api",
    "backend\apps\core\services",
    "backend\apps\organization\models",
    "backend\apps\organization\api",
    "backend\apps\courses\models",
    "backend\apps\courses\api",
    "backend\apps\events\models",
    "backend\apps\events\api",
    "backend\apps\shop\models",
    "backend\apps\shop\api",
    "backend\media",
    "backend\static",
    "backend\requirements"
)

# Dossiers Frontend (Next.js)
$frontendDirs = @(
    "frontend\app\(site)\about",
    "frontend\app\(site)\contact",
    "frontend\app\(app)\agence",
    "frontend\app\(app)\cours\[slug]",
    "frontend\app\(app)\events",
    "frontend\app\(app)\shop",
    "frontend\app\(auth)\login",
    "frontend\app\(auth)\register",
    "frontend\app\(dashboard)\profile",
    "frontend\app\(dashboard)\my-orders",
    "frontend\components\ui",
    "frontend\components\shared\Navbar",
    "frontend\components\shared\Footer",
    "frontend\components\features\landing",
    "frontend\components\features\organization",
    "frontend\components\features\courses",
    "frontend\components\features\events",
    "frontend\components\providers",
    "frontend\lib",
    "frontend\hooks",
    "frontend\types",
    "frontend\public\images",
    "frontend\public\videos",
    "frontend\public\models",
    "frontend\styles"
)

# Dossiers Mobile (React Native Expo)
$mobileDirs = @(
    "mobile\app\(tabs)\home",
    "mobile\app\(tabs)\courses",
    "mobile\app\(tabs)\profile",
    "mobile\src\components",
    "mobile\src\features",
    "mobile\src\hooks"
)

# Dossier apps (pour futures applications)
$appsDirs = @(
    "apps"
)

# Créer tous les dossiers
Write-Host "Création de la structure Backend..." -ForegroundColor Cyan
foreach ($dir in $backendDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Host "Création de la structure Frontend..." -ForegroundColor Cyan
foreach ($dir in $frontendDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Host "Création de la structure Mobile..." -ForegroundColor Cyan
foreach ($dir in $mobileDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Host "Création du dossier apps..." -ForegroundColor Cyan
foreach ($dir in $appsDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

Write-Host "`n✅ Structure complète créée avec succès!" -ForegroundColor Green
Write-Host "`nArborescence:" -ForegroundColor Yellow
Get-ChildItem -Directory | ForEach-Object { Write-Host "  📁 $_.Name" -ForegroundColor White }
