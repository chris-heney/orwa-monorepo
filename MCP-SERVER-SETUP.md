# ORWA MCP Server Setup & Usage Guide

This guide explains how to set up and use the custom MCP (Model Context Protocol) server created for the ORWA Nx monorepo.

## 🎯 Overview

The ORWA MCP Server provides AI agents with comprehensive contextual understanding of your Nx monorepo, including:

- **Workspace Structure**: Complete project dependencies and relationships
- **Documentation**: Search across all markdown files and project docs
- **Dependencies**: Analysis of packages and their relationships
- **Build Configurations**: Understanding of Vite, Docker, and TypeScript configs
- **Design Patterns**: Identification of coding patterns and strategies

## 🚀 Quick Start

### 1. Build the Server

```bash
# Build the MCP server
npx nx build custom-mcp-server
```

### 2. Test the Server

```bash
# Run the test suite to verify functionality
node test-mcp-server.js
```

### 3. Start the Server

```bash
# Development mode
npx nx serve custom-mcp-server

# Production mode
node dist/apps/custom-mcp-server/main.js
```

## 🔧 Configuration

### For Cursor/Claude Desktop

Add this configuration to your MCP settings:

```json
{
  "mcpServers": {
    "orwa-monorepo": {
      "command": "node",
      "args": [
        "/home/chris/Projects/orwa/orwa-monorepo/dist/apps/custom-mcp-server/main.js"
      ],
      "cwd": "/home/chris/Projects/orwa/orwa-monorepo",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### For Other MCP Clients

The server follows the standard MCP protocol and can be used with any compatible client:

```bash
# Direct stdio communication
node dist/apps/custom-mcp-server/main.js

# With custom working directory
cd /path/to/orwa-monorepo && node dist/apps/custom-mcp-server/main.js
```

## 📚 Available Resources

The server exposes these resources that can be read directly:

### `workspace://structure`
Complete Nx workspace structure including:
- All projects and their types (app/lib/e2e)
- Project dependencies and reverse dependencies
- Build targets and configurations
- Project metadata and tags

### `docs://architecture`
The complete ARCHITECTURE.md file content with project patterns and guidelines.

### `deps://analysis`
Comprehensive dependency analysis including:
- All workspace dependencies categorized by type
- Duplicate detection across projects
- Version information and metadata

## 🛠️ Available Tools

### `analyze_project_structure`

Analyzes a specific project in the workspace.

**Usage:**
```json
{
  "name": "analyze_project_structure",
  "arguments": {
    "projectName": "grant-application"
  }
}
```

**Returns:**
- Project type, root, and source directories
- Available build targets
- Internal project dependencies
- File count and technology analysis
- Runtime and development dependencies

### `search_documentation`

Searches through all documentation files.

**Usage:**
```json
{
  "name": "search_documentation",
  "arguments": {
    "query": "docker",
    "filePattern": "*.md"
  }
}
```

**Returns:**
- Matching files with context
- Line numbers and surrounding content
- File metadata (size, last modified)

### `analyze_dependencies`

Analyzes dependencies for workspace or specific projects.

**Usage:**
```json
{
  "name": "analyze_dependencies",
  "arguments": {
    "scope": "workspace",
    "includeDevDeps": true
  }
}
```

**Returns:**
- Categorized dependency lists
- Total counts and statistics
- Duplicate dependency detection
- Project-specific usage patterns

## 🎭 Example AI Agent Interactions

### Understanding Project Structure

**Agent:** "What projects are in this workspace and how are they related?"

**MCP Response:** The server will provide complete workspace structure showing all 10 applications (React frontends + Strapi backend) with their dependencies and build configurations.

### Finding Documentation

**Agent:** "How does authentication work in this project?"

**MCP Response:** Searches all documentation for authentication-related content and provides relevant excerpts with context.

### Dependency Analysis

**Agent:** "What React version are we using and which projects depend on it?"

**MCP Response:** Analyzes all package.json files and provides detailed dependency information with project-specific usage.

## 🔍 Debugging & Troubleshooting

### Server Won't Start

1. **Check Build Status:**
   ```bash
   npx nx build custom-mcp-server
   ```

2. **Verify Dependencies:**
   ```bash
   npm install
   ```

3. **Check Working Directory:**
   The server must be run from the workspace root to access all projects.

### Tools Not Working

1. **Verify Project Names:**
   Project names are case-sensitive. Use exact names like `grant-application`, not `Grant Application`.

2. **Check File Permissions:**
   Ensure the server has read access to all project directories.

3. **Test Individual Tools:**
   Use the test script to verify specific functionality:
   ```bash
   node test-mcp-server.js
   ```

### Performance Issues

1. **Large Workspace:**
   The server caches results where possible, but initial scans may take time.

2. **Memory Usage:**
   Monitor memory usage for large dependency analyses.

## 🔄 Development & Maintenance

### Adding New Tools

1. **Define the Tool:**
   Add tool definition in `main.ts` `ListToolsRequestSchema` handler.

2. **Implement Handler:**
   Add case in `CallToolRequestSchema` handler.

3. **Create Service:**
   Implement business logic in appropriate service class.

4. **Update Tests:**
   Add test cases to `test-mcp-server.js`.

### Adding New Resources

1. **Define Resource:**
   Add resource definition in `ListResourcesRequestSchema` handler.

2. **Implement Reader:**
   Add case in `ReadResourceRequestSchema` handler.

3. **Service Implementation:**
   Create `getResource` method in appropriate service.

### Updating Dependencies

```bash
# Update MCP SDK
npm update @modelcontextprotocol/sdk

# Rebuild server
npx nx build custom-mcp-server

# Test functionality
node test-mcp-server.js
```

## 📊 Monitoring & Analytics

### Performance Metrics

The server logs performance information to stderr:
- Request processing times
- Resource access patterns
- Error rates and types

### Usage Patterns

Monitor which tools and resources are most frequently accessed to optimize caching and performance.

## 🚀 Production Deployment

### Docker Integration

The MCP server can be containerized alongside other applications:

```dockerfile
# Add to existing Dockerfile
COPY apps/custom-mcp-server/dist ./mcp-server
EXPOSE 3333
CMD ["node", "mcp-server/main.js"]
```

### Process Management

For production environments, consider using PM2 or similar:

```bash
pm2 start dist/apps/custom-mcp-server/main.js --name orwa-mcp-server
```

## 🔐 Security Considerations

1. **File Access:** Server only reads files, never writes
2. **Network:** No external network requests by default
3. **Environment:** Runs in the workspace context only
4. **Input Validation:** All tool parameters are validated

## 📈 Future Enhancements

Planned improvements include:
- **Code Pattern Detection:** Enhanced pattern recognition
- **API Route Discovery:** Automatic endpoint detection
- **Build Configuration Analysis:** Deeper config understanding
- **Third-party Documentation:** Integration with package docs
- **Naming Convention Analysis:** Project-specific conventions
- **Performance Monitoring:** Built-in metrics and logging

## 🤝 Contributing

To contribute to the MCP server:

1. Follow the existing service architecture
2. Add comprehensive TypeScript types
3. Include error handling and validation
4. Update tests and documentation
5. Test with multiple workspace scenarios

## 📄 License

MIT License - see the main project LICENSE file for details.

---

**Need Help?** Check the `apps/custom-mcp-server/README.md` for detailed technical documentation.

