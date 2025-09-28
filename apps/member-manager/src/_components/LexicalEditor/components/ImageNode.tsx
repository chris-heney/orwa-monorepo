import React from 'react';
import { DecoratorNode } from 'lexical';
import ResizableImage from './ResizableImage';

// Custom Image Node for Lexical
export type ImagePayload = {
  src: string;
  altText: string;
  width?: number;
  height?: number;
  key?: string;
};

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __altText: string;
  __width?: number;
  __height?: number;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode({
      src: node.__src,
      altText: node.__altText,
      width: node.__width,
      height: node.__height,
      key: node.getKey(),
    });
  }

  static importJSON(serializedNode: any): ImageNode {
    const { src, altText, width, height } = serializedNode;
    return $createImageNode(src, altText, width, height);
  }

  static importDOM() {
    return {
      img: (node: HTMLImageElement) => {
        // Import any img tag as an ImageNode, prioritizing those with our data attribute
        const width = node.style.width ? parseInt(node.style.width) : undefined;
        const height = node.style.height ? parseInt(node.style.height) : undefined;
        const priority = node.hasAttribute('data-lexical-image') ? 1 : 0;
        
        return {
          conversion: () => ({
            node: $createImageNode(node.src, node.alt, width, height)
          }),
          priority: priority as 0 | 1
        };
      },
      div: (node: HTMLDivElement) => {
        if (node.hasAttribute('data-lexical-image-container')) {
          const src = node.getAttribute('data-src') || '';
          const alt = node.getAttribute('data-alt') || '';
          const width = node.getAttribute('data-width') ? parseInt(node.getAttribute('data-width')!) : undefined;
          const height = node.getAttribute('data-height') ? parseInt(node.getAttribute('data-height')!) : undefined;
          
          if (src) {
            return {
              conversion: () => ({
                node: $createImageNode(src, alt, width, height)
              }),
              priority: 1 as const
            };
          }
        }
        return null;
      }
    };
  }

  exportJSON(): any {
    return {
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      type: 'image',
      version: 1,
    };
  }

  exportDOM(): { element: HTMLImageElement } {
    // Export as a proper img element for HTML/email compatibility
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__altText;
    img.setAttribute('data-lexical-image', 'true');
    
    // Apply dimensions if available
    if (this.__width) {
      img.style.width = `${this.__width}px`;
    }
    if (this.__height) {
      img.style.height = `${this.__height}px`;
    }
    
    // Default styling for email compatibility
    img.style.display = 'block';
    img.style.margin = '10px auto';
    img.style.borderRadius = '4px';
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    
    return { element: img };
  }

  constructor(payload: ImagePayload = { src: '', altText: '' }) {
    super(payload.key);
    this.__src = payload.src;
    this.__altText = payload.altText;
    this.__width = payload.width;
    this.__height = payload.height;
  }

  createDOM(): HTMLElement {
    // Create a container div for the decorator to render into
    const container = document.createElement('div');
    container.setAttribute('data-lexical-image-container', 'true');
    container.setAttribute('data-src', this.__src);
    container.setAttribute('data-alt', this.__altText);
    if (this.__width) container.setAttribute('data-width', this.__width.toString());
    if (this.__height) container.setAttribute('data-height', this.__height.toString());
    
    // Minimal styling for the container
    container.style.display = 'inline-block';
    container.style.position = 'relative';
    
    return container;
  }

  updateDOM(prevNode: ImageNode, dom: HTMLElement): boolean {
    const container = dom;
    
    // Update data attributes that the ResizableImage component will read
    if (this.__src !== prevNode.__src) {
      container.setAttribute('data-src', this.__src);
    }
    if (this.__altText !== prevNode.__altText) {
      container.setAttribute('data-alt', this.__altText);
    }
    if (this.__width !== prevNode.__width) {
      if (this.__width) {
        container.setAttribute('data-width', this.__width.toString());
      } else {
        container.removeAttribute('data-width');
      }
    }
    if (this.__height !== prevNode.__height) {
      if (this.__height) {
        container.setAttribute('data-height', this.__height.toString());
      } else {
        container.removeAttribute('data-height');
      }
    }
    
    // Return true to trigger a re-render of the decorator
    return this.__src !== prevNode.__src || 
           this.__altText !== prevNode.__altText || 
           this.__width !== prevNode.__width || 
           this.__height !== prevNode.__height;
  }

  decorate(): React.ReactElement {
    return <ResizableImage node={this} />;
  }

  isInline(): boolean {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  setWidthAndHeight(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  getWidth(): number | undefined {
    return this.__width;
  }

  getHeight(): number | undefined {
    return this.__height;
  }
}

// Helper function to create ImageNode
export function $createImageNode(src: string, altText: string, width?: number, height?: number): ImageNode {
  return new ImageNode({ src, altText, width, height });
}

// Helper function to check if node is ImageNode
export function $isImageNode(node: any): node is ImageNode {
  return node instanceof ImageNode;
}
