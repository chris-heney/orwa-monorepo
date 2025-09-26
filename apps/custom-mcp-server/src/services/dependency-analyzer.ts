import { promises as fs } from 'fs';
import * as path from 'path';

export interface PackageInfo {
  name: string;
  version: string;
  description?: string;
  homepage?: string;
  repository?: string;
  license?: string;
  dependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  peerDependencies?: { [key: string]: string };
}

export interface DependencyAnalysis {
  scope: 'workspace' | 'project';
  projectName?: string;
  totalDependencies: number;
  totalDevDependencies: number;
  categories: {
    [category: string]: string[];
  };
  vulnerabilities: Array<{
    package: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  outdated: Array<{
    package: string;
    current: string;
    latest: string;
  }>;
  duplicates: Array<{
    package: string;
    versions: string[];
    projects: string[];
  }>;
}

export class DependencyAnalyzer {
  private workspaceRoot: string;

  constructor() {
    this.workspaceRoot = process.cwd();
  }

  async analyzeDependencies(
    scope: 'workspace' | 'project',
    projectName?: string,
    includeDevDeps: boolean = true
  ): Promise<{
    content: Array<{
      type: 'text';
      text: string;
    }>;
  }> {
    if (scope === 'project' && !projectName) {
      throw new Error('Project name is required when scope is "project"');
    }

    const analysis = await this.performDependencyAnalysis(scope, projectName, includeDevDeps);
    const report = this.generateAnalysisReport(analysis);

    return {
      content: [
        {
          type: 'text',
          text: report,
        },
      ],
    };
  }

  async getResource(uri: string): Promise<any> {
    if (uri === 'deps://analysis') {
      const analysis = await this.performDependencyAnalysis('workspace', undefined, true);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(analysis, null, 2),
          },
        ],
      };
    }
    
    throw new Error(`Unknown dependency resource: ${uri}`);
  }

  private async performDependencyAnalysis(
    scope: 'workspace' | 'project',
    projectName?: string,
    includeDevDeps: boolean = true
  ): Promise<DependencyAnalysis> {
    let packageJsonPaths: string[] = [];

    if (scope === 'workspace') {
      // Analyze workspace root package.json
      packageJsonPaths = [path.join(this.workspaceRoot, 'package.json')];
      
      // Also include project-specific package.json files
      const projectPaths = await this.findProjectPackageJsons();
      packageJsonPaths.push(...projectPaths);
    } else {
      // Analyze specific project
      const projectPath = path.join(this.workspaceRoot, 'apps', projectName!);
      const projectPackageJson = path.join(projectPath, 'package.json');
      
      if (await this.fileExists(projectPackageJson)) {
        packageJsonPaths = [projectPackageJson];
      } else {
        // Fallback to workspace package.json
        packageJsonPaths = [path.join(this.workspaceRoot, 'package.json')];
      }
    }

    const allDependencies = new Map<string, string>();
    const allDevDependencies = new Map<string, string>();
    const projectDependencies = new Map<string, string[]>();

    for (const packageJsonPath of packageJsonPaths) {
      const packageInfo = await this.loadPackageJson(packageJsonPath);
      if (packageInfo) {
        const projectName = this.getProjectNameFromPath(packageJsonPath);
        
        // Collect dependencies
        if (packageInfo.dependencies) {
          for (const [name, version] of Object.entries(packageInfo.dependencies)) {
            allDependencies.set(name, version);
            if (!projectDependencies.has(name)) {
              projectDependencies.set(name, []);
            }
            projectDependencies.get(name)!.push(projectName);
          }
        }

        // Collect dev dependencies if requested
        if (includeDevDeps && packageInfo.devDependencies) {
          for (const [name, version] of Object.entries(packageInfo.devDependencies)) {
            allDevDependencies.set(name, version);
            if (!projectDependencies.has(name)) {
              projectDependencies.set(name, []);
            }
            projectDependencies.get(name)!.push(projectName);
          }
        }
      }
    }

    // Categorize dependencies
    const categories = this.categorizeDependencies(allDependencies, allDevDependencies);
    
    // Find duplicates
    const duplicates = this.findDuplicates(projectDependencies);

    return {
      scope,
      projectName,
      totalDependencies: allDependencies.size,
      totalDevDependencies: allDevDependencies.size,
      categories,
      vulnerabilities: [], // Would require external API or security database
      outdated: [], // Would require npm registry API
      duplicates,
    };
  }

  private async findProjectPackageJsons(): Promise<string[]> {
    const packageJsonPaths: string[] = [];
    
    // Scan apps directory
    const appsDir = path.join(this.workspaceRoot, 'apps');
    if (await this.directoryExists(appsDir)) {
      const appPackageJsons = await this.scanDirectoryForPackageJson(appsDir);
      packageJsonPaths.push(...appPackageJsons);
    }

    // Scan libs directory
    const libsDir = path.join(this.workspaceRoot, 'libs');
    if (await this.directoryExists(libsDir)) {
      const libPackageJsons = await this.scanDirectoryForPackageJson(libsDir);
      packageJsonPaths.push(...libPackageJsons);
    }

    return packageJsonPaths;
  }

  private async scanDirectoryForPackageJson(directory: string): Promise<string[]> {
    const packageJsonPaths: string[] = [];
    
    try {
      const entries = await fs.readdir(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const projectPath = path.join(directory, entry.name);
          const packageJsonPath = path.join(projectPath, 'package.json');
          
          if (await this.fileExists(packageJsonPath)) {
            packageJsonPaths.push(packageJsonPath);
          }
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return packageJsonPaths;
  }

  private async loadPackageJson(filePath: string): Promise<PackageInfo | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Failed to load package.json from ${filePath}:`, error);
      return null;
    }
  }

  private getProjectNameFromPath(packageJsonPath: string): string {
    const relativePath = path.relative(this.workspaceRoot, packageJsonPath);
    const parts = relativePath.split(path.sep);
    
    if (parts.length > 1 && (parts[0] === 'apps' || parts[0] === 'libs')) {
      return parts[1];
    }
    
    return 'workspace';
  }

  private categorizeDependencies(
    dependencies: Map<string, string>,
    devDependencies: Map<string, string>
  ): { [category: string]: string[] } {
    const categories: { [category: string]: string[] } = {
      'Frontend Frameworks': [],
      'Backend Frameworks': [],
      'UI Libraries': [],
      'Build Tools': [],
      'Testing': [],
      'Utilities': [],
      'Database': [],
      'Development': [],
      'Other': [],
    };

    const categorizePackage = (packageName: string, isDev: boolean) => {
      const name = packageName.toLowerCase();
      
      if (name.includes('react') || name.includes('vue') || name.includes('angular')) {
        categories['Frontend Frameworks'].push(packageName);
      } else if (name.includes('express') || name.includes('fastify') || name.includes('strapi')) {
        categories['Backend Frameworks'].push(packageName);
      } else if (name.includes('mui') || name.includes('material') || name.includes('antd') || name.includes('tailwind')) {
        categories['UI Libraries'].push(packageName);
      } else if (name.includes('vite') || name.includes('webpack') || name.includes('rollup') || name.includes('esbuild')) {
        categories['Build Tools'].push(packageName);
      } else if (name.includes('jest') || name.includes('cypress') || name.includes('vitest') || name.includes('testing')) {
        categories['Testing'].push(packageName);
      } else if (name.includes('mysql') || name.includes('postgres') || name.includes('mongo') || name.includes('redis')) {
        categories['Database'].push(packageName);
      } else if (isDev || name.includes('eslint') || name.includes('prettier') || name.includes('typescript')) {
        categories['Development'].push(packageName);
      } else if (name.includes('lodash') || name.includes('axios') || name.includes('uuid') || name.includes('date')) {
        categories['Utilities'].push(packageName);
      } else {
        categories['Other'].push(packageName);
      }
    };

    for (const packageName of dependencies.keys()) {
      categorizePackage(packageName, false);
    }

    for (const packageName of devDependencies.keys()) {
      categorizePackage(packageName, true);
    }

    // Remove empty categories
    for (const [category, packages] of Object.entries(categories)) {
      if (packages.length === 0) {
        delete categories[category];
      }
    }

    return categories;
  }

  private findDuplicates(projectDependencies: Map<string, string[]>): Array<{
    package: string;
    versions: string[];
    projects: string[];
  }> {
    const duplicates: Array<{ package: string; versions: string[]; projects: string[] }> = [];
    
    for (const [packageName, projects] of projectDependencies.entries()) {
      if (projects.length > 1) {
        // This is a simplified check - in reality, you'd need to check actual versions
        duplicates.push({
          package: packageName,
          versions: ['various'], // Would need to collect actual versions
          projects,
        });
      }
    }

    return duplicates;
  }

  private generateAnalysisReport(analysis: DependencyAnalysis): string {
    let report = `# Dependency Analysis Report\n\n`;
    report += `**Scope:** ${analysis.scope}\n`;
    if (analysis.projectName) {
      report += `**Project:** ${analysis.projectName}\n`;
    }
    report += `**Total Dependencies:** ${analysis.totalDependencies}\n`;
    report += `**Total Dev Dependencies:** ${analysis.totalDevDependencies}\n\n`;

    // Categories
    report += `## Dependencies by Category\n\n`;
    for (const [category, packages] of Object.entries(analysis.categories)) {
      report += `### ${category} (${packages.length})\n`;
      for (const pkg of packages.sort()) {
        report += `- ${pkg}\n`;
      }
      report += '\n';
    }

    // Duplicates
    if (analysis.duplicates.length > 0) {
      report += `## Duplicate Dependencies\n\n`;
      for (const duplicate of analysis.duplicates) {
        report += `### ${duplicate.package}\n`;
        report += `- Projects: ${duplicate.projects.join(', ')}\n`;
        report += `- Versions: ${duplicate.versions.join(', ')}\n\n`;
      }
    }

    return report;
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
}

