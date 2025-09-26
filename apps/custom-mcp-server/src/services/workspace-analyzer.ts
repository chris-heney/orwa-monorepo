import { promises as fs } from 'fs';
import * as path from 'path';

export interface ProjectInfo {
  name: string;
  type: 'app' | 'lib' | 'e2e';
  root: string;
  sourceRoot?: string;
  targets: string[];
  dependencies: string[];
  tags: string[];
  projectJson?: any;
  packageJson?: any;
}

export interface WorkspaceStructure {
  workspaceRoot: string;
  nxConfig: any;
  projects: ProjectInfo[];
  dependencies: {
    [projectName: string]: string[];
  };
  reverseDependencies: {
    [projectName: string]: string[];
  };
}

export class WorkspaceAnalyzer {
  private workspaceRoot: string;

  constructor() {
    this.workspaceRoot = process.cwd();
  }

  async getWorkspaceStructure(): Promise<WorkspaceStructure> {
    const nxConfig = await this.loadNxConfig();
    const projects = await this.loadAllProjects();
    const dependencies = this.buildDependencyGraph(projects);
    const reverseDependencies = this.buildReverseDependencyGraph(dependencies);

    return {
      workspaceRoot: this.workspaceRoot,
      nxConfig,
      projects,
      dependencies,
      reverseDependencies,
    };
  }

  async analyzeProject(projectName: string): Promise<{
    content: Array<{
      type: 'text';
      text: string;
    }>;
  }> {
    const projects = await this.loadAllProjects();
    const project = projects.find(p => p.name === projectName);

    if (!project) {
      return {
        content: [
          {
            type: 'text',
            text: `Project "${projectName}" not found in the workspace.`,
          },
        ],
      };
    }

    const analysis = await this.performProjectAnalysis(project);
    
    // Format the analysis as a readable report
    let report = `# Project Analysis: ${projectName}\n\n`;
    report += `**Type:** ${project.type}\n`;
    report += `**Root:** ${project.root}\n`;
    report += `**Source Root:** ${project.sourceRoot || 'Not specified'}\n`;
    report += `**Tags:** ${project.tags.join(', ') || 'None'}\n\n`;
    
    report += `## Targets\n`;
    report += project.targets.map(target => `- ${target}`).join('\n') + '\n\n';
    
    report += `## Dependencies\n`;
    if (project.dependencies.length > 0) {
      report += project.dependencies.map(dep => `- ${dep}`).join('\n') + '\n\n';
    } else {
      report += 'No internal project dependencies\n\n';
    }
    
    report += `## Analysis\n`;
    report += `**File Count:** ${analysis.fileCount}\n`;
    report += `**Technologies:** ${analysis.technologies.join(', ') || 'None detected'}\n`;
    report += `**Build Tools:** ${analysis.buildTools.join(', ') || 'None detected'}\n`;
    report += `**Testing Frameworks:** ${analysis.testingFrameworks.join(', ') || 'None detected'}\n\n`;
    
    if (analysis.dependencies.length > 0) {
      report += `**Runtime Dependencies:** ${analysis.dependencies.length}\n`;
      report += analysis.dependencies.slice(0, 10).map(dep => `- ${dep}`).join('\n');
      if (analysis.dependencies.length > 10) {
        report += `\n... and ${analysis.dependencies.length - 10} more`;
      }
      report += '\n\n';
    }
    
    if (analysis.devDependencies.length > 0) {
      report += `**Development Dependencies:** ${analysis.devDependencies.length}\n`;
      report += analysis.devDependencies.slice(0, 10).map(dep => `- ${dep}`).join('\n');
      if (analysis.devDependencies.length > 10) {
        report += `\n... and ${analysis.devDependencies.length - 10} more`;
      }
      report += '\n';
    }

    return {
      content: [
        {
          type: 'text',
          text: report,
        },
      ],
    };
  }

  private async loadNxConfig(): Promise<any> {
    try {
      const nxJsonPath = path.join(this.workspaceRoot, 'nx.json');
      const content = await fs.readFile(nxJsonPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to load nx.json:', error);
      return {};
    }
  }

  private async loadAllProjects(): Promise<ProjectInfo[]> {
    const projects: ProjectInfo[] = [];
    
    try {
      // Look for projects in apps/ and libs/ directories
      const appsDir = path.join(this.workspaceRoot, 'apps');
      const libsDir = path.join(this.workspaceRoot, 'libs');

      // Scan apps directory
      if (await this.directoryExists(appsDir)) {
        const appProjects = await this.scanProjectsInDirectory(appsDir, 'app');
        projects.push(...appProjects);
      }

      // Scan libs directory
      if (await this.directoryExists(libsDir)) {
        const libProjects = await this.scanProjectsInDirectory(libsDir, 'lib');
        projects.push(...libProjects);
      }

      return projects;
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  }

  private async scanProjectsInDirectory(directory: string, type: 'app' | 'lib'): Promise<ProjectInfo[]> {
    const projects: ProjectInfo[] = [];
    
    try {
      const entries = await fs.readdir(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const projectPath = path.join(directory, entry.name);
          const projectJsonPath = path.join(projectPath, 'project.json');
          
          if (await this.fileExists(projectJsonPath)) {
            const project = await this.loadProject(entry.name, projectPath, type);
            if (project) {
              projects.push(project);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Failed to scan projects in ${directory}:`, error);
    }

    return projects;
  }

  private async loadProject(name: string, projectPath: string, type: 'app' | 'lib'): Promise<ProjectInfo | null> {
    try {
      const projectJsonPath = path.join(projectPath, 'project.json');
      const packageJsonPath = path.join(projectPath, 'package.json');
      
      const projectJson = JSON.parse(await fs.readFile(projectJsonPath, 'utf-8'));
      
      let packageJson = null;
      if (await this.fileExists(packageJsonPath)) {
        packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      }

      // Determine if it's an e2e project
      const actualType = name.includes('e2e') ? 'e2e' : type;

      return {
        name,
        type: actualType,
        root: path.relative(this.workspaceRoot, projectPath),
        sourceRoot: projectJson.sourceRoot,
        targets: Object.keys(projectJson.targets || {}),
        dependencies: this.extractProjectDependencies(projectJson),
        tags: projectJson.tags || [],
        projectJson,
        packageJson,
      };
    } catch (error) {
      console.error(`Failed to load project ${name}:`, error);
      return null;
    }
  }

  private extractProjectDependencies(projectJson: any): string[] {
    const dependencies: string[] = [];
    
    // Extract dependencies from targets
    for (const target of Object.values(projectJson.targets || {})) {
      const targetConfig = target as any;
      if (targetConfig.dependsOn) {
        for (const dep of targetConfig.dependsOn) {
          if (typeof dep === 'string' && dep.includes(':')) {
            const [projectName] = dep.split(':');
            if (projectName && !dependencies.includes(projectName)) {
              dependencies.push(projectName);
            }
          }
        }
      }
    }

    return dependencies;
  }

  private buildDependencyGraph(projects: ProjectInfo[]): { [projectName: string]: string[] } {
    const graph: { [projectName: string]: string[] } = {};
    
    for (const project of projects) {
      graph[project.name] = [...project.dependencies];
    }

    return graph;
  }

  private buildReverseDependencyGraph(dependencies: { [projectName: string]: string[] }): { [projectName: string]: string[] } {
    const reverseGraph: { [projectName: string]: string[] } = {};
    
    // Initialize all projects with empty arrays
    for (const projectName of Object.keys(dependencies)) {
      reverseGraph[projectName] = [];
    }

    // Build reverse dependencies
    for (const [projectName, deps] of Object.entries(dependencies)) {
      for (const dep of deps) {
        if (!reverseGraph[dep]) {
          reverseGraph[dep] = [];
        }
        reverseGraph[dep].push(projectName);
      }
    }

    return reverseGraph;
  }

  private async performProjectAnalysis(project: ProjectInfo): Promise<{
    fileCount: number;
    technologies: string[];
    buildTools: string[];
    testingFrameworks: string[];
    dependencies: string[];
    devDependencies: string[];
  }> {
    const projectPath = path.join(this.workspaceRoot, project.root);
    
    // Count files
    const fileCount = await this.countFilesRecursively(projectPath);
    
    // Analyze technologies, build tools, etc.
    const technologies = this.identifyTechnologies(project);
    const buildTools = this.identifyBuildTools(project);
    const testingFrameworks = this.identifyTestingFrameworks(project);
    
    // Get dependencies from package.json if available
    const dependencies = project.packageJson?.dependencies ? Object.keys(project.packageJson.dependencies) : [];
    const devDependencies = project.packageJson?.devDependencies ? Object.keys(project.packageJson.devDependencies) : [];

    return {
      fileCount,
      technologies,
      buildTools,
      testingFrameworks,
      dependencies,
      devDependencies,
    };
  }

  private async countFilesRecursively(directory: string): Promise<number> {
    let count = 0;
    
    try {
      const entries = await fs.readdir(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
          continue;
        }
        
        if (entry.isFile()) {
          count++;
        } else if (entry.isDirectory()) {
          count += await this.countFilesRecursively(path.join(directory, entry.name));
        }
      }
    } catch (error) {
      // Ignore errors for inaccessible directories
    }

    return count;
  }

  private identifyTechnologies(project: ProjectInfo): string[] {
    const technologies: string[] = [];
    
    // Check for React
    if (project.targets.includes('serve') || project.targets.includes('build')) {
      technologies.push('React');
    }
    
    // Check for TypeScript
    if (project.projectJson?.sourceRoot || project.root.includes('src')) {
      technologies.push('TypeScript');
    }
    
    // Check for Strapi
    if (project.name.includes('strapi') || project.targets.includes('strapi')) {
      technologies.push('Strapi');
    }

    return technologies;
  }

  private identifyBuildTools(project: ProjectInfo): string[] {
    const buildTools: string[] = [];
    
    // Check targets for build tools
    if (project.targets.includes('build')) {
      buildTools.push('Nx');
    }
    
    if (project.targets.includes('serve') || project.targets.includes('dev')) {
      buildTools.push('Vite');
    }
    
    if (project.targets.includes('docker:build')) {
      buildTools.push('Docker');
    }

    return buildTools;
  }

  private identifyTestingFrameworks(project: ProjectInfo): string[] {
    const testingFrameworks: string[] = [];
    
    if (project.targets.includes('test')) {
      testingFrameworks.push('Jest');
    }
    
    if (project.targets.includes('e2e')) {
      testingFrameworks.push('Cypress');
    }

    return testingFrameworks;
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  async getResource(uri: string): Promise<any> {
    if (uri === 'workspace://structure') {
      const structure = await this.getWorkspaceStructure();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(structure, null, 2),
          },
        ],
      };
    }
    
    throw new Error(`Unknown workspace resource: ${uri}`);
  }
}
