import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { ImageNode } from './ImageNode';

interface ResizableImageProps {
  node: ImageNode;
}

const ResizableImage: React.FC<ResizableImageProps> = ({ node }) => {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setIsSelected] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: node.getWidth() || 400,
    height: node.getHeight() || 300
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to deselect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSelected(false);
      }
    };

    if (isSelected) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSelected]);

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Image clicked, setting selected to true');
    setIsSelected(prev => !prev); // Toggle selection for better UX
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Starting resize in direction:', direction);
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;
    const aspectRatio = startHeight / startWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;

      switch (direction) {
        case 'se': // Southeast - both width and height
          newWidth = Math.max(50, Math.min(800, startWidth + deltaX));
          newHeight = Math.max(50, Math.min(600, startHeight + deltaY));
          break;
        case 'sw': // Southwest - width (left) and height
          newWidth = Math.max(50, Math.min(800, startWidth - deltaX));
          newHeight = Math.max(50, Math.min(600, startHeight + deltaY));
          break;
        case 'ne': // Northeast - width and height (up)
          newWidth = Math.max(50, Math.min(800, startWidth + deltaX));
          newHeight = Math.max(50, Math.min(600, startHeight - deltaY));
          break;
        case 'nw': // Northwest - both directions opposite
          newWidth = Math.max(50, Math.min(800, startWidth - deltaX));
          newHeight = Math.max(50, Math.min(600, startHeight - deltaY));
          break;
        case 'e': // East - width only
          newWidth = Math.max(50, Math.min(800, startWidth + deltaX));
          break;
        case 'w': // West - width only (left)
          newWidth = Math.max(50, Math.min(800, startWidth - deltaX));
          break;
        case 's': // South - height only
          newHeight = Math.max(50, Math.min(600, startHeight + deltaY));
          break;
        case 'n': // North - height only (up)
          newHeight = Math.max(50, Math.min(600, startHeight - deltaY));
          break;
        case 'se-aspect': // Southeast maintaining aspect ratio
          newWidth = Math.max(50, Math.min(800, startWidth + deltaX));
          newHeight = newWidth * aspectRatio;
          break;
      }
      
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      console.log('Resize ended, updating node with dimensions:', dimensions);
      setIsResizing(false);
      
      // Update the node with new dimensions
      editor.update(() => {
        node.setWidthAndHeight(dimensions.width, dimensions.height);
      });

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dimensions, editor, node]);

  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      
      // Only set initial dimensions if node doesn't have them
      if (!node.getWidth() && !node.getHeight()) {
        const maxWidth = 600;
        const aspectRatio = naturalHeight / naturalWidth;
        
        let width = Math.min(naturalWidth, maxWidth);
        let height = width * aspectRatio;
        
        // Ensure reasonable dimensions
        if (height > 400) {
          height = 400;
          width = height / aspectRatio;
        }
        
        console.log('Setting initial dimensions:', width, height);
        setDimensions({ width, height });
        
        // Update the node with calculated dimensions
        editor.update(() => {
          node.setWidthAndHeight(width, height);
        });
      } else {
        // Use existing dimensions from node
        const existingWidth = node.getWidth()!;
        const existingHeight = node.getHeight()!;
        console.log('Using existing dimensions:', existingWidth, existingHeight);
        setDimensions({
          width: existingWidth,
          height: existingHeight
        });
      }
    }
  }, [editor, node]);

  console.log('Rendering ResizableImage, isSelected:', isSelected, 'dimensions:', dimensions);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        display: 'inline-block',
        margin: '10px auto',
        cursor: isResizing ? 'nw-resize' : 'pointer',
        border: isSelected ? '3px solid #1976d2' : '3px solid transparent',
        borderRadius: 1,
        maxWidth: '100%',
        width: 'fit-content',
        '&:hover': {
          border: isSelected ? '3px solid #1976d2' : '3px solid #90caf9'
        },
        // Ensure the container is clickable
        '&:active': {
          border: '3px solid #1565c0'
        }
      }}
      onClick={handleImageClick}
      onMouseDown={(e) => {
        // Prevent text selection when clicking on image
        e.preventDefault();
      }}
    >
      <img
        ref={imageRef}
        src={node.getSrc()}
        alt={node.getAltText()}
        onLoad={handleImageLoad}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          display: 'block',
          borderRadius: '4px',
          objectFit: 'contain',
          userSelect: 'none',
          pointerEvents: 'none' // Let the container handle clicks
        }}
        draggable={false}
      />
      
      {/* Resize handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -6,
              right: -6,
              width: 12,
              height: 12,
              backgroundColor: '#1976d2',
              cursor: 'nw-resize',
              borderRadius: '2px',
              border: '1px solid white',
              boxShadow: 1,
              zIndex: 10,
              '&:hover': { backgroundColor: '#1565c0', transform: 'scale(1.1)' }
            }}
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            onClick={(e) => e.stopPropagation()}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -6,
              left: -6,
              width: 12,
              height: 12,
              backgroundColor: '#1976d2',
              cursor: 'ne-resize',
              borderRadius: '2px',
              border: '1px solid white',
              boxShadow: 1,
              zIndex: 10,
              '&:hover': { backgroundColor: '#1565c0', transform: 'scale(1.1)' }
            }}
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            onClick={(e) => e.stopPropagation()}
          />
          <Box
            sx={{
              position: 'absolute',
              top: -6,
              right: -6,
              width: 12,
              height: 12,
              backgroundColor: '#1976d2',
              cursor: 'sw-resize',
              borderRadius: '2px',
              border: '1px solid white',
              boxShadow: 1,
              zIndex: 10,
              '&:hover': { backgroundColor: '#1565c0', transform: 'scale(1.1)' }
            }}
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            onClick={(e) => e.stopPropagation()}
          />
          <Box
            sx={{
              position: 'absolute',
              top: -6,
              left: -6,
              width: 12,
              height: 12,
              backgroundColor: '#1976d2',
              cursor: 'se-resize',
              borderRadius: '2px',
              border: '1px solid white',
              boxShadow: 1,
              zIndex: 10,
              '&:hover': { backgroundColor: '#1565c0', transform: 'scale(1.1)' }
            }}
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Edge handles */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: -6,
              width: 12,
              height: 20,
              backgroundColor: '#1976d2',
              cursor: 'e-resize',
              borderRadius: '2px',
              border: '1px solid white',
              boxShadow: 1,
              zIndex: 10,
              transform: 'translateY(-50%)',
              '&:hover': { backgroundColor: '#1565c0', transform: 'translateY(-50%) scale(1.1)' }
            }}
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            onClick={(e) => e.stopPropagation()}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: -6,
              width: 12,
              height: 20,
              backgroundColor: '#1976d2',
              cursor: 'w-resize',
              borderRadius: '2px',
              border: '1px solid white',
              boxShadow: 1,
              zIndex: 10,
              transform: 'translateY(-50%)',
              '&:hover': { backgroundColor: '#1565c0', transform: 'translateY(-50%) scale(1.1)' }
            }}
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            onClick={(e) => e.stopPropagation()}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              width: 20,
              height: 12,
              backgroundColor: '#1976d2',
              cursor: 's-resize',
              borderRadius: '2px',
              border: '1px solid white',
              boxShadow: 1,
              zIndex: 10,
              transform: 'translateX(-50%)',
              '&:hover': { backgroundColor: '#1565c0', transform: 'translateX(-50%) scale(1.1)' }
            }}
            onMouseDown={(e) => handleResizeStart(e, 's')}
            onClick={(e) => e.stopPropagation()}
          />
          <Box
            sx={{
              position: 'absolute',
              top: -6,
              left: '50%',
              width: 20,
              height: 12,
              backgroundColor: '#1976d2',
              cursor: 'n-resize',
              borderRadius: '2px',
              border: '1px solid white',
              boxShadow: 1,
              zIndex: 10,
              transform: 'translateX(-50%)',
              '&:hover': { backgroundColor: '#1565c0', transform: 'translateX(-50%) scale(1.1)' }
            }}
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Aspect ratio handle (special) */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -10,
              right: -10,
              width: 16,
              height: 16,
              backgroundColor: '#ff9800',
              cursor: 'nw-resize',
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: 2,
              zIndex: 11,
              '&:hover': { backgroundColor: '#f57c00', transform: 'scale(1.1)' }
            }}
            onMouseDown={(e) => handleResizeStart(e, 'se-aspect')}
            onClick={(e) => e.stopPropagation()}
            title="Resize maintaining aspect ratio"
          />
        </>
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            left: -8,
            backgroundColor: '#1976d2',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: 1,
            fontWeight: 'bold'
          }}
        >
          SELECTED
        </Box>
      )}
    </Box>
  );
};

export default ResizableImage;
