set workDir=%~dp0
cd %workDir%
cd ..

cd node_modules/thunder-node-sdk
CALL node-gyp configure --target=6.0.9 --msvs_version=2015 --arch=ia32 --dist-url=https://electronjs.org/headers
CALL node-gyp build
if ERRORLEVEL 1 (
   exit /b 22
)

cd ../../

echo dist-calling...
CALL npm run dist
if ERRORLEVEL 1 (
   echo dist-failed!
   exit /b 22
)

echo dist-successed.

rd /s /q bin\release\win-ia32-unpacked
del bin\release\*.blockmap
del bin\release\*.yaml

exit /b ERRORLEVEL
