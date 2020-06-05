set workDir=%~dp0
cd %workDir%
cd ..
CALL npm install
CALL npm install white-react-sdk@2.6.4 --save
CALL npm install -g typescript
EXIT 0