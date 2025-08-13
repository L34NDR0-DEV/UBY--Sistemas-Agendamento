# Script para verificar arquivos e abrir pagina de release

$setupFile = "dist\UBY Agendamentos Setup 1.0.3.exe"
$portableFile = "dist\UBY Agendamentos 1.0.3.exe"
$latestFile = "dist\latest.yml"

Write-Host "Verificando arquivos..."

if (Test-Path $setupFile) {
    Write-Host "Setup encontrado: $setupFile"
} else {
    Write-Host "Setup nao encontrado: $setupFile"
    exit 1
}

if (Test-Path $portableFile) {
    Write-Host "Portable encontrado: $portableFile"
} else {
    Write-Host "Portable nao encontrado: $portableFile"
    exit 1
}

if (Test-Path $latestFile) {
    Write-Host "latest.yml encontrado: $latestFile"
} else {
    Write-Host "latest.yml nao encontrado: $latestFile"
    exit 1
}

Write-Host ""
Write-Host "Todos os arquivos necessarios foram encontrados!"
Write-Host ""
Write-Host "Para criar a release no GitHub:"
Write-Host "1. Tag: v1.0.3"
Write-Host "2. Titulo: UBY Agendamentos v1.0.3"
Write-Host "3. Faca upload dos arquivos da pasta dist"
Write-Host ""
Write-Host "Abrindo pagina de criacao de release..."

$url = "https://github.com/L34NDR0-DEV/UBY--Sistemas-Agendamento/releases/new"
Start-Process $url