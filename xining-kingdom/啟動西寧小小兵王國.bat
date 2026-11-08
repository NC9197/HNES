@echo off
chcp 65001 >nul
title 西寧小小兵王國 - 班級經營系統
echo =========================================================
echo 👑 正在啟動 西寧國小五年二班 ‧ 西寧小小兵王國 班級經營系統...
echo =========================================================

where agy-node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    start http://localhost:3000
    agy-node server.js
    goto end
)

where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    start http://localhost:3000
    node server.js
    goto end
)

echo 提示：以預設瀏覽器直接開啟 index.html 運行！
start "" "index.html"

:end
