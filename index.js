#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

// GitHub API configuration
const GITHUB_API = "https://api.github.com/repos/n8n-io/n8n/contents";
const GITHUB_RAW = "https://raw.githubusercontent.com/n8n-io/n8n/master";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// Helper function to get headers
function getHeaders() {
  const headers = { 'Accept': 'application/vnd.github.v3+json' };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

// Create server instance
const server = new Server({
  name: 'n8n-nodes',
  version: '0.1.1',
  description: 'MCP server for accessing N8N node information'
}, {
  capabilities: {
    tools: {}
  }
});

// Tool definitions
const tools = {
  list_all_nodes: {
    description: "List all N8N nodes from their GitHub repository",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  get_node_details: {
    description: "Get details about a specific N8N node",
    inputSchema: {
      type: "object",
      properties: {
        node_name: { type: "string", description: "Name of the N8N node" }
      },
      required: ["node_name"]
    }
  },
  search_nodes: {
    description: "Search for N8N nodes containing a keyword",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "Keyword to search for" }
      },
      required: ["keyword"]
    }
  },
  get_node_code_snippet: {
    description: "Get the first N lines of a node's source code",
    inputSchema: {
      type: "object",
      properties: {
        node_name: { type: "string", description: "Name of the N8N node" },
        lines: { type: "number", description: "Number of lines to retrieve", default: 50 }
      },
      required: ["node_name"]
    }
  },
  list_community_nodes: {
    description: "List community N8N nodes from npm",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  check_rate_limit: {
    description: "Check GitHub API rate limit status",
    inputSchema: {
      type: "object",
      properties: {}
    }
  }
};

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: Object.entries(tools).map(([name, config]) => ({ name, ...config })) };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_all_nodes': {
        const response = await axios.get(
          `${GITHUB_API}/packages/nodes-base/nodes`,
          { headers: getHeaders() }
        );
        
        const nodeNames = response.data
          .filter(item => item.type === 'dir')
          .map(item => item.name);
        
        return {
          content: [{
            type: "text",
            text: `Found ${nodeNames.length} N8N nodes:\n\n${nodeNames.slice(0, 50).join('\n')}\n\n... and ${nodeNames.length - 50} more nodes.`
          }]
        };
      }

      case 'get_node_details': {
        const { node_name } = args;
        const nodeUrl = `${GITHUB_RAW}/packages/nodes-base/nodes/${node_name}/${node_name}.node.ts`;
        
        try {
          const response = await axios.get(nodeUrl, { headers: GITHUB_TOKEN ? getHeaders() : {} });
          const content = response.data;
          
          const info = {
            name: node_name,
            has_credentials: content.includes(`${node_name}Api.credentials.ts`) || content.includes('credentials:'),
            is_trigger: content.includes('ITriggerNode') || content.includes('IWebhookNode'),
            file_url: nodeUrl
          };
          
          // Extract displayName
          const displayNameMatch = content.match(/displayName:\s*['"]([^'"]+)['"]/);
          if (displayNameMatch) info.display_name = displayNameMatch[1];
          
          // Extract description
          const descriptionMatch = content.match(/description:\s*['"]([^'"]+)['"]/);
          if (descriptionMatch) info.description = descriptionMatch[1];
          
          return {
            content: [{
              type: "text",
              text: JSON.stringify(info, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Node '${node_name}' not found`
            }]
          };
        }
      }

      case 'search_nodes': {
        const { keyword } = args;
        const response = await axios.get(
          `${GITHUB_API}/packages/nodes-base/nodes`,
          { headers: getHeaders() }
        );
        
        const nodeNames = response.data
          .filter(item => item.type === 'dir')
          .map(item => item.name);
        
        const matches = nodeNames.filter(name => 
          name.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (matches.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No nodes found containing '${keyword}'`
            }]
          };
        }
        
        return {
          content: [{
            type: "text",
              text: `Found ${matches.length} nodes containing '${keyword}':\n\n${matches.join('\n')}`
          }]
        };
      }

      case 'get_node_code_snippet': {
        const { node_name, lines = 50 } = args;
        const nodeUrl = `${GITHUB_RAW}/packages/nodes-base/nodes/${node_name}/${node_name}.node.ts`;
        
        try {
          const response = await axios.get(nodeUrl, { headers: GITHUB_TOKEN ? getHeaders() : {} });
          const codeLines = response.data.split('\n').slice(0, lines);
          
          return {
            content: [{
              type: "text",
              text: `First ${lines} lines of ${node_name}.node.ts:\n\n${codeLines.join('\n')}`
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Could not fetch code for '${node_name}'`
            }]
          };
        }
      }

      case 'list_community_nodes': {
        const response = await axios.get(
          'https://registry.npmjs.org/-/v1/search',
          { params: { text: 'n8n-nodes-', size: 20 } }
        );
        
        const nodes = response.data.objects.map(obj => {
          const pkg = obj.package;
          return `- ${pkg.name} (v${pkg.version || '?'}): ${pkg.description || 'No description'}`;
        });
        
        return {
          content: [{
            type: "text",
            text: `Community N8N Nodes on npm:\n\n${nodes.join('\n')}`
          }]
        };
      }

      case 'check_rate_limit': {
        const response = await axios.get(
          'https://api.github.com/rate_limit',
          { headers: getHeaders() }
        );
        
        const core = response.data.rate || {};
        
        return {
          content: [{
            type: "text",
            text: `GitHub API Rate Limit Status:\n- Limit: ${core.limit || 'N/A'} requests/hour\n- Remaining: ${core.remaining || 'N/A'} requests\n- Resets at: ${core.reset || 'N/A'} (Unix timestamp)\n- Using token: ${GITHUB_TOKEN ? 'Yes' : 'No (60 req/hour limit)'}`
          }]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: `Error: ${error.message}`
      }],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('N8N Node MCP Server running on stdio');
}

main().catch(console.error); 