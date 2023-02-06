@echo off
cd client
start cmd.exe /k "ng serve"
cd ../API
dotnet watch --no-hot-reload
