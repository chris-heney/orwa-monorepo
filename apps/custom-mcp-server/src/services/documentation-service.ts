import { promises as fs } from 'fs';
import * as path from 'path';

export interface DocumentationFile {
  path: string;
  name: string;
  content: string;
  size: number;
  lastModified: Date;
  type: 'markdown' | 'text' | 'other';
}

export interface SearchResult {
  file: DocumentationFile;
  matches: {
    line: number;
    content: string;
    context: string[];
  }[];
}

export class DocumentationService {
  private workspaceRoot: string;

  constructor() {
    this.workspaceRoot = process.cwd();
  }

  async getAllDocumentationFiles(): Promise<DocumentationFile[]> {
    const files: DocumentationFile[] = [];
    
    // Common documentation file patterns
    const patterns = [
      '**/*.md',
      '**/*.txt',
      '**/README*',
      '**/CHANGELOG*',
      '**/LICENSE*',
      '**/CONTRIBUTING*',
    ];

    await this.scanForDocumentation(this.workspaceRoot, files);
    return files;
  }

  async getArchitectureDoc(): Promise<any> {
    try {
      const archDocPath = path.join(this.workspaceRoot, 'ARCHITECTURE.md');
      const content = await fs.readFile(archDocPath, 'utf-8');
      
      return {
        contents: [
          {
            uri: 'docs://architecture',
            mimeType: 'text/markdown',
            text: content,
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri: 'docs://architecture',
            mimeType: 'text/plain',
            text: 'Architecture documentation not found',
          },
        ],
      };
    }
  }

  async searchDocumentation(query: string, filePattern?: string): Promise<{
    content: Array<{
      type: 'text';
      text: string;
    }>;
  }> {
    const files = await this.getAllDocumentationFiles();
    const results: SearchResult[] = [];
    
    const searchRegex = new RegExp(query, 'gi');
    
    for (const file of files) {
      if (filePattern && !this.matchesPattern(file.name, filePattern)) {
        continue;
      }
      
      const matches = this.searchInContent(file.content, searchRegex);
      if (matches.length > 0) {
        results.push({ file, matches });
      }
    }

    // Format results
    let resultText = `Found ${results.length} files with matches for "${query}":\n\n`;
    
    for (const result of results) {
      resultText += `## ${result.file.path}\n`;
      resultText += `File size: ${result.file.size} bytes, Last modified: ${result.file.lastModified.toISOString()}\n\n`;
      
      for (const match of result.matches) {
        resultText += `**Line ${match.line}:** ${match.content}\n`;
        if (match.context.length > 0) {
          resultText += `Context:\n${match.context.map(line => `  ${line}`).join('\n')}\n`;
        }
        resultText += '\n';
      }
      resultText += '---\n\n';
    }

    return {
      content: [
        {
          type: 'text',
          text: resultText,
        },
      ],
    };
  }

  private async scanForDocumentation(directory: string, files: DocumentationFile[]): Promise<void> {
    try {
      const entries = await fs.readdir(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        // Skip common directories that don't contain documentation
        if (entry.isDirectory()) {
          if (['node_modules', '.git', 'dist', '.nx', 'coverage'].includes(entry.name)) {
            continue;
          }
          
          await this.scanForDocumentation(path.join(directory, entry.name), files);
        } else if (entry.isFile()) {
          if (this.isDocumentationFile(entry.name)) {
            const filePath = path.join(directory, entry.name);
            const docFile = await this.loadDocumentationFile(filePath);
            if (docFile) {
              files.push(docFile);
            }
          }
        }
      }
    } catch (error) {
      // Ignore errors for inaccessible directories
    }
  }

  private isDocumentationFile(filename: string): boolean {
    const docExtensions = ['.md', '.txt', '.rst', '.adoc'];
    const docNames = ['README', 'CHANGELOG', 'LICENSE', 'CONTRIBUTING', 'ARCHITECTURE'];
    
    const ext = path.extname(filename).toLowerCase();
    const nameWithoutExt = path.basename(filename, ext).toUpperCase();
    
    return docExtensions.includes(ext) || docNames.includes(nameWithoutExt);
  }

  private async loadDocumentationFile(filePath: string): Promise<DocumentationFile | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);
      const ext = path.extname(filePath).toLowerCase();
      
      let type: 'markdown' | 'text' | 'other' = 'other';
      if (ext === '.md') {
        type = 'markdown';
      } else if (ext === '.txt') {
        type = 'text';
      }

      return {
        path: path.relative(this.workspaceRoot, filePath),
        name: path.basename(filePath),
        content,
        size: stats.size,
        lastModified: stats.mtime,
        type,
      };
    } catch (error) {
      console.error(`Failed to load documentation file ${filePath}:`, error);
      return null;
    }
  }

  private searchInContent(content: string, regex: RegExp): Array<{
    line: number;
    content: string;
    context: string[];
  }> {
    const lines = content.split('\n');
    const matches: Array<{ line: number; content: string; context: string[] }> = [];
    
    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        const context: string[] = [];
        
        // Add context lines (2 before and 2 after)
        for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 2); j++) {
          if (j !== i) {
            context.push(`${j + 1}: ${lines[j]}`);
          }
        }
        
        matches.push({
          line: i + 1,
          content: lines[i],
          context,
        });
      }
    }
    
    return matches;
  }

  private matchesPattern(filename: string, pattern: string): boolean {
    // Simple pattern matching - convert glob-like patterns to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(filename);
  }
}

