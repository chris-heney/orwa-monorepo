#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { WorkspaceAnalyzer, DocumentationService, DependencyAnalyzer } from './services/index.js';

/**
 * ORWA Monorepo MCP Server
 * 
 * This MCP server provides comprehensive context about the ORWA Nx monorepo
 * to AI agents, enabling them to understand the workspace structure,
 * dependencies, documentation, and build configurations.
 */
class ORWAMCPServer {
  private server: Server;
  private workspaceAnalyzer: WorkspaceAnalyzer;
  private documentationService: DocumentationService;
  private dependencyAnalyzer: DependencyAnalyzer;

  constructor() {
    this.server = new Server(
      {
        name: 'orwa-monorepo-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    // Initialize services
    this.workspaceAnalyzer = new WorkspaceAnalyzer();
    this.documentationService = new DocumentationService();
    this.dependencyAnalyzer = new DependencyAnalyzer();

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'workspace://structure',
            name: 'Workspace Structure',
            description: 'Complete Nx workspace structure and project dependencies',
            mimeType: 'application/json',
          },
          {
            uri: 'docs://architecture',
            name: 'Architecture Documentation',
            description: 'Project architecture and design patterns documentation',
            mimeType: 'text/markdown',
          },
          {
            uri: 'deps://analysis',
            name: 'Dependency Analysis',
            description: 'Complete dependency graph and package analysis',
            mimeType: 'application/json',
          },
        ],
      };
    });

    // Read specific resources
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      switch (true) {
        case uri.startsWith('workspace://'):
          return await this.workspaceAnalyzer.getResource(uri);
        case uri.startsWith('docs://architecture'):
          return await this.documentationService.getArchitectureDoc();
        case uri.startsWith('deps://'):
          return await this.dependencyAnalyzer.getResource(uri);
        default:
          throw new Error(`Unknown resource: ${uri}`);
      }
    });

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_project_structure',
            description: 'Analyze the structure and dependencies of a specific project in the workspace',
            inputSchema: {
              type: 'object',
              properties: {
                projectName: {
                  type: 'string',
                  description: 'Name of the project to analyze',
                },
              },
              required: ['projectName'],
            },
          },
          {
            name: 'search_documentation',
            description: 'Search through all markdown documentation files for specific content',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for documentation content',
                },
                filePattern: {
                  type: 'string',
                  description: 'Optional file pattern to filter results (e.g., "*.md")',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'analyze_dependencies',
            description: 'Analyze dependencies for a specific project or the entire workspace',
            inputSchema: {
              type: 'object',
              properties: {
                scope: {
                  type: 'string',
                  enum: ['workspace', 'project'],
                  description: 'Scope of dependency analysis',
                },
                projectName: {
                  type: 'string',
                  description: 'Project name (required if scope is "project")',
                },
                includeDevDeps: {
                  type: 'boolean',
                  description: 'Include development dependencies in analysis',
                  default: true,
                },
              },
              required: ['scope'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'analyze_project_structure':
          return await this.workspaceAnalyzer.analyzeProject(args.projectName as string);

        case 'search_documentation':
          return await this.documentationService.searchDocumentation(
            args.query as string,
            args.filePattern as string | undefined
          );

        case 'analyze_dependencies':
          return await this.dependencyAnalyzer.analyzeDependencies(
            args.scope as 'workspace' | 'project',
            args.projectName as string | undefined,
            args.includeDevDeps as boolean | undefined
          );

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('ORWA MCP Server running on stdio');
  }
}

// Start the server
const server = new ORWAMCPServer();
server.run().catch(console.error);
