#!/usr/bin/env node
/**
 * Simple test script for N8N Node MCP Server
 * Run with: node examples/test.js
 */

import { spawn } from 'child_process';

console.log('🧪 Testing N8N Node MCP Server...\n');

// Start the server
const server = spawn('node', ['index.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env, GITHUB_TOKEN: process.env.GITHUB_TOKEN || '' }
});

// Handle server output
server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

server.stderr.on('data', (data) => {
  console.log(`Server log: ${data}`);
});

// Send a test request to list tools
setTimeout(() => {
  const listToolsRequest = {
    jsonrpc: '2.0',
    method: 'tools/list',
    id: 1
  };
  
  console.log('📤 Sending tools/list request...');
  server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}, 1000);

// Send a test tool call
setTimeout(() => {
  const toolCallRequest = {
    jsonrpc: '2.0',
    method: 'tools/call',
    params: {
      name: 'check_rate_limit',
      arguments: {}
    },
    id: 2
  };
  
  console.log('📤 Sending check_rate_limit request...');
  server.stdin.write(JSON.stringify(toolCallRequest) + '\n');
}, 2000);

// Clean up after 5 seconds
setTimeout(() => {
  console.log('\n✅ Test completed!');
  server.kill();
  process.exit(0);
}, 5000);

// Handle errors
server.on('error', (error) => {
  console.error('❌ Error:', error);
  process.exit(1);
}); 