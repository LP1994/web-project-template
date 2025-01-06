@echo on
start cmd /k "cd /d G:\WebStormWS\upload-for-multiple&npm run nodemon:dev&pause"
start cmd /k "cd /d G:\WebStormWS\upload-for-single&npm run nodemon:dev&pause"
start cmd /k "cd /d G:\WebStormWS\web-project-template&npm run nodemon:dev&pause"
