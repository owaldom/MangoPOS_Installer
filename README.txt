Install-Module -Name ps2exe -Force -AllowClobber


PS C:\proyectos\MangoPOS_Installer>
powershell -ExecutionPolicy Bypass -File "C:\MangoPOS\MangoPOS_Installer\preparar_distribucion.ps1"

powershell -ExecutionPolicy Bypass -File "C:\MangoPOS\MangoPOS_Installer\script_instalador_mangopos.ps1"




Invoke-PS2EXE -InputFile "script_instalador_mangopos.ps1" -OutputFile "MangoPOS-Setup.exe" `     -Title "Instalador MangoPOS" `     -Description "Instalador para sistema MangoPOS" `     -Company "SUN MARKET 2020 C.A." `     -Product "MangoPOS" `     -Copyright "© 2026" `     -Version "1.0.0" `     -RequireAdmin `     -NoConsole `     -IconFile "C:\Proyectos\MangoPOS_Installer\favicon.ico"


powershell: Ejecutar como administrador

powershell -ExecutionPolicy Bypass -File "C:\Proyectos\MangoPOS\MangoPOS_Installer\script_instalador_mangopos.ps1"

powershell -ExecutionPolicy Bypass -File "C:\Proyectos\MangoPOS\MangoPOS_Installer\script_instalador_mangopos.ps1"


