@echo off
@echo -------------------
@echo *  C 执行编译
@echo *  W 启动监控模式
@echo *  R 执行发布
@echo -------------------
@echo.
CHOICE /C CWR /M  请选择：
if %errorlevel%==1 (goto compile)
if %errorlevel%==2 (goto dev)
if %errorlevel%==3 (goto deploy)
:compile
echo compiling ...
gulp compile
set /p rw=press enter to exit...
pause
:dev
echo watching ...
gulp dev
set /p rw=press enter to exit...
pause
:deploy
echo deploying ...
gulp deploy
set /p rw=press enter to exit...
pause