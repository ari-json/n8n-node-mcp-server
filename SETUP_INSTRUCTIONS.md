# GitHub Repository Setup Instructions

This document provides complete instructions for setting up and publishing your N8N Node MCP Server repository on GitHub.

## Prerequisites

- Git installed and configured with your name/email
- GitHub account
- GitHub CLI (`gh`) installed (optional but recommended)

## Step 1: Configure Git (if needed)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 2: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if not already installed
# macOS: brew install gh
# Linux: See https://github.com/cli/cli/blob/trunk/docs/install_linux.md

# Authenticate with GitHub
gh auth login

# Create the repository
gh repo create n8n-node-mcp-server --public --description "MCP server for accessing N8N node information through Claude Desktop" --source=.

# This will automatically set up the remote origin
```

### Option B: Using GitHub Web Interface

1. Go to https://github.com/new
2. Repository name: `n8n-node-mcp-server`
3. Description: `MCP server for accessing N8N node information through Claude Desktop`
4. Choose: Public
5. Do NOT initialize with README, .gitignore, or license
6. Click "Create repository"
7. Run these commands:

```bash
# Add the remote origin (replace ari-json)
git remote add origin https://github.com/ari-json/n8n-node-mcp-server.git

# Push to GitHub
git push -u origin main
```

## Step 3: Update Repository URLs

After creating the repository, update all placeholder URLs:

```bash
# Update URLs in all files (replace ari-json with your actual GitHub username)
find . -type f -name "*.md" -o -name "*.toml" -o -name "*.py" | xargs sed -i '' 's/ari-json/YOUR_ACTUAL_USERNAME/g'

# On Linux, use this instead:
# find . -type f \( -name "*.md" -o -name "*.toml" -o -name "*.py" \) -exec sed -i 's/ari-json/YOUR_ACTUAL_USERNAME/g' {} +

# Commit the changes
git add -A
git commit -m "Update repository URLs with actual GitHub username"
git push
```

## Step 4: Set Repository Topics

### Using GitHub CLI:
```bash
gh repo edit --add-topic "mcp,n8n,claude,automation,workflow,ai-tools,python"
```

### Using Web Interface:
1. Go to your repository on GitHub
2. Click the gear icon next to "About"
3. Add topics: `mcp`, `n8n`, `claude`, `automation`, `workflow`, `ai-tools`, `python`

## Step 5: Configure Repository Settings

### Using GitHub CLI:
```bash
# Enable issues
gh repo edit --enable-issues

# Enable discussions (optional)
gh repo edit --enable-discussions

# Set up branch protection for main branch (optional)
gh api repos/:owner/:repo/branches/main/protection --method PUT --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["test"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF
```

## Step 6: Create Initial Release (Optional)

```bash
# Create a tag
git tag -a v0.1.0 -m "Initial release - Basic MCP server implementation"
git push origin v0.1.0

# Create release using GitHub CLI
gh release create v0.1.0 --title "v0.1.0 - Initial Release" --notes "Initial release of N8N Node MCP Server

## Features
- List all N8N nodes
- Search nodes by keyword
- Get detailed node information
- View node source code
- List community nodes

## Installation
See README.md for installation instructions."
```

## Step 7: Verify Everything

```bash
# Check remote setup
git remote -v

# Check branch
git branch

# View repository in browser
gh repo view --web
```

## Quick Setup Script

Save this as `setup-github.sh` and run it:

```bash
#!/bin/bash

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first."
    exit 1
fi

# Authenticate if needed
if ! gh auth status &> /dev/null; then
    echo "Please authenticate with GitHub:"
    gh auth login
fi

# Get username
read -p "Enter your GitHub username: " GITHUB_USERNAME

# Create repository
echo "Creating GitHub repository..."
gh repo create n8n-node-mcp-server --public \
    --description "MCP server for accessing N8N node information through Claude Desktop" \
    --source=.

# Update URLs
echo "Updating repository URLs..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    find . -type f \( -name "*.md" -o -name "*.toml" -o -name "*.py" \) -exec sed -i '' "s/ari-json/$GITHUB_USERNAME/g" {} +
else
    find . -type f \( -name "*.md" -o -name "*.toml" -o -name "*.py" \) -exec sed -i "s/ari-json/$GITHUB_USERNAME/g" {} +
fi

# Commit and push URL updates
git add -A
git commit -m "Update repository URLs with actual GitHub username"
git push

# Add topics
echo "Adding repository topics..."
gh repo edit --add-topic "mcp,n8n,claude,automation,workflow,ai-tools,python"

# Enable features
echo "Configuring repository settings..."
gh repo edit --enable-issues

echo "✅ Repository setup complete!"
echo "View your repository: https://github.com/$GITHUB_USERNAME/n8n-node-mcp-server"
```

Make it executable and run:
```bash
chmod +x setup-github.sh
./setup-github.sh
```

## Manual Repository URL Updates

If you need to manually update the repository URLs, these files contain them:

- `README.md` - Installation instructions
- `CONTRIBUTING.md` - Contributing guidelines
- `CHANGELOG.md` - Version links
- `setup.py` - Package URL
- `pyproject.toml` - Project URLs

## Next Steps

1. Test the MCP server locally: `make test`
2. Configure Claude Desktop (see README.md)
3. Consider adding:
   - GitHub Sponsors configuration
   - Issue templates
   - Pull request template
   - Security policy
   - Code of Conduct

## Troubleshooting

**"Permission denied" when pushing:**
- Make sure you're authenticated: `gh auth status`
- Check your remote URL: `git remote -v`
- Use SSH instead of HTTPS if needed

**"Repository already exists" error:**
- Choose a different name or delete the existing repository
- Update all references to the new name

**GitHub CLI not working:**
- Install it: https://cli.github.com/
- Authenticate: `gh auth login`
- Choose SSH or HTTPS protocol as preferred

---

 