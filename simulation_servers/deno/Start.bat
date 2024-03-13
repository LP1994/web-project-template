@echo off
start cmd /k "deno task start"
timeout /t 10 /nobreak
start cmd /c "start http://localhost:9000/"
start cmd /c "start https://localhost:9200/"