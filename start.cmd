@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Нотариальная контора Соповой А.В. — локальный просмотр
if not exist "dist\index.html" (
  echo.
  echo Сборка не найдена. Выполните:
  echo    npm install
  echo    npm run build
  echo.
  pause
  exit /b 1
)
node scripts/serve.mjs --open
pause
