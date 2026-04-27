@echo off
REM Set Node.js path
set PATH=%PATH%;C:\Program Files\nodejs

REM Navigate to project directory
cd /d "c:\Users\jean-\OneDrive\Documents\Barcoins\DEV\barcoins-client"

REM Start dev server
call npm run dev

pause
