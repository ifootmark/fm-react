@echo off
@echo -------------------
@echo *  C ִ�б���
@echo *  W �������ģʽ
@echo *  R ִ�з���
@echo -------------------
@echo.
CHOICE /C CWR /M  ��ѡ��
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