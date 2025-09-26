I need an MCP server for this project for use with an AI Agent/Copilot.  The MCP server should allow the AI Agent to be up-to-date with documentation of all packages used in this project.

This is an NX Monorepo.  All background research, strategies and generation (tasks, code, or otherwise) should consider:
- the environment
- dependencies (dependency graph)
- configurations files
  - tsconfig.json file(s)
  - package.json file(s)
  - vite.config.ts file(s)
  - Dockerfile file(s)
  - docker-compose.yml file(s)
- mardown files
- 3rd party software documentation
- NX Documentation
- NX as a Tool
- API Routes
- Current Design Patterns and Strategies
  - Factory Patters
  - Adapter Patters
  - ETC
- File System Organization
- Naming Conventions
  - Files
  - Functions
  - Variables
  - Data

## Implementation Status: ✅ COMPLETED

The Custom MCP Server has been successfully implemented and tested. See the following files for details:

- **Implementation**: `apps/custom-mcp-server/` - Complete MCP server implementation
- **Setup Guide**: `MCP-SERVER-SETUP.md` - Configuration and usage instructions  
- **Test Results**: All tests passing - server provides full workspace context to AI agents
- **Configuration**: `mcp-server-config.json` - Ready-to-use MCP client configuration

### Key Features Implemented:
✅ **Workspace Analysis**: Complete Nx workspace structure and project dependencies  
✅ **Documentation Integration**: Search across all markdown files and architecture docs  
✅ **Dependency Management**: Comprehensive package analysis and categorization  
✅ **Build Configuration Access**: Vite, Docker, TypeScript, and package.json analysis  
✅ **File System Organization**: Intelligent workspace navigation and exploration  
✅ **API Route Discovery**: Detection of endpoints across all applications  
✅ **Design Pattern Recognition**: Factory, Adapter, and other pattern identification  
✅ **Naming Convention Analysis**: Project-specific naming standards  
✅ **Third-party Documentation**: Integration with dependency documentation  

### Usage:
```bash
# Build and test the server
npx nx build custom-mcp-server
node test-mcp-server.js

# Start the server for AI agent integration
npx nx serve custom-mcp-server
```

The MCP server is now ready for integration with AI agents and provides comprehensive context about the entire ORWA monorepo ecosystem.
