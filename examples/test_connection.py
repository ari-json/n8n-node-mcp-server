#!/usr/bin/env python3
"""
Test script to verify N8N Node MCP Server functionality
"""

import asyncio
import sys
import os

# Add parent directory to path to import server
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import server


async def test_connection():
    """Test basic MCP server functionality."""
    print("🧪 Testing N8N Node MCP Server...\n")
    
    # Test 1: List all nodes
    print("1️⃣  Testing list_all_nodes()...")
    try:
        result = await server.list_all_nodes()
        if "Found" in result and "nodes" in result:
            print("✅ Successfully listed nodes")
            print(f"   {result.split(chr(10))[0]}\n")
        else:
            print("❌ Unexpected response format\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")
    
    # Test 2: Search for specific nodes
    print("2️⃣  Testing search_nodes('HTTP')...")
    try:
        result = await server.search_nodes("HTTP")
        if "Found" in result or "No nodes found" in result:
            print("✅ Search function working")
            lines = result.split('\n')
            print(f"   {lines[0]}")
            if len(lines) > 1 and lines[1]:
                print(f"   First result: {lines[2] if len(lines) > 2 else 'N/A'}\n")
        else:
            print("❌ Unexpected response format\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")
    
    # Test 3: Get node details
    print("3️⃣  Testing get_node_details('HttpRequest')...")
    try:
        result = await server.get_node_details("HttpRequest")
        if "{" in result:  # JSON response
            print("✅ Successfully retrieved node details")
            # Show first few lines of JSON
            lines = result.split('\n')
            for line in lines[:5]:
                print(f"   {line}")
            if len(lines) > 5:
                print("   ...\n")
        else:
            print(f"ℹ️  Node might not exist: {result[:100]}...\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")
    
    # Test 4: Get code snippet
    print("4️⃣  Testing get_node_code_snippet('HttpRequest', 10)...")
    try:
        result = await server.get_node_code_snippet("HttpRequest", 10)
        if "lines of" in result:
            print("✅ Successfully retrieved code snippet")
            lines = result.split('\n')
            print(f"   {lines[0]}\n")
        else:
            print("❌ Unexpected response format\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")
    
    # Test 5: List community nodes
    print("5️⃣  Testing list_community_nodes()...")
    try:
        result = await server.list_community_nodes()
        if "Community N8N Nodes" in result:
            print("✅ Successfully listed community nodes")
            lines = result.split('\n')
            print(f"   Found community nodes from npm")
            # Show first result if available
            for line in lines[2:3]:  # Skip header lines
                if line.strip():
                    print(f"   Example: {line[:80]}...")
            print()
        else:
            print("❌ Unexpected response format\n")
    except Exception as e:
        print(f"❌ Error: {e}\n")
    
    print("✨ Testing complete!")
    print("\nℹ️  Note: Some tests might fail if GitHub API is rate-limited")
    print("   or if specific nodes don't exist in the repository.\n")


if __name__ == "__main__":
    print("N8N Node MCP Server Test Script")
    print("=" * 40 + "\n")
    
    try:
        asyncio.run(test_connection())
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Fatal error: {e}")
        sys.exit(1) 