@echo off

set BackupFolder=..\Backup
set CurrentFolder=AntennaManagement
set NewFolder=..\New
set InitScript=\Init.bat
set AttachmentFolder=\Attachment

REM call %~dp0..\bin\tomcat7.exe stop
call %~dp0..\bin\shutdown.bat
ping /n 30 127.1>nul



REM call %~dp0..\bin\service.bat remove
REM taskkill /F /IM javaw.exe

if exist %~dp0%BackupFolder% (rmdir /S /Q %~dp0%BackupFolder% 2> nul)
if exist %~dp0%CurrentFolder% (move %~dp0%CurrentFolder% %~dp0%BackupFolder% 2> nul)
if exist %~dp0%NewFolder% (move %~dp0%NewFolder% %~dp0%CurrentFolder% 2> nul)
if exist %~dp0%BackupFolder%%AttachmentFolder% (move %~dp0%BackupFolder%%AttachmentFolder% %~dp0%CurrentFolder%%AttachmentFolder% 2> nul)
if exist %~dp0%CurrentFolder%%InitScript% (call %~dp0%CurrentFolder%%InitScript% 2> nul)

REM call %~dp0..\bin\service.bat install
REM call %~dp0..\bin\tomcat7.exe start
call %~dp0..\bin\startup.bat 

@echo on