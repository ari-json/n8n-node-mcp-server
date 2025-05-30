# Example Usage with Claude Desktop

This document shows example conversations and use cases for the N8N Node MCP Server with Claude Desktop.

## Basic Usage Examples

### 1. Discovering Available Nodes

**You:** "What N8N nodes are available?"

**Claude:** I'll check what N8N nodes are available in their repository.

*[Claude uses list_all_nodes tool]*

I found over 280 N8N nodes available! Here are some of the most popular ones:

- **ActiveCampaign** - Marketing automation
- **Airtable** - Database/spreadsheet hybrid
- **AWS** - Amazon Web Services integrations
- **Discord** - Chat platform integration
- **GitHub** - Version control integration
- **Google Sheets** - Spreadsheet automation
- **HTTP Request** - Make HTTP/API calls
- **Slack** - Team communication
- **Telegram** - Messaging platform
- **Webhook** - Receive HTTP callbacks

...and many more! Would you like to explore any specific category or integration?

### 2. Searching for Specific Integrations

**You:** "I need to work with email. What email-related nodes does N8N have?"

**Claude:** Let me search for email-related nodes in N8N.

*[Claude uses search_nodes with "mail" keyword]*

I found several email-related nodes:

1. **Gmail** - Send and receive emails via Gmail
2. **Microsoft Outlook** - Integrate with Outlook email
3. **SMTP** - Send emails using any SMTP server
4. **IMAP** - Receive emails from any IMAP server
5. **Mailchimp** - Email marketing automation
6. **SendGrid** - Transactional email service
7. **Mailgun** - Email API service
8. **EmailReadImap** - Trigger workflows on new emails
9. **Mautic** - Open-source marketing automation

Which email service are you planning to integrate with?

### 3. Getting Node Details

**You:** "Tell me more about the Telegram node. What can it do?"

**Claude:** Let me get detailed information about the Telegram node.

*[Claude uses get_node_details for "Telegram"]*

The Telegram node in N8N is quite versatile! Here's what I found:

**Telegram Node Details:**
- **Display Name:** Telegram
- **Type:** Regular node (not a trigger)
- **Requires Credentials:** Yes (Bot API token needed)

**Common Use Cases:**
1. Send messages to Telegram chats/channels
2. Send photos, documents, and media
3. Edit existing messages
4. Manage chat members
5. Create polls
6. Send location data

To use it, you'll need:
1. Create a Telegram Bot via @BotFather
2. Get your Bot API token
3. Configure it in N8N credentials

Would you like to see some example code or learn how to set up a Telegram bot?

### 4. Viewing Node Implementation

**You:** "Show me how the HTTP Request node is implemented"

**Claude:** I'll fetch the implementation code for the HTTP Request node.

*[Claude uses get_node_code_snippet]*

Here's the beginning of the HTTP Request node implementation:

```typescript
import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

export class HttpRequest implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'HTTP Request',
        name: 'httpRequest',
        icon: 'fa:globe',
        group: ['input'],
        version: 1,
        description: 'Makes HTTP requests',
        defaults: {
            name: 'HTTP Request',
        },
```

This node is fundamental in N8N as it allows you to:
- Make API calls to any HTTP endpoint
- Support all HTTP methods (GET, POST, PUT, DELETE, etc.)
- Handle authentication (Basic, OAuth, API Key)
- Process JSON/XML responses
- Handle files and binary data

### 5. Exploring Community Nodes

**You:** "Are there any community-made N8N nodes I should know about?"

**Claude:** Let me check what community nodes are available on npm.

*[Claude uses list_community_nodes]*

Here are some interesting community-contributed N8N nodes:

1. **n8n-nodes-puppeteer** - Web scraping and browser automation
2. **n8n-nodes-redis** - Redis database operations
3. **n8n-nodes-mongodb-advanced** - Enhanced MongoDB operations
4. **n8n-nodes-pdf** - PDF generation and manipulation
5. **n8n-nodes-whatsapp** - WhatsApp Business API integration
6. **n8n-nodes-elasticsearch** - Elasticsearch search engine
7. **n8n-nodes-influxdb** - Time series database operations

Community nodes extend N8N's capabilities beyond the official nodes. To use them:
1. Install via npm in your N8N instance
2. Restart N8N
3. The new nodes appear in your workflow editor

## Advanced Usage Scenarios

### Building a Workflow

**You:** "I want to build a workflow that monitors GitHub issues and sends notifications to Slack. What nodes do I need?"

**Claude:** Great workflow idea! Let me help you identify the nodes you'll need and how to connect them.

*[Claude uses search_nodes for "GitHub" and "Slack"]*

For your GitHub → Slack notification workflow, you'll need these nodes:

**1. GitHub Trigger Node**
- Monitors repository for new issues
- Can filter by labels, assignees, etc.
- Triggers when issues are created/updated

**2. Slack Node**
- Sends messages to channels/users
- Supports formatted messages, attachments
- Can include buttons for interactions

**Basic Workflow Structure:**
```
[GitHub Trigger] → [Slack]
```

**Enhanced Workflow (optional nodes):**
```
[GitHub Trigger] → [IF Node] → [Set Node] → [Slack]
                       ↓
                   [Error Handler]
```

Would you like me to show you how to configure each node or add more functionality like filtering specific issue types?

### Debugging Node Issues

**You:** "The Airtable node isn't working. How can I debug it?"

**Claude:** Let me help you debug the Airtable node issue.

*[Claude uses get_node_details for "Airtable"]*

Here's a debugging checklist for the Airtable node:

**1. Credentials Check:**
- Airtable requires an API key
- Get it from: account.airtable.com/create/tokens
- Ensure the key has proper scopes

**2. Common Issues:**
- **Base ID**: Format should be `appXXXXXXXXXXXXXX`
- **Table Name**: Case-sensitive, must match exactly
- **Field Names**: Also case-sensitive
- **Rate Limits**: 5 requests/second per base

**3. Test Steps:**
1. Use "Get All" operation first (simplest)
2. Check N8N execution logs
3. Test API key directly: `curl https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE?api_key=YOUR_KEY`

**4. Error Messages:**
- "NOT_FOUND" → Wrong base ID or table name
- "AUTHENTICATION_REQUIRED" → API key issue
- "INVALID_REQUEST_BODY" → Field mapping problem

Need help with a specific error message?

## Tips for Effective Usage

1. **Start Simple**: Test nodes individually before building complex workflows
2. **Use Test Data**: Most nodes have a "Test" button to verify configuration
3. **Check Credentials**: Many integration issues are credential-related
4. **Read Node Descriptions**: Hover over parameters for detailed explanations
5. **Community Forum**: The N8N community forum has solutions to common problems

## Common Patterns

### Data Transformation
```
[Source Node] → [Function Node] → [Destination Node]
```

### Error Handling
```
[Main Flow] → [Error Trigger] → [Notification]
```

### Conditional Logic
```
[Trigger] → [IF Node] → [Branch 1]
                ↓
            [Branch 2]
```

### Batch Processing
```
[Get Items] → [Split In Batches] → [Process] → [Aggregate]
```

---

These examples demonstrate how the N8N Node MCP Server enhances Claude's ability to help with N8N workflow automation. The server provides real-time access to node information, making it easier to build, debug, and optimize workflows. 