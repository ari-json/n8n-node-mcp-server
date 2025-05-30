#!/bin/bash

# N8N Node MCP Server - GitHub Repository Setup Script
# This script automates the creation and configuration of your GitHub repository

set -e  # Exit on error

echo "🚀 N8N Node MCP Server - GitHub Repository Setup"
echo "================================================"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "Please install it first:"
    echo "  macOS: brew install gh"
    echo "  Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    echo "  Windows: https://github.com/cli/cli/releases"
    exit 1
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Authenticate if needed
if ! gh auth status &> /dev/null; then
    echo "📝 Please authenticate with GitHub:"
    gh auth login
fi

# Get username from gh
GITHUB_USERNAME=$(gh api user --jq .login)
echo "👤 GitHub username: $GITHUB_USERNAME"
echo ""

# Confirm repository creation
read -p "Create repository 'n8n-node-mcp-server' under $GITHUB_USERNAME? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Repository creation cancelled."
    exit 1
fi

# Create repository
echo ""
echo "📦 Creating GitHub repository..."
if gh repo create n8n-node-mcp-server --public \
    --description "MCP server for accessing N8N node information through Claude Desktop" \
    --source=. --push; then
    echo "✅ Repository created successfully!"
else
    echo "❌ Failed to create repository. It may already exist."
    read -p "Continue with existing repository? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update URLs
echo ""
echo "🔄 Updating repository URLs..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    find . -type f \( -name "*.md" -o -name "*.toml" -o -name "*.py" \) -exec sed -i '' "s/YOUR_USERNAME/$GITHUB_USERNAME/g" {} +
else
    # Linux
    find . -type f \( -name "*.md" -o -name "*.toml" -o -name "*.py" \) -exec sed -i "s/YOUR_USERNAME/$GITHUB_USERNAME/g" {} +
fi
echo "✅ URLs updated!"

# Commit and push URL updates
if git diff --quiet; then
    echo "ℹ️  No URL changes needed."
else
    echo ""
    echo "📤 Committing and pushing URL updates..."
    git add -A
    git commit -m "Update repository URLs with actual GitHub username"
    git push
    echo "✅ Changes pushed!"
fi

# Add topics
echo ""
echo "🏷️  Adding repository topics..."
gh repo edit $GITHUB_USERNAME/n8n-node-mcp-server --add-topic "mcp" --add-topic "n8n" --add-topic "claude" --add-topic "automation" --add-topic "workflow" --add-topic "ai-tools" --add-topic "python" || true

# Enable features
echo ""
echo "⚙️  Configuring repository settings..."
gh repo edit $GITHUB_USERNAME/n8n-node-mcp-server --enable-issues || true

# Create initial release (optional)
echo ""
read -p "Create initial release v0.1.0? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🏷️  Creating release..."
    git tag -a v0.1.0 -m "Initial release - Basic MCP server implementation" 2>/dev/null || true
    git push origin v0.1.0 2>/dev/null || true
    
    gh release create v0.1.0 --title "v0.1.0 - Initial Release" --notes "Initial release of N8N Node MCP Server

## Features
- List all N8N nodes
- Search nodes by keyword  
- Get detailed node information
- View node source code
- List community nodes

## Installation
See README.md for installation instructions." || echo "ℹ️  Release might already exist."
fi

# Final summary
echo ""
echo "✨ Repository setup complete!"
echo ""
echo "📍 Repository URL: https://github.com/$GITHUB_USERNAME/n8n-node-mcp-server"
echo ""
echo "Next steps:"
echo "1. Test locally: make test"
echo "2. Configure Claude Desktop (see README.md)"
echo "3. Star your repository! ⭐"
echo ""
echo "Happy coding! 🎉" 