# 🔌 N8N Node MCP Server

[![Python Version](https://img.shields.io/badge/python-3.9%2B-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://github.com/modelcontextprotocol)

A Model Context Protocol (MCP) server that provides seamless access to N8N node information directly from N8N's GitHub repository. Query, search, and explore N8N's extensive node ecosystem through Claude Desktop.

## 🤔 What is this?

This project combines two powerful technologies:

- **MCP (Model Context Protocol)**: An open protocol that enables seamless integration between AI assistants and external data sources
- **N8N**: A powerful workflow automation tool with hundreds of integrations

This MCP server allows Claude Desktop to directly access N8N's node repository, making it easy to discover nodes, understand their capabilities, and get implementation details.

## ✨ Features

### Available Tools

1. **`list_all_nodes`** - Get a comprehensive list of all N8N nodes available in the official repository
2. **`get_node_details`** - Retrieve detailed information about a specific node including its configuration and capabilities
3. **`search_nodes`** - Search for nodes by keyword to find relevant integrations quickly
4. **`get_node_code_snippet`** - View the source code of any node to understand its implementation
5. **`list_community_nodes`** - Discover community-contributed N8N nodes available on npm
6. **`check_rate_limit`** - Check your current GitHub API rate limit status

## 📋 Prerequisites

- Python 3.9 or higher
- pip (Python package installer)
- Claude Desktop application
- (Optional) GitHub Personal Access Token for higher rate limits

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/n8n-node-mcp-server.git
cd n8n-node-mcp-server
```

### 2. Create a virtual environment (recommended)

```bash
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Install the package (optional)

```bash
pip install -e .
```

## ⚙️ Configuration

### Basic Configuration

Add the following configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "n8n-nodes": {
      "command": "python",
      "args": ["/absolute/path/to/n8n-node-mcp-server/server.py"],
      "env": {}
    }
  }
}
```

### Enhanced Configuration with GitHub Token (Recommended)

To avoid GitHub API rate limits (60 requests/hour → 5,000 requests/hour):

1. Create a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name like "N8N MCP Server"
   - No special permissions needed (public repo access only)
   - Copy the token

2. Add the token to your Claude Desktop config:

```json
{
  "mcpServers": {
    "n8n-nodes": {
      "command": "python",
      "args": ["/absolute/path/to/n8n-node-mcp-server/server.py"],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**Important**: 
- Replace `/absolute/path/to/n8n-node-mcp-server` with the actual path to your installation
- Replace `ghp_your_token_here` with your actual GitHub token
- Keep your token secure and never commit it to version control

## 💬 Usage Examples

Once configured, you can interact with N8N nodes through Claude Desktop:

### Example Prompts

**Check API rate limit:**
```
"What's my GitHub API rate limit status?"
```

**List all available nodes:**
```
"Show me all the N8N nodes available"
```

**Search for specific integrations:**
```
"Find all N8N nodes related to Google services"
```

**Get node details:**
```
"Tell me about the Telegram node in N8N"
```

**View node implementation:**
```
"Show me the code for the HTTP Request node"
```

**Discover community nodes:**
```
"What community N8N nodes are available?"
```

### Expected Responses

Claude will use the MCP tools to fetch real-time information from N8N's repository and provide detailed responses about nodes, their configurations, and capabilities.

## 🧪 Testing

### Using MCP Inspector

1. Install the MCP inspector:
```bash
npm install -g @modelcontextprotocol/inspector
```

2. Run the inspector:
```bash
# Without GitHub token
mcp-inspector python /path/to/server.py

# With GitHub token
GITHUB_TOKEN=ghp_your_token_here mcp-inspector python /path/to/server.py
```

3. Open http://localhost:5173 in your browser to test the tools interactively

### Running the test script

```bash
# Without token
python examples/test_connection.py

# With token
GITHUB_TOKEN=ghp_your_token_here python examples/test_connection.py
```

## 🔧 Troubleshooting

### Common Issues

**"Server not responding" in Claude Desktop**
- Ensure the path in your config file is absolute and correct
- Check that Python is in your system PATH
- Verify the server runs without errors: `python server.py`

**"Module not found" errors**
- Make sure you've activated your virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

**"Permission denied" errors**
- Ensure the server.py file is executable: `chmod +x server.py`
- Check file permissions in the installation directory

**Rate limiting from GitHub**
- Without a token: 60 requests/hour limit
- With a token: 5,000 requests/hour limit
- Check your rate limit status using the tool
- Add a GitHub token to your configuration (see above)

**"401 Unauthorized" errors**
- Your GitHub token may be invalid or expired
- Generate a new token and update your configuration

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Reporting issues
- Suggesting features
- Submitting pull requests
- Code style guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [N8N](https://n8n.io/) for their amazing workflow automation tool
- [Anthropic](https://www.anthropic.com/) for the MCP specification
- The open-source community for continuous inspiration

---

**Note**: This project is not officially affiliated with N8N or Anthropic. It's a community tool built to enhance the N8N experience within Claude Desktop. 