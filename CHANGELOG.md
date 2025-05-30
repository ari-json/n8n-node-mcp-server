# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

## [0.1.1] - 2024-01-XX

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

## [0.1.0] - 2024-01-XX

### Added
- First public release
- Basic MCP server implementation using FastMCP
- Integration with N8N's GitHub repository
- Support for Claude Desktop configuration
- MIT License

[Unreleased]: https://github.com/ari-json/n8n-node-mcp-server/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/ari-json/n8n-node-mcp-server/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/ari-json/n8n-node-mcp-server/releases/tag/v0.1.0 