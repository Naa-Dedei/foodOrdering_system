param(
  [Parameter(Mandatory = $true)]
  [string]$DatabaseUrl
)

# Sets DATABASE_URL persistently for the current Windows user.
# After running, restart your terminal (or sign out/in) so new processes see it.

Write-Host "Setting user environment variable DATABASE_URL..."
setx DATABASE_URL "$DatabaseUrl" | Out-Null

Write-Host "Done."
Write-Host "Close and reopen your terminal, then run: npm start"


