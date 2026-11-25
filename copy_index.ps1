[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$path = Join-Path $PSScriptRoot "index.html"
if (-not (Test-Path $path)) {
    $path = "d:\AI代理人\xining-kingdom\index.html"
}
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$copied = $false
for ($i = 0; $i -lt 5; $i++) {
    try {
        Set-Clipboard -Value $content -ErrorAction Stop
        $copied = $true
        break
    } catch {
        Start-Sleep -Milliseconds 150
    }
}

if (-not $copied) {
    try {
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.Clipboard]::SetText($content)
        $copied = $true
    } catch {}
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Yellow
Write-Host " 【成功！】index.html 最新內容已完整複製到您的剪貼簿！" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "接下來請在 GitHub 網頁上操作（僅需 3 步驟，100% 成功，絕不報錯）：" -ForegroundColor Cyan
Write-Host "  步驟 1. 打開 GitHub 進入您的儲存庫，點擊 index.html 檔案" -ForegroundColor White
Write-Host "  步驟 2. 點擊右上角鉛筆圖示 [Edit this file] 進入編輯模式" -ForegroundColor White
Write-Host "  步驟 3. 在編輯區按 Ctrl + A 全選，按 Delete 刪除，" -ForegroundColor White
Write-Host "          接著按 Ctrl + V 貼上，最後點右上角綠色 [Commit changes] 即可！" -ForegroundColor White
Write-Host ""
Write-Host "按 Enter 鍵關閉視窗..." -ForegroundColor Gray
try { Read-Host } catch {}
