param()

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$postsDirectory = Join-Path $projectRoot "posts"
$manifestPath = Join-Path $postsDirectory "posts.json"
$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)

$posts = foreach ($file in Get-ChildItem -LiteralPath $postsDirectory -Filter "*.md" -File | Where-Object { -not $_.Name.StartsWith("_") }) {
	$raw = [System.IO.File]::ReadAllText($file.FullName)
	$frontMatter = [regex]::Match($raw, "(?s)^---\r?\n(.*?)\r?\n---(?:\r?\n|$)")

	if (-not $frontMatter.Success) {
		throw "Missing front matter in $($file.Name). Start the file with title, date, excerpt, and tags between --- lines."
	}

	$metadata = @{}
	foreach ($line in ($frontMatter.Groups[1].Value -split "\r?\n")) {
		if ([string]::IsNullOrWhiteSpace($line)) { continue }
		$parts = $line -split ":", 2
		if ($parts.Count -ne 2) {
			throw "Invalid front matter line in $($file.Name): $line"
		}
		$metadata[$parts[0].Trim().ToLowerInvariant()] = $parts[1].Trim()
	}

	foreach ($required in @("title", "date", "excerpt")) {
		if ([string]::IsNullOrWhiteSpace($metadata[$required])) {
			throw "Missing '$required' in $($file.Name)."
		}
	}

	$date = [datetime]::MinValue
	if (-not [datetime]::TryParseExact($metadata["date"], "yyyy-MM-dd", [Globalization.CultureInfo]::InvariantCulture, [Globalization.DateTimeStyles]::None, [ref]$date)) {
		throw "Date in $($file.Name) must use YYYY-MM-DD."
	}

	$tags = @()
	if (-not [string]::IsNullOrWhiteSpace($metadata["tags"])) {
		$tags = @($metadata["tags"].Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ })
	}

	[PSCustomObject][ordered]@{
		slug = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
		title = $metadata["title"]
		date = $date.ToString("yyyy-MM-dd")
		excerpt = $metadata["excerpt"]
		tags = $tags
	}
}

$sortedPosts = @($posts | Sort-Object -Property @{ Expression = { [datetime]$_.date }; Descending = $true })
$json = ConvertTo-Json -InputObject $sortedPosts -Depth 4
[System.IO.File]::WriteAllText($manifestPath, $json + [Environment]::NewLine, $utf8WithoutBom)

Write-Host "Built posts/posts.json with $($sortedPosts.Count) post(s)." -ForegroundColor Green
