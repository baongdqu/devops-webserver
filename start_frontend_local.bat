@echo off
echo ===================================================
echo   KHOI DONG FRONTEND REACT VOI NODE_MODULES O O C:
echo   Thu muc: C:\devops_node_modules\frontend\node_modules
echo ===================================================
set NODE_PATH=C:\devops_node_modules\frontend\node_modules
set PATH=C:\devops_node_modules\frontend\node_modules\.bin;%PATH%
cd /d "%~dp0app\frontend"
npm start
pause
