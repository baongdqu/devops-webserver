@echo off
echo ===================================================
echo   KHOI DONG BACKEND API VOI NODE_MODULES O O C:
echo   Thu muc: C:\devops_node_modules\backend\node_modules
echo ===================================================
set NODE_PATH=C:\devops_node_modules\backend\node_modules
cd /d "%~dp0app\backend"
node src/server.js
pause
