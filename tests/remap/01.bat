@echo off

set clean_dir="%~dpn0a-before"
set clone_dir="%~dpn0b-after"

if exist %clone_dir% rmdir /Q /S %clone_dir%

xcopy %clean_dir% %clone_dir% /S /E /I

set bin_rauf="%~dp0..\..\bin\rauf.js"
set apk_data=%clone_dir%
set log_file="%~dpn0.log"

node %bin_rauf% %apk_data% >%log_file% 2>&1
