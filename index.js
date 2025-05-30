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

// Helper function to determine which package a node is in
function getNodePackage(nodeName) {
  // This will be determined dynamically, but we can add known patterns
  return 'nodes-base'; // Default to nodes-base
}

// Create server instance
const server = new Server({
  name: 'n8n-nodes',
  version: '0.2.1',
  description: 'MCP server for accessing N8N node information'
}, {
  capabilities: {
    tools: {}
  }
});

// Tool definitions
const tools = {
  list_all_nodes: {
    description: "List all N8N nodes from both core and AI packages",
    inputSchema: {
      type: "object",
      properties: {}
    }
  },
  list_ai_nodes: {
    description: "List all AI/LangChain N8N nodes",
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
    description: "Search for N8N nodes containing a keyword in both core and AI packages",
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
        // Get nodes from nodes-base
        const response1 = await axios.get(
          `${GITHUB_API}/packages/nodes-base/nodes`,
          { headers: getHeaders() }
        );
        
        // Get nodes from langchain package
        let langchainNodes = [];
        try {
          const response2 = await axios.get(
            `${GITHUB_API}/packages/@n8n/nodes-langchain/nodes`,
            { headers: getHeaders() }
          );
          langchainNodes = response2.data
            .filter(item => item.type === 'dir')
            .map(item => ({ name: item.name, package: 'langchain' }));
        } catch (error) {
          // LangChain package might not exist in all versions
        }
        
        const coreNodes = response1.data
          .filter(item => item.type === 'dir')
          .map(item => ({ name: item.name, package: 'core' }));
        
        const allNodes = [...coreNodes, ...langchainNodes];
        
        return {
          content: [{
            type: "text",
            text: `Found ${allNodes.length} N8N nodes:\n\nCore Nodes (${coreNodes.length}):\n${coreNodes.slice(0, 30).map(n => n.name).join('\n')}\n\nAI/LangChain Nodes (${langchainNodes.length}):\n${langchainNodes.map(n => n.name).join('\n')}\n\n... and ${Math.max(0, coreNodes.length - 30)} more core nodes.`
          }]
        };
      }

      case 'list_ai_nodes': {
        const aiCategories = ['agents', 'chains', 'llms', 'vector_stores', 'embeddings', 'memory', 'output_parsers', 'tools'];
        let allAiNodes = [];
        
        for (const category of aiCategories) {
          try {
            const response = await axios.get(
              `${GITHUB_API}/packages/@n8n/nodes-langchain/nodes/${category}`,
              { headers: getHeaders() }
            );
            
            const categoryNodes = response.data
              .filter(item => item.type === 'dir')
              .map(item => ({ name: item.name, category }));
            
            allAiNodes = [...allAiNodes, ...categoryNodes];
          } catch (error) {
            // Category might not exist
          }
        }
        
        const groupedNodes = aiCategories.reduce((acc, cat) => {
          acc[cat] = allAiNodes.filter(n => n.category === cat).map(n => n.name);
          return acc;
        }, {});
        
        let output = `Found ${allAiNodes.length} AI/LangChain nodes:\n\n`;
        for (const [category, nodes] of Object.entries(groupedNodes)) {
          if (nodes.length > 0) {
            output += `${category.toUpperCase()} (${nodes.length}):\n${nodes.map(n => `- ${n}`).join('\n')}\n\n`;
          }
        }
        
        return {
          content: [{
            type: "text",
            text: output
          }]
        };
      }

      case 'get_node_details': {
        const { node_name } = args;
        
        // Try core nodes first
        let nodeUrl = `${GITHUB_RAW}/packages/nodes-base/nodes/${node_name}/${node_name}.node.ts`;
        let packageName = 'core';
        
        try {
          const response = await axios.get(nodeUrl, { headers: GITHUB_TOKEN ? getHeaders() : {} });
          const content = response.data;
          
          const info = {
            name: node_name,
            package: packageName,
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
          // Try AI nodes
          const aiCategories = ['agents', 'chains', 'llms', 'vector_stores', 'embeddings', 'memory', 'output_parsers', 'tools'];
          
          for (const category of aiCategories) {
            try {
              nodeUrl = `${GITHUB_RAW}/packages/@n8n/nodes-langchain/nodes/${category}/${node_name}/${node_name}.node.ts`;
              const response = await axios.get(nodeUrl, { headers: GITHUB_TOKEN ? getHeaders() : {} });
              const content = response.data;
              
              const info = {
                name: node_name,
                package: 'langchain',
                category: category,
                has_credentials: content.includes('credentials:'),
                is_ai_node: true,
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
            } catch (e) {
              // Continue to next category
            }
          }
          
          return {
            content: [{
              type: "text",
              text: `Node '${node_name}' not found in core or AI packages`
            }]
          };
        }
      }

      case 'search_nodes': {
        const { keyword } = args;
        
        // Search core nodes
        const response1 = await axios.get(
          `${GITHUB_API}/packages/nodes-base/nodes`,
          { headers: getHeaders() }
        );
        
        const coreNodes = response1.data
          .filter(item => item.type === 'dir')
          .map(item => item.name);
        
        // Search AI nodes
        let aiNodes = [];
        try {
          const response2 = await axios.get(
            `${GITHUB_API}/packages/@n8n/nodes-langchain/nodes`,
            { headers: getHeaders() }
          );
          
          // Get all subdirectories
          const aiCategories = response2.data.filter(item => item.type === 'dir').map(item => item.name);
          
          for (const category of aiCategories) {
            try {
              const catResponse = await axios.get(
                `${GITHUB_API}/packages/@n8n/nodes-langchain/nodes/${category}`,
                { headers: getHeaders() }
              );
              
              const catNodes = catResponse.data
                .filter(item => item.type === 'dir')
                .map(item => `${item.name} (AI/${category})`);
              
              aiNodes = [...aiNodes, ...catNodes];
            } catch (e) {
              // Continue
            }
          }
        } catch (error) {
          // AI package might not exist
        }
        
        const allNodes = [...coreNodes, ...aiNodes];
        const matches = allNodes.filter(name => 
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
        
        // Try core nodes first
        let nodeUrl = `${GITHUB_RAW}/packages/nodes-base/nodes/${node_name}/${node_name}.node.ts`;
        
        try {
          const response = await axios.get(nodeUrl, { headers: GITHUB_TOKEN ? getHeaders() : {} });
          const codeLines = response.data.split('\n').slice(0, lines);
          
          return {
            content: [{
              type: "text",
              text: `First ${lines} lines of ${node_name}.node.ts (core package):\n\n${codeLines.join('\n')}`
            }]
          };
        } catch (error) {
          // Try AI nodes
          const aiCategories = ['agents', 'chains', 'llms', 'vector_stores', 'embeddings', 'memory', 'output_parsers', 'tools'];
          
          for (const category of aiCategories) {
            try {
              nodeUrl = `${GITHUB_RAW}/packages/@n8n/nodes-langchain/nodes/${category}/${node_name}/${node_name}.node.ts`;
              const response = await axios.get(nodeUrl, { headers: GITHUB_TOKEN ? getHeaders() : {} });
              const codeLines = response.data.split('\n').slice(0, lines);
              
              return {
                content: [{
                  type: "text",
                  text: `First ${lines} lines of ${node_name}.node.ts (AI/${category}):\n\n${codeLines.join('\n')}`
                }]
              };
            } catch (e) {
              // Continue to next category
            }
          }
          
          return {
            content: [{
              type: "text",
              text: `Could not fetch code for '${node_name}' in core or AI packages`
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