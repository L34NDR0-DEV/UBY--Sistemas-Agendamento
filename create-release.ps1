# Script para criar release no GitHub
$owner = "L34NDR0-DEV"
$repo = "UBY--Sistemas-Agendamento"
$tag = "v1.0.3"
$name = "UBY Agendamentos v1.0.3"
$body = "UBY Agendamentos v1.0.3 - Versao atualizada com melhorias na interface e sistema de atualizacoes."

# Verificar se os arquivos existem
$setupFile = "dist\UBY Agendamentos Setup 1.0.3.exe"
$portableFile = "dist\UBY Agendamentos 1.0.3.exe"
$latestFile = "dist\latest.yml"

Write-Host "Verificando arquivos..."

if (!(Test-Path $setupFile)) {
    Write-Host "ERRO: Arquivo nao encontrado: $setupFile"
    exit 1
}

if (!(Test-Path $portableFile)) {
    Write-Host "ERRO: Arquivo nao encontrado: $portableFile"
    exit 1
}

if (!(Test-Path $latestFile)) {
    Write-Host "ERRO: Arquivo nao encontrado: $latestFile"
    exit 1
}

Write-Host "Todos os arquivos encontrados!"
Write-Host "Para completar o processo:"
Write-Host "1. Acesse: https://github.com/$owner/$repo/releases/new"
Write-Host "2. Use a tag: $tag"
Write-Host "3. Titulo: $name"
Write-Host "4. Faca upload dos arquivos:"
Write-Host "   - $setupFile"
Write-Host "   - $portableFile"
Write-Host "   - $latestFile"
Write-Host "5. Publique a release"

Write-Host "Abrindo GitHub no navegador..."
Start-Process "https://github.com/$owner/$repo/releases/new?tag=$tag"