# ORWA Monorepo MCP Server

A comprehensive Model Context Protocol (MCP) server designed specifically for the ORWA Nx monorepo. This server provides AI agents with deep contextual understanding of the workspace structure, dependencies, documentation, and build configurations.

## Features

### 🏗️ Workspace Analysis
- Complete Nx workspace structure analysis
- Project dependency mapping
- Build target identification
- Technology stack detection

### 📚 Documentation Integration
- Search across all markdown files
- Architecture documentation access
- Project-specific documentation
- Context-aware search results

### 📦 Dependency Management
- Workspace-wide dependency analysis
- Project-specific dependency tracking
- Categorized package organization
- Duplicate detection

### 🔧 Build Configuration
- Vite configuration analysis
- Docker setup detection
- TypeScript configuration mapping
- Package.json analysis

## Available Resources

The server exposes the following resources:

- `workspace://structure` - Complete workspace structure and project dependencies
- `docs://architecture` - Architecture documentation (ARCHITECTURE.md)
- `deps://analysis` - Comprehensive dependency analysis

## Available Tools

### `analyze_project_structure`
Analyzes a specific project's structure, dependencies, and configuration.

**Parameters:**
- `projectName` (string, required): Name of the project to analyze

### `search_documentation`
Searches through all documentation files for specific content.

**Parameters:**
- `query` (string, required): Search query
- `filePattern` (string, optional): File pattern filter (e.g., "*.md")

### `analyze_dependencies`
Analyzes dependencies for the workspace or a specific project.

**Parameters:**
- `scope` (string, required): "workspace" or "project"
- `projectName` (string, optional): Required if scope is "project"
- `includeDevDeps` (boolean, optional): Include development dependencies (default: true)

## Usage

### Building the Server

```bash
# Build the MCP server
nx build custom-mcp-server

# Or build in development mode
nx build custom-mcp-server --configuration=development
```

### Running the Server

```bash
# Run the server directly
nx serve custom-mcp-server

# Or run the built version
node dist/apps/custom-mcp-server/main.js
```

### Configuration

The server can be configured to run with various MCP clients. Here's an example configuration:

```json
{
  "mcpServers": {
    "orwa-monorepo": {
      "command": "node",
      "args": ["dist/apps/custom-mcp-server/main.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

## Development

### Project Structure

```
apps/custom-mcp-server/
├── src/
│   ├── main.ts                 # Main server implementation
│   └── services/
│       ├── index.ts           # Service exports
│       ├── workspace-analyzer.ts
│       ├── documentation-service.ts
│       └── dependency-analyzer.ts
├── project.json               # Nx project configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

### Adding New Features

1. **New Resources**: Add resource definitions in `main.ts` and implement handlers
2. **New Tools**: Define tools in the `ListToolsRequestSchema` handler and implement in `CallToolRequestSchema`
3. **New Services**: Create service classes in the `services/` directory and export from `index.ts`

### Testing

```bash
# Run tests
nx test custom-mcp-server

# Run linting
nx lint custom-mcp-server
```

## Architecture Integration

This MCP server is designed to work seamlessly with the ORWA monorepo's architecture patterns:

- **Monorepo-Aware**: Understands the dual-pattern architecture (React apps vs Strapi)
- **Build-Context Aware**: Recognizes different build contexts and configurations
- **Dependency-Smart**: Handles both workspace-root and project-specific dependencies
- **Documentation-Rich**: Provides access to all project documentation and patterns

## Supported Projects

The server automatically detects and analyzes:

- **React Applications**: grant-application, membership-application, conference-registration, grant-map, grant-scoring, associate-directory, member-manager, scholarship-application
- **Backend Services**: strapi
- **E2E Tests**: grant-application-e2e
- **Build Configurations**: Docker, Vite, TypeScript configs

## Error Handling

The server includes robust error handling for:
- Missing projects or files
- Inaccessible directories
- Malformed configuration files
- Network timeouts (for external documentation)

## Performance

- **Caching**: File system operations are cached where appropriate
- **Lazy Loading**: Large analyses are performed on-demand
- **Streaming**: Large responses are streamed when possible
- **Memory Efficient**: Processes files in chunks to minimize memory usage

## Contributing

When adding new features to the MCP server:

1. Follow the existing service pattern
2. Add comprehensive error handling
3. Include TypeScript types for all interfaces
4. Update this README with new tools/resources
5. Test with multiple projects in the workspace

## Troubleshooting

### Common Issues

**Server won't start:**
- Ensure all dependencies are installed: `npm install`
- Check that the build completed successfully: `nx build custom-mcp-server`

**Resources not found:**
- Verify the workspace root is correctly detected
- Check file permissions for documentation directories

**Tool calls failing:**
- Ensure project names match exactly (case-sensitive)
- Verify the workspace structure hasn't changed

### Debug Mode

Set `NODE_ENV=development` for additional logging and error details.

## License

MIT License - see the main project LICENSE file for details.

