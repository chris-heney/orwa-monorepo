import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Tooltip,
  IconButton,
  Divider,
  MenuItem,
  Menu,
  ListItemText,
  ListItemIcon,
  TextField
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import SubscriptIcon from '@mui/icons-material/Subscript';
import SuperscriptIcon from '@mui/icons-material/Superscript';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import ListIcon from '@mui/icons-material/List';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ClearIcon from '@mui/icons-material/Clear';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatIndentIncreaseIcon from '@mui/icons-material/FormatIndentIncrease';
import FormatIndentDecreaseIcon from '@mui/icons-material/FormatIndentDecrease';
import ImageIcon from '@mui/icons-material/Image';
import TableChartIcon from '@mui/icons-material/TableChart';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TitleIcon from '@mui/icons-material/Title';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import FormatLineSpacingIcon from '@mui/icons-material/FormatLineSpacing';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  $createParagraphNode,
  $isElementNode,
  $isParagraphNode
} from 'lexical';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $generateHtmlFromNodes } from '@lexical/html';

import ColorPicker from './ColorPicker';
import ImageInsertDialog from './ImageInsertDialog';
import ContentLibraryDialog from '../../AssetLibraryDialog';
import VoiceToText from './VoiceToText';
import { $createImageNode } from './ImageNode';

// Font families available in the editor
const FONT_FAMILY_OPTIONS = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
];

// Common font sizes like Google Docs
const FONT_SIZE_OPTIONS = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96
];

interface ToolbarProps {
  onInsertFieldClick?: () => void;
  disabled?: boolean;
  field: any;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  editorMode?: 'rich' | 'html' | 'preview';
  onModeChange?: (mode: 'rich' | 'html' | 'preview') => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onInsertFieldClick, disabled, field, onToggleFullscreen, isFullscreen = false, editorMode = 'rich', onModeChange }) => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState('paragraph');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState('14');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [alignment, setAlignment] = useState('left');
  
  // Menu states
  const [formatMenuAnchor, setFormatMenuAnchor] = useState<null | HTMLElement>(null);
  const [headingMenuAnchor, setHeadingMenuAnchor] = useState<null | HTMLElement>(null);
  const [fontMenuAnchor, setFontMenuAnchor] = useState<null | HTMLElement>(null);
  const [fontSizeMenuAnchor, setFontSizeMenuAnchor] = useState<null | HTMLElement>(null);
  const [lineSpacingMenuAnchor, setLineSpacingMenuAnchor] = useState<null | HTMLElement>(null);
  const [insertMenuAnchor, setInsertMenuAnchor] = useState<null | HTMLElement>(null);
  const [alignMenuAnchor, setAlignMenuAnchor] = useState<null | HTMLElement>(null);
  const [colorPickerAnchor, setColorPickerAnchor] = useState<null | HTMLElement>(null);
  const [bgColorPickerAnchor, setBgColorPickerAnchor] = useState<null | HTMLElement>(null);
  const [fontSizeInputValue, setFontSizeInputValue] = useState('14');
  
  // Image dialogs
  const [imageInsertDialogOpen, setImageInsertDialogOpen] = useState(false);
  const [imageLibraryDialogOpen, setImageLibraryDialogOpen] = useState(false);

  // Update toolbar state based on selection
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
          setIsUnderline(selection.hasFormat('underline'));
          setIsStrikethrough(selection.hasFormat('strikethrough'));
          setIsSubscript(selection.hasFormat('subscript'));
          setIsSuperscript(selection.hasFormat('superscript'));
          setIsCode(selection.hasFormat('code'));
          
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
          
          // Detect block type
          if (element.__type === 'heading') {
            setBlockType((element as any).__tag);
          } else if (element.__type === 'quote') {
            setBlockType('quote');
          } else {
            setBlockType('paragraph');
          }
        }
      });
    });
  }, [editor]);

  const applyBlockType = useCallback((type: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (type === 'paragraph') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (type.startsWith('h')) {
          $setBlocksType(selection, () => $createHeadingNode(type as any));
        } else if (type === 'quote') {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      }
    });
    setBlockType(type);
  }, [editor]);

  const toggleFormat = useCallback((format: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format as any);
  }, [editor]);

  const applyTextColor = useCallback((color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node.__type === 'text') {
            const currentStyle = (node as any).getStyle() || '';
            // Parse existing styles into an object
            const styleObj: Record<string, string> = {};
            if (currentStyle) {
              currentStyle.split(';').forEach((style: string) => {
                const [property, value] = style.split(':').map((s: string) => s.trim());
                if (property && value) {
                  styleObj[property] = value;
                }
              });
            }
            
            // Update the color property
            styleObj['color'] = color;
            
            // Rebuild the style string
            const newStyle = Object.entries(styleObj)
              .map(([prop, val]) => `${prop}: ${val}`)
              .join('; ');
            
            (node as any).setStyle(newStyle);
          }
        });
      }
    });
  }, [editor]);

  const applyBackgroundColor = useCallback((color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node.__type === 'text') {
            const currentStyle = (node as any).getStyle() || '';
            // Parse existing styles into an object
            const styleObj: Record<string, string> = {};
            if (currentStyle) {
              currentStyle.split(';').forEach((style: string) => {
                const [property, value] = style.split(':').map((s: string) => s.trim());
                if (property && value) {
                  styleObj[property] = value;
                }
              });
            }
            
            // Update the background-color property
            styleObj['background-color'] = color;
            
            // Rebuild the style string
            const newStyle = Object.entries(styleObj)
              .map(([prop, val]) => `${prop}: ${val}`)
              .join('; ');
            
            (node as any).setStyle(newStyle);
          }
        });
      }
    });
  }, [editor]);

  const applyFontFamily = useCallback((family: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node.__type === 'text') {
            const currentStyle = (node as any).getStyle() || '';
            // Parse existing styles into an object
            const styleObj: Record<string, string> = {};
            if (currentStyle) {
              currentStyle.split(';').forEach((style: string) => {
                const [property, value] = style.split(':').map((s: string) => s.trim());
                if (property && value) {
                  styleObj[property] = value;
                }
              });
            }
            
            // Update the font-family property
            styleObj['font-family'] = family;
            
            // Rebuild the style string
            const newStyle = Object.entries(styleObj)
              .map(([prop, val]) => `${prop}: ${val}`)
              .join('; ');
            
            (node as any).setStyle(newStyle);
          }
        });
      }
    });
    setFontFamily(family);
  }, [editor]);

  const applyFontSize = useCallback((size: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node.__type === 'text') {
            const currentStyle = (node as any).getStyle() || '';
            // Parse existing styles into an object
            const styleObj: Record<string, string> = {};
            if (currentStyle) {
              currentStyle.split(';').forEach((style: string) => {
                const [property, value] = style.split(':').map((s: string) => s.trim());
                if (property && value) {
                  styleObj[property] = value;
                }
              });
            }
            
            // Update the font-size property
            styleObj['font-size'] = `${size}px`;
            
            // Rebuild the style string
            const newStyle = Object.entries(styleObj)
              .map(([prop, val]) => `${prop}: ${val}`)
              .join('; ');
            
            (node as any).setStyle(newStyle);
          }
        });
      }
    });
    setFontSize(size);
    setFontSizeInputValue(size);
  }, [editor]);

  const increaseFontSize = useCallback(() => {
    const currentSize = parseInt(fontSizeInputValue) || 14;
    const newSize = Math.min(currentSize + 1, 72);
    applyFontSize(newSize.toString());
  }, [fontSizeInputValue, applyFontSize]);

  const decreaseFontSize = useCallback(() => {
    const currentSize = parseInt(fontSizeInputValue) || 14;
    const newSize = Math.max(currentSize - 1, 8);
    applyFontSize(newSize.toString());
  }, [fontSizeInputValue, applyFontSize]);

  const applyLineSpacing = useCallback((spacing: string) => {
    console.log(`🔍 NEW APPROACH: Applying line spacing to text nodes: ${spacing}`);
    
    editor.update(() => {
      const selection = $getSelection();
      
      if ($isRangeSelection(selection)) {
        // Apply line spacing to ALL text nodes in the selection (same as color/font-size)
        selection.getNodes().forEach((node) => {
          if (node.__type === 'text') {
            const currentStyle = (node as any).getStyle() || '';
            console.log('📝 Text node current style:', currentStyle);
            
            // Parse existing styles into an object
            const styleObj: Record<string, string> = {};
            if (currentStyle) {
              currentStyle.split(';').forEach((style: string) => {
                const [property, value] = style.split(':').map((s: string) => s.trim());
                if (property && value) {
                  styleObj[property] = value;
                }
              });
            }
            
            // Update the line-height property
            styleObj['line-height'] = spacing;
            
            // Rebuild the style string
            const newStyle = Object.entries(styleObj)
              .map(([prop, val]) => `${prop}: ${val}`)
              .join('; ');
            
            (node as any).setStyle(newStyle);
            console.log(`✅ Applied line spacing ${spacing} to TEXT NODE:`, newStyle);
          }
        });
        
        // If no nodes selected, apply to current text node
        if (selection.getNodes().length === 0) {
          const anchorNode = selection.anchor.getNode();
          if (anchorNode.__type === 'text') {
            const currentStyle = (anchorNode as any).getStyle() || '';
            
            // Parse existing styles into an object
            const styleObj: Record<string, string> = {};
            if (currentStyle) {
              currentStyle.split(';').forEach((style: string) => {
                const [property, value] = style.split(':').map((s: string) => s.trim());
                if (property && value) {
                  styleObj[property] = value;
                }
              });
            }
            
            // Update the line-height property
            styleObj['line-height'] = spacing;
            
            // Rebuild the style string
            const newStyle = Object.entries(styleObj)
              .map(([prop, val]) => `${prop}: ${val}`)
              .join('; ');
            
            (anchorNode as any).setStyle(newStyle);
            console.log(`✅ Applied line spacing ${spacing} to ANCHOR TEXT NODE:`, newStyle);
          }
        }
        
        // Force HTML regeneration to see the result
        setTimeout(() => {
          editor.getEditorState().read(() => {
            const html = $generateHtmlFromNodes(editor);
            console.log('🔄 Generated HTML after TEXT NODE line spacing:', html);
          });
        }, 200);
      }
    });
  }, [editor]);

  // Alternative line spacing method using direct DOM manipulation
  const applyLineSpacingDirect = useCallback((spacing: string) => {
    console.log(`🚀 Direct method: Applying line spacing ${spacing}`);
    
    // Get the editor's root DOM element
    const editorElement = editor.getRootElement();
    if (!editorElement) {
      console.warn('❌ No editor root element found');
      return;
    }
    
    // Get current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.warn('❌ No DOM selection found');
      return;
    }
    
    const range = selection.getRangeAt(0);
    let container = range.commonAncestorContainer;
    
    // Find the paragraph or block element
    while (container && container.nodeType !== Node.ELEMENT_NODE) {
      const parent = container.parentNode;
      if (!parent) break;
      container = parent;
    }
    
    if (!container) {
      console.warn('❌ No container element found');
      return;
    }
    
    // Find the closest paragraph or block element
    let blockElement = container as Element;
    while (blockElement && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(blockElement.tagName)) {
      blockElement = blockElement.parentElement!;
      if (!blockElement || !editorElement.contains(blockElement)) {
        break;
      }
    }
    
    if (blockElement && editorElement.contains(blockElement)) {
      console.log('🎯 Found block element:', blockElement.tagName, blockElement);
      (blockElement as HTMLElement).style.lineHeight = spacing;
      console.log(`✅ Applied line spacing ${spacing} directly to DOM element`);
      
      // Also try to update the Lexical node if possible
      editor.update(() => {
        const key = (blockElement as any).__lexicalKey;
        if (key) {
          const node = editor.getElementByKey(key);
          if (node && typeof (node as any).setStyle === 'function') {
            const currentStyle = (node as any).getStyle() || '';
            let newStyle = currentStyle.replace(/line-height\s*:\s*[^;]+;?\s*/g, '').trim();
            if (newStyle && !newStyle.endsWith(';')) {
              newStyle += ';';
            }
            newStyle += ` line-height: ${spacing};`;
            (node as any).setStyle(newStyle.trim());
            console.log('✅ Also updated Lexical node style');
          }
        }
      });
    } else {
      console.warn('❌ No suitable block element found');
    }
  }, [editor]);

  const toggleLink = useCallback(() => {
    const url = prompt('Enter URL (leave empty to remove):');
    if (url !== null) {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim() === '' ? null : url.trim());
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    if (rows && cols) {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, {
        columns: cols,
        rows: rows,
      });
    }
  }, [editor]);

  const insertHorizontalRule = useCallback(() => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  }, [editor]);

  const handleImageSelectByUrl = useCallback((fileUrl: string) => {
    console.log('Inserting image with URL:', fileUrl);
    
    // Insert image using proper Lexical ImageNode
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Create ImageNode
        const imageNode = $createImageNode(fileUrl, '');
        
        // Insert the image node
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
        
        // Insert the image after the current element
        element.insertAfter(imageNode);
        
        // Add a new paragraph after the image for continued editing
        const paragraphNode = $createParagraphNode();
        imageNode.insertAfter(paragraphNode);
        paragraphNode.select();
        
        console.log('Image node inserted successfully');
      }
    });
  }, [editor]);

  const handleUploadImage = useCallback(async (file: File) => {
    console.log('Uploading image file:', file.name);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Upload the file to your API
      const response = await fetch(`${window.location.origin}/api/content/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      const imageUrl = result.fileUrl || `${window.location.origin}/api/content/${result.id}/download`;
      
      // Insert the uploaded image
      handleImageSelectByUrl(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback: create a local URL for preview (not recommended for production)
      const localUrl = URL.createObjectURL(file);
      handleImageSelectByUrl(localUrl);
    }
  }, [handleImageSelectByUrl]);

  const handleSelectFromStorage = useCallback(() => {
    setImageLibraryDialogOpen(true);
  }, []);

  const handleEnterLink = useCallback((url: string) => {
    handleImageSelectByUrl(url);
  }, [handleImageSelectByUrl]);

  const setTextAlignment = useCallback((align: string) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align as any);
    setAlignment(align);
  }, [editor]);

  const indentContent = useCallback(() => {
    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
  }, [editor]);

  const outdentContent = useCallback(() => {
    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
  }, [editor]);

  const clearAll = useCallback(() => {
    editor.update(() => {
      $getRoot().clear();
    });
  }, [editor]);

  const btn = (title: string, icon: React.ReactNode, onClick: () => void, isActive = false) => (
    <Tooltip title={title}>
      <span>
        <IconButton 
          size="small" 
          onClick={onClick} 
          disabled={disabled} 
          sx={{ 
            backgroundColor: isActive ? 'action.selected' : 'transparent',
            '&:hover': {
              backgroundColor: isActive ? 'action.selected' : 'action.hover'
            }
          }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      px: 1, 
      py: 0.75, 
      borderBottom: theme => `1px solid ${theme.palette.divider}`,
      flexWrap: 'wrap'
    }}>
      {/* History */}
      {btn('Undo', <UndoIcon />, () => editor.dispatchCommand(UNDO_COMMAND, undefined))}
      {btn('Redo', <RedoIcon />, () => editor.dispatchCommand(REDO_COMMAND, undefined))}

      <Divider orientation="vertical" flexItem />

      {/* Text Formatting */}
      {btn('Bold', <FormatBoldIcon />, () => toggleFormat('bold'), isBold)}
      {btn('Italic', <FormatItalicIcon />, () => toggleFormat('italic'), isItalic)}
      {btn('Underline', <FormatUnderlinedIcon />, () => toggleFormat('underline'), isUnderline)}

      {/* Format Menu */}
      <Tooltip title="Text formatting">
        <IconButton 
          size="small" 
          onClick={(e) => setFormatMenuAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={formatMenuAnchor}
        open={Boolean(formatMenuAnchor)}
        onClose={() => setFormatMenuAnchor(null)}
      >
        <MenuItem onClick={() => { toggleFormat('strikethrough'); setFormatMenuAnchor(null); }}>
          <ListItemIcon><StrikethroughSIcon /></ListItemIcon>
          <ListItemText>Strikethrough</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { toggleFormat('subscript'); setFormatMenuAnchor(null); }}>
          <ListItemIcon><SubscriptIcon /></ListItemIcon>
          <ListItemText>Subscript</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { toggleFormat('superscript'); setFormatMenuAnchor(null); }}>
          <ListItemIcon><SuperscriptIcon /></ListItemIcon>
          <ListItemText>Superscript</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { toggleFormat('code'); setFormatMenuAnchor(null); }}>
          <ListItemIcon><CodeIcon /></ListItemIcon>
          <ListItemText>Inline Code</ListItemText>
        </MenuItem>
      </Menu>

      {/* Heading Menu */}
      <Tooltip title="Headings & Blocks">
        <IconButton 
          size="small" 
          onClick={(e) => setHeadingMenuAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <TitleIcon />
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={headingMenuAnchor}
        open={Boolean(headingMenuAnchor)}
        onClose={() => setHeadingMenuAnchor(null)}
      >
        <MenuItem onClick={() => { applyBlockType('paragraph'); setHeadingMenuAnchor(null); }}>
          <ListItemText>Paragraph</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { applyBlockType('h1'); setHeadingMenuAnchor(null); }}>
          <ListItemText>Heading 1</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { applyBlockType('h2'); setHeadingMenuAnchor(null); }}>
          <ListItemText>Heading 2</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { applyBlockType('h3'); setHeadingMenuAnchor(null); }}>
          <ListItemText>Heading 3</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { applyBlockType('h4'); setHeadingMenuAnchor(null); }}>
          <ListItemText>Heading 4</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { applyBlockType('h5'); setHeadingMenuAnchor(null); }}>
          <ListItemText>Heading 5</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { applyBlockType('h6'); setHeadingMenuAnchor(null); }}>
          <ListItemText>Heading 6</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { applyBlockType('quote'); setHeadingMenuAnchor(null); }}>
          <ListItemText>Quote Block</ListItemText>
        </MenuItem>
      </Menu>

      {/* Font Family Menu */}
      <Tooltip title="Font Family">
        <IconButton 
          size="small" 
          onClick={(e) => setFontMenuAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <FontDownloadIcon />
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={fontMenuAnchor}
        open={Boolean(fontMenuAnchor)}
        onClose={() => setFontMenuAnchor(null)}
      >
        {FONT_FAMILY_OPTIONS.map((font) => (
          <MenuItem 
            key={font.value} 
            onClick={() => { applyFontFamily(font.value); setFontMenuAnchor(null); }}
            sx={{ fontFamily: font.value }}
          >
            <ListItemText>{font.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      <Divider orientation="vertical" flexItem />

      {/* Font Size Controls */}
      {btn('Decrease Font Size', <RemoveIcon />, decreaseFontSize)}
      
      {/* Font Size Dropdown */}
      <Tooltip title="Font Size">
        <IconButton 
          size="small" 
          onClick={(e) => setFontSizeMenuAnchor(e.currentTarget)}
          disabled={disabled}
          sx={{ 
            minWidth: 60, 
            justifyContent: 'space-between',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: 1
          }}
        >
          <Box component="span" sx={{ fontSize: '14px', fontWeight: 'normal' }}>
            {fontSizeInputValue}
          </Box>
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={fontSizeMenuAnchor}
        open={Boolean(fontSizeMenuAnchor)}
        onClose={() => setFontSizeMenuAnchor(null)}
        PaperProps={{
          sx: { 
            maxHeight: 300,
            '& .MuiMenuItem-root': {
              minHeight: 'auto',
              py: 0.5,
              justifyContent: 'center'
            }
          }
        }}
      >
        {FONT_SIZE_OPTIONS.map((size) => (
          <MenuItem 
            key={size} 
            onClick={() => { 
              applyFontSize(size.toString()); 
              setFontSizeMenuAnchor(null); 
            }}
            selected={fontSizeInputValue === size.toString()}
            sx={{ 
              fontSize: `${Math.min(size, 24)}px`,
              fontWeight: fontSizeInputValue === size.toString() ? 'bold' : 'normal'
            }}
          >
            {size}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem>
      <TextField
        size="small"
            placeholder="Custom size"
        value={fontSizeInputValue}
        onChange={(e) => setFontSizeInputValue(e.target.value)}
            onBlur={() => {
              applyFontSize(fontSizeInputValue);
              setFontSizeMenuAnchor(null);
            }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            applyFontSize(fontSizeInputValue);
                setFontSizeMenuAnchor(null);
              }
            }}
            sx={{ width: 80 }}
            inputProps={{ 
              style: { textAlign: 'center' },
              min: 8,
              max: 200,
              type: 'number'
            }}
          />
        </MenuItem>
      </Menu>
      
      {btn('Increase Font Size', <AddIcon />, increaseFontSize)}

      {/* Line Spacing Menu */}
      <Tooltip title="Line Spacing">
        <IconButton 
          size="small" 
          onClick={(e) => setLineSpacingMenuAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <FormatLineSpacingIcon />
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={lineSpacingMenuAnchor}
        open={Boolean(lineSpacingMenuAnchor)}
        onClose={() => setLineSpacingMenuAnchor(null)}
      >
        <MenuItem onClick={() => { 
          applyLineSpacing('1'); 
          setTimeout(() => applyLineSpacingDirect('1'), 100); 
          setLineSpacingMenuAnchor(null); 
        }}>
          <ListItemText>Single</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { 
          applyLineSpacing('1.15'); 
          setTimeout(() => applyLineSpacingDirect('1.15'), 100); 
          setLineSpacingMenuAnchor(null); 
        }}>
          <ListItemText>1.15</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { 
          applyLineSpacing('1.5'); 
          setTimeout(() => applyLineSpacingDirect('1.5'), 100); 
          setLineSpacingMenuAnchor(null); 
        }}>
          <ListItemText>1.5</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { 
          applyLineSpacing('2'); 
          setTimeout(() => applyLineSpacingDirect('2'), 100); 
          setLineSpacingMenuAnchor(null); 
        }}>
          <ListItemText>Double</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { 
          applyLineSpacing('2.5'); 
          setTimeout(() => applyLineSpacingDirect('2.5'), 100); 
          setLineSpacingMenuAnchor(null); 
        }}>
          <ListItemText>2.5</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { 
          applyLineSpacing('3'); 
          setTimeout(() => applyLineSpacingDirect('3'), 100); 
          setLineSpacingMenuAnchor(null); 
        }}>
          <ListItemText>Triple</ListItemText>
        </MenuItem>
      </Menu>

      <Divider orientation="vertical" flexItem />

      {/* Color Tools */}
      <Tooltip title="Text Color">
        <IconButton 
          size="small" 
          onClick={(e) => setColorPickerAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <FormatColorTextIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Background Color">
        <IconButton 
          size="small" 
          onClick={(e) => setBgColorPickerAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <FormatColorFillIcon />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem />

      {/* Alignment Menu */}
      <Tooltip title="Text Alignment">
        <IconButton 
          size="small" 
          onClick={(e) => setAlignMenuAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <FormatAlignLeftIcon />
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={alignMenuAnchor}
        open={Boolean(alignMenuAnchor)}
        onClose={() => setAlignMenuAnchor(null)}
      >
        <MenuItem onClick={() => { setTextAlignment('left'); setAlignMenuAnchor(null); }}>
          <ListItemIcon><FormatAlignLeftIcon /></ListItemIcon>
          <ListItemText>Align Left</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setTextAlignment('center'); setAlignMenuAnchor(null); }}>
          <ListItemIcon><FormatAlignCenterIcon /></ListItemIcon>
          <ListItemText>Align Center</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setTextAlignment('right'); setAlignMenuAnchor(null); }}>
          <ListItemIcon><FormatAlignRightIcon /></ListItemIcon>
          <ListItemText>Align Right</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setTextAlignment('justify'); setAlignMenuAnchor(null); }}>
          <ListItemIcon><FormatAlignJustifyIcon /></ListItemIcon>
          <ListItemText>Justify</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { indentContent(); setAlignMenuAnchor(null); }}>
          <ListItemIcon><FormatIndentIncreaseIcon /></ListItemIcon>
          <ListItemText>Increase Indent</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { outdentContent(); setAlignMenuAnchor(null); }}>
          <ListItemIcon><FormatIndentDecreaseIcon /></ListItemIcon>
          <ListItemText>Decrease Indent</ListItemText>
        </MenuItem>
      </Menu>

      {/* Lists */}
      {btn('Bulleted List', <ListIcon />, () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined))}
      {btn('Numbered List', <FormatListNumberedIcon />, () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined))}

      <Divider orientation="vertical" flexItem />

      {/* Insert Menu */}
      <Tooltip title="Insert">
        <IconButton 
          size="small" 
          onClick={(e) => setInsertMenuAnchor(e.currentTarget)}
          disabled={disabled}
        >
          <AddCircleOutlineIcon />
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={insertMenuAnchor}
        open={Boolean(insertMenuAnchor)}
        onClose={() => setInsertMenuAnchor(null)}
      >
        {onInsertFieldClick && (
          <MenuItem onClick={() => { onInsertFieldClick(); setInsertMenuAnchor(null); }}>
            <ListItemIcon><TextFieldsIcon /></ListItemIcon>
            <ListItemText>Merge Field</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => { toggleLink(); setInsertMenuAnchor(null); }}>
          <ListItemIcon><LinkIcon /></ListItemIcon>
          <ListItemText>Link</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { setImageInsertDialogOpen(true); setInsertMenuAnchor(null); }}>
          <ListItemIcon><ImageIcon /></ListItemIcon>
          <ListItemText>Image</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { insertTable(); setInsertMenuAnchor(null); }}>
          <ListItemIcon><TableChartIcon /></ListItemIcon>
          <ListItemText>Table</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { insertHorizontalRule(); setInsertMenuAnchor(null); }}>
          <ListItemIcon><HorizontalRuleIcon /></ListItemIcon>
          <ListItemText>Horizontal Rule</ListItemText>
        </MenuItem>
      </Menu>

      <Box sx={{ flex: 1 }} />

      {/* Editor Mode Toggle */}
      {onModeChange && (
        <>
          <Divider orientation="vertical" flexItem />
          {btn(
            'Rich Text Editor', 
            <TextFieldsIcon />, 
            () => onModeChange('rich'),
            editorMode === 'rich'
          )}
          {btn(
            'HTML Source', 
            <CodeIcon />, 
            () => onModeChange('html'),
            editorMode === 'html'
          )}
          {btn(
            'Email Preview', 
            <VisibilityIcon />, 
            () => onModeChange('preview'),
            editorMode === 'preview'
          )}
        </>
      )}

      {/* Fullscreen Toggle */}
      {onToggleFullscreen && btn(
        isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen', 
        isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />, 
        onToggleFullscreen
      )}

      {/* Voice to Text */}
      <VoiceToText disabled={disabled} />

      {btn('Clear All', <ClearIcon />, clearAll)}

      {/* Color Pickers */}
      <ColorPicker
        onColorSelect={applyTextColor}
        anchorEl={colorPickerAnchor}
        open={Boolean(colorPickerAnchor)}
        onClose={() => setColorPickerAnchor(null)}
      />
      <ColorPicker
        onColorSelect={applyBackgroundColor}
        anchorEl={bgColorPickerAnchor}
        open={Boolean(bgColorPickerAnchor)}
        onClose={() => setBgColorPickerAnchor(null)}
      />

      {/* Image Insert Options Dialog */}
      <ImageInsertDialog
        open={imageInsertDialogOpen}
        onClose={() => setImageInsertDialogOpen(false)}
        onSelectFromStorage={handleSelectFromStorage}
        onUploadNew={handleUploadImage}
        onEnterLink={handleEnterLink}
      />

      {/* Content Library Dialog */}
      <ContentLibraryDialog
        open={imageLibraryDialogOpen}
        onClose={() => setImageLibraryDialogOpen(false)}
        onSelectImageByUrl={handleImageSelectByUrl}
      />
    </Box>
  );
};

export default Toolbar;
