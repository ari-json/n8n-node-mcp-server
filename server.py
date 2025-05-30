#!/usr/bin/env python3
"""
Simple N8N Node MCP Server
Gets node information directly from N8N's GitHub repository
"""

from mcp.server.fastmcp import FastMCP
import httpx
import json
import asyncio

# Initialize FastMCP
mcp = FastMCP("n8n-nodes")

# GitHub API base URLs
GITHUB_API = "https://api.github.com/repos/n8n-io/n8n/contents"
GITHUB_RAW = "https://raw.githubusercontent.com/n8n-io/n8n/master"

@mcp.tool()
async def list_all_nodes() -> str:
    """List all N8N nodes from their GitHub repository"""
    async with httpx.AsyncClient() as client:
        # Get the nodes directory
        response = await client.get(
            f"{GITHUB_API}/packages/nodes-base/nodes",
            headers={"Accept": "application/vnd.github.v3+json"}
        )
        
        if response.status_code != 200:
            return f"Error fetching nodes: {response.status_code}"
        
        items = response.json()
        
        # Filter for directories (each node is in its own directory)
        node_names = [item['name'] for item in items if item['type'] == 'dir']
        
        return f"""Found {len(node_names)} N8N nodes:

{chr(10).join(node_names[:50])}

... and {len(node_names) - 50} more nodes."""

@mcp.tool()
async def get_node_details(node_name: str) -> str:
    """Get details about a specific N8N node"""
    async with httpx.AsyncClient() as client:
        # Get the node's TypeScript file
        node_url = f"{GITHUB_RAW}/packages/nodes-base/nodes/{node_name}/{node_name}.node.ts"
        
        response = await client.get(node_url)
        
        if response.status_code != 200:
            return f"Node '{node_name}' not found"
        
        content = response.text
        
        # Extract some basic info
        info = {
            "name": node_name,
            "has_credentials": f"{node_name}Api.credentials.ts" in content or "credentials:" in content,
            "is_trigger": "ITriggerNode" in content or "IWebhookNode" in content,
            "file_url": node_url
        }
        
        # Try to find displayName
        for line in content.split('\n'):
            if 'displayName:' in line and "'" in line:
                try:
                    info['display_name'] = line.split("'")[1]
                    break
                except:
                    pass
        
        # Try to find description
        for line in content.split('\n'):
            if 'description:' in line and "'" in line:
                try:
                    info['description'] = line.split("'")[1]
                    break
                except:
                    pass
        
        return json.dumps(info, indent=2)

@mcp.tool()
async def search_nodes(keyword: str) -> str:
    """Search for N8N nodes containing a keyword"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_API}/packages/nodes-base/nodes",
            headers={"Accept": "application/vnd.github.v3+json"}
        )
        
        if response.status_code != 200:
            return f"Error searching nodes: {response.status_code}"
        
        items = response.json()
        node_names = [item['name'] for item in items if item['type'] == 'dir']
        
        # Filter nodes containing the keyword (case-insensitive)
        matches = [name for name in node_names if keyword.lower() in name.lower()]
        
        if not matches:
            return f"No nodes found containing '{keyword}'"
        
        return f"""Found {len(matches)} nodes containing '{keyword}':

{chr(10).join(matches)}"""

@mcp.tool()
async def get_node_code_snippet(node_name: str, lines: int = 50) -> str:
    """Get the first N lines of a node's source code"""
    async with httpx.AsyncClient() as client:
        node_url = f"{GITHUB_RAW}/packages/nodes-base/nodes/{node_name}/{node_name}.node.ts"
        
        response = await client.get(node_url)
        
        if response.status_code != 200:
            return f"Could not fetch code for '{node_name}'"
        
        code_lines = response.text.split('\n')[:lines]
        
        return f"""First {lines} lines of {node_name}.node.ts:

{chr(10).join(code_lines)}"""

@mcp.tool()
async def list_community_nodes() -> str:
    """List community N8N nodes from npm"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://registry.npmjs.org/-/v1/search",
            params={
                "text": "n8n-nodes-",
                "size": 20
            }
        )
        
        data = response.json()
        
        nodes = []
        for obj in data.get('objects', []):
            pkg = obj['package']
            nodes.append(f"- {pkg['name']} (v{pkg.get('version', '?')}): {pkg.get('description', 'No description')}")
        
        return f"""Community N8N Nodes on npm:

{chr(10).join(nodes)}"""

def main():
    """Main entry point for the MCP server"""
    asyncio.run(mcp.run())

# Run the server
if __name__ == "__main__":
    main() 