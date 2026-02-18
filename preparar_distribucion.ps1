# preparar_distribucion.ps1
#
# INSTRUCCIONES DE EJECUCIÓN:
# 1. Abrir PowerShell como Administrador.
# 2. Navegar a la carpeta del instalador:
#    cd "C:\Proyectos\MangoPOS_Installer"
# 3. Ejecutar el script:
#    Set-ExecutionPolicy Bypass -Scope Process -Force; .\preparar_distribucion.ps1
#
# Este script debe ser ejecutado por el desarrollador para preparar la carpeta AppFiles

$ErrorActionPreference = "Stop"

$SourceRepo = "C:\MangoPOS\F_mangoPosSunMarket"
$TargetDir = "C:\MangoPOS\MangoPOS_Installer\AppFiles"

Write-Host "--- PREPARANDO DISTRIBUCION MANGOPOS ---" -ForegroundColor Cyan

# 1. Limpiar carpeta destino
if (Test-Path $TargetDir) {
    Write-Host "Limpiando carpeta antigua..."
    Remove-Item $TargetDir -Recurse -Force
}
New-Item -ItemType Directory -Path $TargetDir | Out-Null

# 2. Construir Frontend
Write-Host "Construyendo Frontend (Angular)..."
Set-Location "$SourceRepo\mangopos_app_web"
npm run build 

# 3. Copiar Frontend Dist
Write-Host "Copiando Frontend compilado..."
$AppTarget = Join-Path $TargetDir "mangopos-app-web"
New-Item -ItemType Directory -Path $AppTarget | Out-Null
Copy-Item -Path "dist" -Destination $AppTarget -Recurse -Force

# 4. Copiar Backend API
Write-Host "Copiando Backend API..."
$ApiSource = "$SourceRepo\mangopos_app_api"
Copy-Item -Path $ApiSource -Destination $TargetDir -Recurse -Force
Rename-Item -Path (Join-Path $TargetDir "mangopos_app_api") -NewName "mangopos-app-api"

# 5. Copiar Backend Impresion
if (Test-Path "$SourceRepo\backend-impresion") {
    Write-Host "Copiando Backend Impresion..."
    Copy-Item -Path "$SourceRepo\backend-impresion" -Destination $TargetDir -Recurse -Force
}

# 6. Copiar Instaladores Base
$InstallersSource = "C:\MangoPOS\MangoPOS_Installer\installers"
if (Test-Path $InstallersSource) {
    Write-Host "Copiando instaladores..."
    Copy-Item -Path $InstallersSource -Destination (Join-Path $TargetDir "installers") -Recurse -Force
}

Write-Host "PROCESO TERMINADO. AppFiles esta lista." -ForegroundColor Green
Write-Host "Ejecute ahora script_instalador_mangopos.ps1"
