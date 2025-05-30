# PowerShell script to run all endpoint tests

Write-Host "๐Ÿงช Running comprehensive API endpoint tests..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Using Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Node.js is not installed or not found in PATH. Please install Node.js to run these tests." -ForegroundColor Red
    exit 1
}

# Check if the required npm packages are installed
Write-Host "Checking required npm packages..." -ForegroundColor Cyan
npm list axios --depth=0
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing required package: axios" -ForegroundColor Yellow
    npm install axios
}

# Run the tests
Write-Host "`n๐Ÿ"ฅ Starting API endpoint tests..." -ForegroundColor Cyan
node ./comprehensive-endpoint-tests.js

# Check if tests were successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n๐ŸŽ‰ Tests complete! See endpoint-test-results.log for detailed results." -ForegroundColor Green
}
else {
    Write-Host "`n๐Ÿšจ Tests encountered errors. Check the output and logs for details." -ForegroundColor Red
}

# Open the log file if it exists
if (Test-Path ./endpoint-test-results.log) {
    Write-Host "`nOpening test results log file..." -ForegroundColor Cyan
    Get-Content ./endpoint-test-results.log | Select-Object -First 20
    Write-Host "... (showing first 20 lines, see full file for complete results)" -ForegroundColor Yellow
}
