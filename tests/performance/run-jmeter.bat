@echo off
echo Deleting old report and results...
rmdir /s /q report
del /f /q results.jtl

echo Clearing old tokens...
type NUL > tokens.txt

echo Running JMeter test...
docker run --rm -v "%cd%:/tests" -w /tests justb4/jmeter:latest -n -t test.jmx -l results.jtl -e -o report

pause

