param(
	[string]$Title,
	[string]$Excerpt,
	[string]$Tags,
	[datetime]$Date = (Get-Date)
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Title)) {
	$Title = Read-Host "Post title"
}
if ([string]::IsNullOrWhiteSpace($Excerpt)) {
	$Excerpt = Read-Host "Short excerpt"
}
if ([string]::IsNullOrWhiteSpace($Tags)) {
	$Tags = Read-Host "Tags, separated by commas (optional)"
}

if ([string]::IsNullOrWhiteSpace($Title)) { throw "A title is required." }
if ([string]::IsNullOrWhiteSpace($Excerpt)) { throw "An excerpt is required." }

$slug = $Title.ToLowerInvariant()
$slug = $slug -replace "[^a-z0-9]+", "-"
$slug = $slug.Trim("-")
if ([string]::IsNullOrWhiteSpace($slug)) { throw "The title could not be converted into a filename." }

$projectRoot = Split-Path -Parent $PSScriptRoot
$postPath = Join-Path (Join-Path $projectRoot "posts") ($slug + ".md")
if (Test-Path -LiteralPath $postPath) { throw "A post already exists at $postPath" }

$frontMatter = @"
---
title: $Title
date: $($Date.ToString("yyyy-MM-dd"))
excerpt: $Excerpt
tags: $Tags
---

Start writing here.
"@

$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($postPath, $frontMatter, $utf8WithoutBom)

& (Join-Path $PSScriptRoot "build-posts.ps1")

Write-Host ""
Write-Host "Created posts/$slug.md" -ForegroundColor Green
Write-Host "Replace 'Start writing here.' with your post. The blog index is already updated."
