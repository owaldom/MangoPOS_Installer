# script_instalador_mangopos.ps1
#
# INSTRUCCIONES DE EJECUCIÓN:
# 1. Abrir PowerShell como Administrador.
# 2. Navegar a la carpeta del instalador:
#    cd "C:\Proyectos\MangoPOS_Installer"
# 3. Ejecutar el script:
#    Set-ExecutionPolicy Bypass -Scope Process -Force; .\script_instalador_mangopos.ps1
#
param(
    [switch]$Install,
    [switch]$Uninstall,
    [switch]$Repair,
    [switch]$Silent,
    [string]$SourcePath # Directorio donde estan los archivos fuente
)

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Inicializar SourcePath si no se proporciono
if ([string]::IsNullOrWhiteSpace($SourcePath)) {
    $basePath = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }
    $SourcePath = Join-Path $basePath "AppFiles"
}

$LogPath = "$env:ProgramData\MangoPOS\install.log"

# Configuracion
$Config = @{
    InstallDir      = "C:\MangoPOS"
    Services        = @(
        @{Name = "MangoPOS-App-web"; Port = 4200; Dir = "mangopos-app-web"; Command = "npx -y http-server ./dist/mangopos-app-web/browser -p 4200 --cors -d false" },
        @{Name = "MangoPOS-APP-API"; Port = 3000; Dir = "mangopos-app-api"; Command = "node src/server.js" },
        @{Name = "MangoPOS-Print"; Port = 3001; Dir = "backend-impresion"; Command = "node src/server.js" }
    )
    NodeVersion     = "24.9.0"
    PostgresVersion = "18.1"
    RequiredPorts   = @(4200, 3000, 3001, 5432)
}
$InstallersPath = if ($SourcePath) { Join-Path $SourcePath "installers" } else { "installers" }

function Write-Log {
    param($Message, [switch]$IsError)
    $prefix = if ($IsError) { " [!] ERROR: " } else { " [*] " }
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logDir = Split-Path $LogPath -Parent
    if (!(Test-Path $logDir)) {
        New-Item -ItemType Directory -Force -Path $logDir | Out-Null
    }
    "$timestamp$prefix$Message" | Out-File $LogPath -Append -Encoding UTF8
    if (!$Silent) {
        if ($IsError) { Write-Host "$prefix$Message" -ForegroundColor Red }
        else { Write-Host "$prefix$Message" -ForegroundColor Green }
    }
}

function Escape-Xml {
    param($string)
    if ([string]::IsNullOrEmpty($string)) { return "" }
    return $string.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;').Replace("'", '&apos;')
}

function Update-Progress {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Percent,
        [Parameter(Mandatory = $true)]
        [string]$Activity
    )
    Write-Log "PROGRESO ($Percent%): $Activity"
    Write-Progress -Activity "Instalacion de MangoPOS" -Status "$Activity" -PercentComplete $Percent
}

function Test-Admin {
    $currentUser = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    return $currentUser.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Configure-Firewall {
    Write-Log "Configurando Firewall de Windows..."
    foreach ($port in $Config.RequiredPorts) {
        $ruleName = "MangoPOS-Allow-Port-$port"
        if (!(Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue)) {
            New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort $port -Profile Any | Out-Null
            Write-Log "Regla de firewall creada para puerto $port"
        }
        else {
            Write-Log "Regla de firewall ya existe para puerto $port"
        }
    }
}

function Install-NodeJS {
    Write-Log "Verificando Node.js..."
    
    if (Get-Command node -ErrorAction SilentlyContinue) {
        $version = (node --version).Replace("v", "")
        Write-Log "Node.js $version encontrado"
        return $true
    }
    
    if (!$Silent) {
        $choice = Read-Host "Node.js no fue detectado. ¿Desea instalarlo ahora? (S/N)"
        if ($choice -notmatch "[sS]") {
            Write-Log "Instalacion de Node.js omitida por el usuario."
            return $false
        }
    }

    Write-Log "Instalando Node.js v$($Config.NodeVersion)..."
    $msiName = "node-v$($Config.NodeVersion)-x64.msi"
    $localInstaller = Join-Path $InstallersPath $msiName
    $installer = "$env:TEMP\nodejs.msi"
    
    try {
        if (Test-Path $localInstaller) {
            Write-Log "Usando instalador local: $localInstaller"
            Copy-Item $localInstaller $installer -Force
        }
        else {
            Write-Log "Descargando Node.js..."
            $url = "https://nodejs.org/dist/v$($Config.NodeVersion)/$msiName"
            Invoke-WebRequest -Uri $url -OutFile $installer -UseBasicParsing
        }
        $process = Start-Process msiexec.exe -ArgumentList "/i `"$installer`" /quiet /norestart" -Wait -NoNewWindow -PassThru
        if ($process.ExitCode -eq 0) {
            Write-Log "Node.js instalado correctamente"
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
            return $true
        }
        else {
            throw "Error en instalacion: $($process.ExitCode)"
        }
    }
    catch {
        Write-Log "ERROR: No se pudo instalar Node.js - $_" -IsError
        return $false
    }
}

function Install-PostgreSQL {
    Write-Log "Verificando PostgreSQL..."
    # Verificacion simple buscando el servicio
    if (Get-Service "postgresql*" -ErrorAction SilentlyContinue) {
        Write-Log "PostgreSQL ya esta instalado."
        return $true
    }

    if (!$Silent) {
        $choice = Read-Host "PostgreSQL no fue detectado. ¿Desea instalarlo ahora? (S/N)"
        if ($choice -notmatch "[sS]") {
            Write-Log "Instalacion de PostgreSQL omitida por el usuario."
            return $false
        }
    }

    Write-Log "Descargando e Instalando PostgreSQL v$($Config.PostgresVersion)..."
    
    $exeName = "postgresql-$($Config.PostgresVersion)-windows-x64.exe"
    $localInstaller = Join-Path $InstallersPath $exeName
    $pgInstaller = "$env:TEMP\postgresql.exe"
    
    try {
        if (Test-Path $localInstaller) {
            Write-Log "Usando instalador local: $localInstaller"
            Copy-Item $localInstaller $pgInstaller -Force
        }
        else {
            Write-Log "Descargando PostgreSQL..."
            $url = "https://get.enterprisedb.com/postgresql/$exeName" 
            Invoke-WebRequest -Uri $url -OutFile $pgInstaller -UseBasicParsing
        }
        
        # Instalacion silenciosa
        $args = "--mode unattended --superpassword `"mangopos`" --servicepassword `"mangopos`" --serverport 5432"
        
        $process = Start-Process $pgInstaller -ArgumentList $args -Wait -NoNewWindow -PassThru
        if ($process.ExitCode -eq 0) {
            Write-Log "PostgreSQL instalado correctamente."
            return $true
        }
        else {
            Write-Log "WARN: La instalacion de PostgreSQL retorno codigo $($process.ExitCode)."
            return $false
        }
    }
    catch {
        Write-Log "WARN: No se pudo instalar PostgreSQL automaticamente. ($_)"
        return $false
    }
}

function Install-WinSW {
    Write-Log "Instalando WinSW..."
    $winswPath = "$env:ProgramData\MangoPOS\WinSW.exe"
    if (Test-Path $winswPath) { return $winswPath }
    
    $winswUrl = "https://github.com/winsw/winsw/releases/download/v2.12.0/WinSW-x64.exe"
    $localInstaller = Join-Path $InstallersPath "WinSW-x64.exe"
    
    try {
        if (Test-Path $localInstaller) {
            Write-Log "Usando instalador local: $localInstaller"
            Copy-Item $localInstaller $winswPath -Force
        }
        else {
            Write-Log "Descargando WinSW..."
            Invoke-WebRequest -Uri $winswUrl -OutFile $winswPath -UseBasicParsing
        }
        return $winswPath
    }
    catch {
        Write-Log "ERROR: No se pudo instalar WinSW - $_" -IsError
        return $null
    }
}

function Create-Service {
    param($service, $winswExe)
    $serviceName = $service.Name
    $serviceDir = "$($Config.InstallDir)\$($service.Dir)"
    $exePath = Join-Path $serviceDir "$serviceName.exe"
    $xmlPath = Join-Path $serviceDir "$serviceName.xml"
    
    Write-Log "Configurando servicio: $serviceName con WinSW"
    
    # Detener y remover si existe
    if (Get-Service $serviceName -ErrorAction SilentlyContinue) {
        Stop-Service $serviceName -Force -ErrorAction SilentlyContinue
        if (Test-Path $exePath) {
            & $exePath uninstall | Out-Null
        }
    }

    # Copiar WinSW a la carpeta del servicio
    Copy-Item $winswExe -Destination $exePath -Force
    
    # Generar XML
    $xmlCommand = Escape-Xml $service.Command
    $xmlContent = @"
<service>
  <id>$serviceName</id>
  <name>MangoPOS - $serviceName</name>
  <description>Servicio de MangoPOS ($serviceName)</description>
  <executable>C:\Windows\System32\cmd.exe</executable>
  <arguments>/c "cd /d `"$serviceDir`" &amp;&amp; $xmlCommand"</arguments>
  <env name="PORT" value="$($service.Port)"/>
  <log mode="roll"></log>
  <onfailure action="restart" delay="10 sec"/>
</service>
"@
    $xmlContent | Out-File $xmlPath -Encoding UTF8
    
    # Instalar e iniciar
    & $exePath install | Out-Null
    Start-Service $serviceName -ErrorAction SilentlyContinue
}

function Main-Install {
    Write-Log "=== INSTALACION MANGOPOS ==="
    
    if (!(Test-Admin)) {
        Write-Log "ERROR: Se requieren privilegios de administrador." -IsError
        exit 1
    }
    
    Update-Progress -Percent 5 -Activity "Preparando directorios..."
    New-Item -ItemType Directory -Force -Path $Config.InstallDir | Out-Null
    if (!(Test-Path "$env:ProgramData\MangoPOS\logs")) {
        New-Item -ItemType Directory -Force -Path "$env:ProgramData\MangoPOS\logs" | Out-Null
    }
    
    # 1. Prerequisitos del Sistema
    Update-Progress -Percent 10 -Activity "Configurando Firewall..."
    Configure-Firewall
    
    Update-Progress -Percent 15 -Activity "Verificando Node.js..."
    Install-NodeJS | Out-Null
    
    Update-Progress -Percent 25 -Activity "Verificando PostgreSQL..."
    Install-PostgreSQL | Out-Null
    
    Update-Progress -Percent 35 -Activity "Verificando WinSW y Fuentes..."
    $winswExe = Install-WinSW
    if (!$winswExe) { exit 1 }

    # Validar Fuentes
    $requiredSources = @("mangopos-app-api", "mangopos-app-api")
    foreach ($src in $requiredSources) {
        $path = Join-Path $SourcePath $src
        if (!(Test-Path $path)) {
            Write-Log "ERROR: No se encontro la carpeta fuente '$src' en $SourcePath" -IsError
            if (!$Silent) { Read-Host "Presione Enter para salir..." }
            exit 1
        }
    }

    # 2. Copiar Archivos
    Update-Progress -Percent 40 -Activity "Deteniendo servicios existentes (si aplica)..."
    Get-Service "MangoPOS-*" -ErrorAction SilentlyContinue | Stop-Service -Force -ErrorAction SilentlyContinue

    Update-Progress -Percent 45 -Activity "Copiando archivos de aplicacion..."
    # Copiar Frontend
    Copy-Item -Path "$SourcePath\mangopos-app-web" -Destination $Config.InstallDir -Recurse -Force
    # Copiar Backend API
    Copy-Item -Path "$SourcePath\mangopos-app-api" -Destination $Config.InstallDir -Recurse -Force
    # Copiar Backend Impresion (si existe)
    if (Test-Path "$SourcePath\backend-impresion") {
        Copy-Item -Path "$SourcePath\backend-impresion" -Destination $Config.InstallDir -Recurse -Force
    }

    # 3. Verificacion de Integridad
    Update-Progress -Percent 55 -Activity "Verificando integridad de archivos..."
    $checkPaths = @(
        "$($Config.InstallDir)\mangopos-app-web\dist\mangopos-app-web\browser\index.html",
        "$($Config.InstallDir)\mangopos-app-api\src\server.js"
    )
    foreach ($path in $checkPaths) {
        if (!(Test-Path $path)) {
            Write-Log "ERROR: Archivo critico no encontrado: $path." -IsError
            if (!$Silent) { Read-Host "Presione Enter para salir..." }
            exit 1
        }
    }

    # 4. Inicializacion de Base de Datos
    Update-Progress -Percent 80 -Activity "Configurando Base de Datos..."
    try {
        Set-Location "$($Config.InstallDir)\mangopos-app-api"
        if (Test-Path "init-db.js") {
            if (Get-Command node -ErrorAction SilentlyContinue) {
                Write-Log "Inicializando esquemas de Base de Datos..."
                node init-db.js
            }
            else {
                Write-Log "WARN: Node.js no encontrado." -IsError
            }
        }
    }
    catch {
        Write-Log "FALLO en inicializacion de BD: $_" -IsError
    }

    # 5. Servicios
    Update-Progress -Percent 90 -Activity "Configurando servicios de sistema..."
    foreach ($service in $Config.Services) {
        Create-Service -service $service -winswExe $winswExe
    }

    # 6. Accesos Directos
    Update-Progress -Percent 95 -Activity "Creando accesos directos..."
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $shortcutPath = Join-Path $desktopPath "MangoPOS Control.lnk"
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($shortcutPath)
    $Shortcut.TargetPath = "powershell.exe"
    $Shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$($Config.InstallDir)\control.ps1`""
    $Shortcut.Save()
    
    # Script de Control
    $controlScript = @'
# MangoPOS Control
Write-Host "1. Abrir App (http://localhost:4200)"
Write-Host "2. Estado Servicios"
Write-Host "3. Reiniciar Todo"
$c = Read-Host "?"
switch($c){
    '1' { Start-Process "http://localhost:4200" }
    '2' { Get-Service "MangoPOS-*" }
    '3' { Get-Service "MangoPOS-*" | Restart-Service -Force }
}
'@
    $controlScript | Out-File "$($Config.InstallDir)\control.ps1" -Encoding UTF8
    
    Update-Progress -Percent 100 -Activity "Instalacion Completada."
    Write-Progress -Activity "Instalacion de MangoPOS" -Completed
    Write-Log "Instalacion Completada."
}

# Inicio
if (!$Silent) {
    $choice = Read-Host "1. Instalar, 2. Desinstalar (1/2)"
    if ($choice -eq '1') { Main-Install }
    elseif ($choice -eq '2') {
        Get-Service "MangoPOS-*" -ErrorAction SilentlyContinue | Stop-Service -Force
        Remove-Item "C:\MangoPOS" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "Desinstalado."
    }
}
elseif ($Install) {
    Main-Install
}