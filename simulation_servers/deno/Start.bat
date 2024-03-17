@echo off
start cmd /k "cd ../../&npm run graphql_codegen"
timeout /t 3 /nobreak
start cmd /k "deno task start"
timeout /t 10 /nobreak
start cmd /c "start http://localhost:9000/"
start cmd /c "start https://localhost:9200/"