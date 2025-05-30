# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2024-01-XX

### Added
- Support for AI/LangChain nodes from `packages/@n8n/nodes-langchain/`
- New `list_ai_nodes` tool to list all AI-specific nodes by category
- Enhanced search to include both core and AI packages
- Node details now show package location (core vs langchain)

### Changed
- `list_all_nodes` now returns nodes from both core and AI packages
- `search_nodes` searches across both packages
- `get_node_details` checks both packages and shows category for AI nodes
- `get_node_code_snippet` supports AI nodes in their category subdirectories

## [0.2.0] - 2024-01-XX

### Changed
- **BREAKING**: Complete rewrite from Python to JavaScript/Node.js
- Now installable via npm/npx for consistency with other MCP servers
- Uses @modelcontextprotocol/sdk for MCP implementation
- Simplified installation process - just use npx

### Added
- npm package publishing support
- Direct npx execution without installation
- Native JavaScript implementation for better performance

### Removed
- Python dependencies and structure
- pip/uvx installation methods
- Python-specific configuration

## [0.1.1] - 2024-01-XX

### Added
- GitHub Personal Access Token support for increased API rate limits (60 → 5,000 requests/hour)
- `check_rate_limit` tool to monitor GitHub API usage and limits
- Environment variable support via GITHUB_TOKEN
- .env.example file showing configuration options
- Enhanced test script with rate limit checking

### Changed
- All GitHub API requests now use authentication headers when token is available
- Updated documentation with token configuration instructions
- Test script now shows token status and rate limit information

## [0.1.0] - 2024-01-XX

### Added
- Initial release of N8N Node MCP Server
- `list_all_nodes` tool to list all available N8N nodes
- `get_node_details` tool to get detailed information about specific nodes
- `search_nodes` tool to search for nodes by keyword
- `get_node_code_snippet` tool to view node source code
- `list_community_nodes` tool to discover community nodes on npm
- Comprehensive documentation and examples
- GitHub Actions CI/CD pipeline
- Test suite for basic functionality

### Security
- No credentials or sensitive data stored
- All data fetched directly from public GitHub and npm APIs

[0.2.1]: https://github.com/ari-json/n8n-node-mcp-server/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/ari-json/n8n-node-mcp-server/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/ari-json/n8n-node-mcp-server/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/ari-json/n8n-node-mcp-server/releases/tag/v0.1.0 