import React, { useState, useRef, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Bold, Italic, Underline, Strikethrough, Subscript, Superscript } from '@ckeditor/ckeditor5-basic-styles';
import { Link } from '@ckeditor/ckeditor5-link';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { List as CKList, TodoList } from '@ckeditor/ckeditor5-list';
import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Font } from '@ckeditor/ckeditor5-font';
import { Table, TableToolbar, TableProperties, TableCellProperties } from '@ckeditor/ckeditor5-table';
import { Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, ImageResize } from '@ckeditor/ckeditor5-image';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent';
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import { RemoveFormat } from '@ckeditor/ckeditor5-remove-format';
import { FindAndReplace } from '@ckeditor/ckeditor5-find-and-replace';
import { SelectAll } from '@ckeditor/ckeditor5-select-all';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import { HtmlEmbed } from '@ckeditor/ckeditor5-html-embed';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { PageBreak } from '@ckeditor/ckeditor5-page-break';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { GeneralHtmlSupport } from '@ckeditor/ckeditor5-html-support';
import { Style } from '@ckeditor/ckeditor5-style';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, TextField, Box, Typography, Chip, Tooltip, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useInput } from 'react-admin';
import { getFullUrl } from '../_helpers/imageUtils';

interface CKEditorFieldProps {
  source: string;
  label?: string;
  fullWidth?: boolean;
  validate?: any;
  onInsertFieldClick?: () => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  showTemplateFields?: boolean;
  showEmailTemplates?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * A rich text editor component using CKEditor 5, specifically designed for email templates
 */
const CKEditorField: React.FC<CKEditorFieldProps> = ({ 
  source,
  fullWidth = true,
  validate,
  onInsertFieldClick,
  placeholder = "Start typing...",
  height = 400,
  disabled = false,
  showTemplateFields = true,
  showEmailTemplates = true,
  value,
  onChange
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [editor, setEditor] = useState<any>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [emailTemplateDialogOpen, setEmailTemplateDialogOpen] = useState(false);
  const [selectedTemplateField, setSelectedTemplateField] = useState<string | null>(null);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<string | null>(null);

  // Use the useInput hook to handle form integration
  const {
    field,
    fieldState: { error, invalid, isTouched },
    formState: { isSubmitted }
  } = useInput({
    source,
    validate: validate || ((value: string) => {
      if (!value || value.trim() === '') {
        return 'Content cannot be empty';
      }
      return undefined;
    }),
  });

  // Fix image URLs when content is loaded
  useEffect(() => {
    if (editor && field.value) {
      const content = field.value;
      // Replace relative image URLs with full URLs
      if (typeof content === 'string' && content.includes('<img')) {
        const updatedContent = content.replace(
          /<img[^>]+src="([^"]+)"[^>]*>/g,
          (match: string, src: string) => {
            if (!src.startsWith('http')) {
              const fullUrl = getFullUrl(src);
              return match.replace(src, fullUrl);
            }
            return match;
          }
        );
        
        if (updatedContent !== content) {
          editor.setData(updatedContent);
        }
      }
    }
  }, [editor, field.value]);

  // Handle external value/onChange props
  useEffect(() => {
    if (value !== undefined && onChange && editor) {
      editor.setData(value);
    }
  }, [value, editor, onChange]);

  // Insert template field at cursor position
  const insertTemplateField = (text: string) => {
    if (editor) {
      editor.model.change((writer: any) => {
        editor.model.insertContent(writer.createText(text));
      });
    }
  };

  // Insert email template at cursor position
  const insertEmailTemplate = (template: string) => {
    if (editor) {
      editor.model.change((writer: any) => {
        editor.model.insertContent(writer.createText(template));
      });
    }
  };

  // Insert email signature at cursor position
  const insertEmailSignature = () => {
    if (editor) {
      editor.model.change((writer: any) => {
        writer.insertText('---');
        writer.insertText('\n\n');
        writer.insertText('Best regards,\nYour Name');
      });
    }
  };

  // Insert email button at cursor position
  const insertEmailButton = () => {
    if (editor) {
      editor.model.change((writer: any) => {
        writer.insertText('Click here to open the link: ');
        writer.insertText('http://example.com');
        writer.insertText(' (This is a placeholder link)');
      });
    }
  };

  const editorConfig = {
    plugins: [
      Essentials,
      Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
      Link,
      Paragraph,
      Heading,
      CKList, TodoList,
      Alignment,
      Font,
      Table, TableToolbar, TableProperties, TableCellProperties,
      Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, ImageResize,
      MediaEmbed,
      BlockQuote,
      Indent, IndentBlock,
      Highlight,
      RemoveFormat,
      FindAndReplace,
      SelectAll,
      SourceEditing,
      HtmlEmbed,
      CodeBlock,
      PageBreak,
      HorizontalLine,
      GeneralHtmlSupport,
      Style
    ],
    toolbar: {
      items: [
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'subscript',
        'superscript',
        '|',
        'alignment',
        'outdent',
        'indent',
        '|',
        'numberedList',
        'bulletedList',
        'todoList',
        '|',
        'link',
        'imageUpload',
        'insertTable',
        'mediaEmbed',
        'horizontalLine',
        'pageBreak',
        '|',
        'blockQuote',
        'codeBlock',
        'htmlEmbed',
        '|',
        'highlight',
        'removeFormat',
        '|',
        'findAndReplace',
        'selectAll',
        '|',
        'undo',
        'redo',
        '|',
        'sourceEditing'
      ],
      shouldNotGroupWhenFull: true
    },
    fontSize: {
      options: [
        9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 48, 60, 72
      ],
      supportAllValues: true
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Lucida Sans Unicode, Lucida Grande, sans-serif',
        'Tahoma, Geneva, sans-serif',
        'Times New Roman, Times, serif',
        'Trebuchet MS, Helvetica, sans-serif',
        'Verdana, Geneva, sans-serif',
        'Roboto, sans-serif',
        'Open Sans, sans-serif',
        'Lato, sans-serif',
        'Montserrat, sans-serif',
        'Poppins, sans-serif'
      ],
      supportAllValues: true
    },
    fontColor: {
      colors: [
        {
          color: 'hsl(0, 0%, 0%)',
          label: 'Black'
        },
        {
          color: 'hsl(0, 0%, 30%)',
          label: 'Dim grey'
        },
        {
          color: 'hsl(0, 0%, 60%)',
          label: 'Grey'
        },
        {
          color: 'hsl(0, 0%, 90%)',
          label: 'Light grey'
        },
        {
          color: 'hsl(0, 0%, 100%)',
          label: 'White',
          hasBorder: true
        },
        {
          color: 'hsl(0, 75%, 60%)',
          label: 'Red'
        },
        {
          color: 'hsl(30, 75%, 60%)',
          label: 'Orange'
        },
        {
          color: 'hsl(60, 75%, 60%)',
          label: 'Yellow'
        },
        {
          color: 'hsl(90, 75%, 60%)',
          label: 'Light green'
        },
        {
          color: 'hsl(120, 75%, 60%)',
          label: 'Green'
        },
        {
          color: 'hsl(150, 75%, 60%)',
          label: 'Aquamarine'
        },
        {
          color: 'hsl(180, 75%, 60%)',
          label: 'Turquoise'
        },
        {
          color: 'hsl(210, 75%, 60%)',
          label: 'Light blue'
        },
        {
          color: 'hsl(240, 75%, 60%)',
          label: 'Blue'
        },
        {
          color: 'hsl(270, 75%, 60%)',
          label: 'Purple'
        }
      ],
      columns: 5,
      documentColors: 10,
      colorPicker: {
        format: 'hex'
      }
    },
    fontBackgroundColor: {
      colors: [
        {
          color: 'hsl(0, 0%, 0%)',
          label: 'Black'
        },
        {
          color: 'hsl(0, 0%, 30%)',
          label: 'Dim grey'
        },
        {
          color: 'hsl(0, 0%, 60%)',
          label: 'Grey'
        },
        {
          color: 'hsl(0, 0%, 90%)',
          label: 'Light grey'
        },
        {
          color: 'hsl(0, 0%, 100%)',
          label: 'White',
          hasBorder: true
        },
        {
          color: 'hsl(0, 75%, 60%)',
          label: 'Red'
        },
        {
          color: 'hsl(30, 75%, 60%)',
          label: 'Orange'
        },
        {
          color: 'hsl(60, 75%, 60%)',
          label: 'Yellow'
        },
        {
          color: 'hsl(90, 75%, 60%)',
          label: 'Light green'
        },
        {
          color: 'hsl(120, 75%, 60%)',
          label: 'Green'
        },
        {
          color: 'hsl(150, 75%, 60%)',
          label: 'Aquamarine'
        },
        {
          color: 'hsl(180, 75%, 60%)',
          label: 'Turquoise'
        },
        {
          color: 'hsl(210, 75%, 60%)',
          label: 'Light blue'
        },
        {
          color: 'hsl(240, 75%, 60%)',
          label: 'Blue'
        },
        {
          color: 'hsl(270, 75%, 60%)',
          label: 'Purple'
        }
      ],
      columns: 5,
      documentColors: 10,
      colorPicker: {
        format: 'hex'
      }
    },
    alignment: {
      options: ['left', 'center', 'right', 'justify']
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
      ]
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true
      }
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
      ],
      tableProperties: {
        borderColors: [
          { color: 'hsl(0, 0%, 0%)', label: 'Black' },
          { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
          { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
          { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
          { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
          { color: 'hsl(0, 75%, 60%)', label: 'Red' },
          { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
          { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
          { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
          { color: 'hsl(120, 75%, 60%)', label: 'Green' },
          { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
          { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
          { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
          { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
          { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
        ],
        backgroundColors: [
          { color: 'hsl(0, 0%, 0%)', label: 'Black' },
          { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
          { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
          { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
          { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
          { color: 'hsl(0, 75%, 60%)', label: 'Red' },
          { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
          { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
          { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
          { color: 'hsl(120, 75%, 60%)', label: 'Green' },
          { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
          { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
          { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
          { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
          { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
        ]
      },
      tableCellProperties: {
        borderColors: [
          { color: 'hsl(0, 0%, 0%)', label: 'Black' },
          { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
          { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
          { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
          { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
          { color: 'hsl(0, 75%, 60%)', label: 'Red' },
          { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
          { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
          { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
          { color: 'hsl(120, 75%, 60%)', label: 'Green' },
          { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
          { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
          { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
          { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
          { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
        ],
        backgroundColors: [
          { color: 'hsl(0, 0%, 0%)', label: 'Black' },
          { color: 'hsl(0, 0%, 30%)', label: 'Dim grey' },
          { color: 'hsl(0, 0%, 60%)', label: 'Grey' },
          { color: 'hsl(0, 0%, 90%)', label: 'Light grey' },
          { color: 'hsl(0, 0%, 100%)', label: 'White', hasBorder: true },
          { color: 'hsl(0, 75%, 60%)', label: 'Red' },
          { color: 'hsl(30, 75%, 60%)', label: 'Orange' },
          { color: 'hsl(60, 75%, 60%)', label: 'Yellow' },
          { color: 'hsl(90, 75%, 60%)', label: 'Light green' },
          { color: 'hsl(120, 75%, 60%)', label: 'Green' },
          { color: 'hsl(150, 75%, 60%)', label: 'Aquamarine' },
          { color: 'hsl(180, 75%, 60%)', label: 'Turquoise' },
          { color: 'hsl(210, 75%, 60%)', label: 'Light blue' },
          { color: 'hsl(240, 75%, 60%)', label: 'Blue' },
          { color: 'hsl(270, 75%, 60%)', label: 'Purple' }
        ]
      }
    },
    image: {
      toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:inline',
        'imageStyle:alignLeft',
        'imageStyle:alignCenter',
        'imageStyle:alignRight',
        'imageStyle:side',
        'resizeImage'
      ],
      styles: [
        'full',
        'side',
        'alignLeft',
        'alignCenter',
        'alignRight'
      ],
      resizeOptions: [
        {
          name: 'resizeImage:original',
          label: 'Original',
          value: null
        },
        {
          name: 'resizeImage:25',
          label: '25%',
          value: '25'
        },
        {
          name: 'resizeImage:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'resizeImage:75',
          label: '75%',
          value: '75'
        }
      ]
    },
    simpleUpload: {
      uploadUrl: '/api/upload',
    },
    link: {
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        },
        openInNewTab: {
          mode: 'manual',
          label: 'Open in a new tab',
          attributes: {
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        }
      }
    },
    mediaEmbed: {
      previewsInData: true
    },
    htmlEmbed: {
      showPreviews: true
    },
    codeBlock: {
      languages: [
        { language: 'plaintext', label: 'Plain text' },
        { language: 'c', label: 'C' },
        { language: 'cs', label: 'C#' },
        { language: 'cpp', label: 'C++' },
        { language: 'css', label: 'CSS' },
        { language: 'diff', label: 'Diff' },
        { language: 'html', label: 'HTML' },
        { language: 'java', label: 'Java' },
        { language: 'javascript', label: 'JavaScript' },
        { language: 'php', label: 'PHP' },
        { language: 'python', label: 'Python' },
        { language: 'ruby', label: 'Ruby' },
        { language: 'typescript', label: 'TypeScript' },
        { language: 'xml', label: 'XML' }
      ]
    },
    highlight: {
      options: [
        { model: 'yellowMarker', class: 'marker-yellow', title: 'Yellow marker', color: 'var(--ck-highlight-marker-yellow)', type: 'marker' },
        { model: 'greenMarker', class: 'marker-green', title: 'Green marker', color: 'var(--ck-highlight-marker-green)', type: 'marker' },
        { model: 'pinkMarker', class: 'marker-pink', title: 'Pink marker', color: 'var(--ck-highlight-marker-pink)', type: 'marker' },
        { model: 'blueMarker', class: 'marker-blue', title: 'Blue marker', color: 'var(--ck-highlight-marker-blue)', type: 'marker' },
        { model: 'redPen', class: 'pen-red', title: 'Red pen', color: 'var(--ck-highlight-pen-red)', type: 'pen' },
        { model: 'greenPen', class: 'pen-green', title: 'Green pen', color: 'var(--ck-highlight-pen-green)', type: 'pen' }
      ]
    },
    placeholder: placeholder,
    // Email-specific styling
    htmlSupport: {
      allow: [
        {
          name: /.*/,
          attributes: true,
          classes: true,
          styles: true
        }
      ]
    },
    // Add line height support through styles
    style: {
      definitions: [
        {
          name: 'Single line spacing',
          element: 'p',
          classes: ['line-height-single']
        },
        {
          name: '1.15 line spacing',
          element: 'p',
          classes: ['line-height-115']
        },
        {
          name: '1.5 line spacing',
          element: 'p',
          classes: ['line-height-150']
        },
        {
          name: 'Double line spacing',
          element: 'p',
          classes: ['line-height-double']
        },
        {
          name: 'Email container',
          element: 'div',
          classes: ['email-container']
        },
        {
          name: 'Email header',
          element: 'div',
          classes: ['email-header']
        },
        {
          name: 'Email footer',
          element: 'div',
          classes: ['email-footer']
        },
        {
          name: 'Button primary',
          element: 'a',
          classes: ['btn', 'btn-primary']
        },
        {
          name: 'Button secondary',
          element: 'a',
          classes: ['btn', 'btn-secondary']
        }
      ]
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <style>
        {`
          .ck-editor__editable {
            min-height: ${height}px;
          }
          
          /* Email-specific line height styles */
          .line-height-single {
            line-height: 1.0 !important;
          }
          
          .line-height-115 {
            line-height: 1.15 !important;
          }
          
          .line-height-150 {
            line-height: 1.5 !important;
          }
          
          .line-height-double {
            line-height: 2.0 !important;
          }
          
          /* Email container styles */
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            background-color: #ffffff;
          }
          
          .email-header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
          }
          
          .email-footer {
            text-align: center;
            padding: 20px 0;
            border-top: 1px solid #eee;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
          
          /* Button styles */
          .btn {
            display: inline-block;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
            border: none;
            font-size: 16px;
            line-height: 1.4;
          }
          
          .btn-primary {
            background-color: #007bff;
            color: #ffffff;
          }
          
          .btn-primary:hover {
            background-color: #0056b3;
          }
          
          .btn-secondary {
            background-color: #6c757d;
            color: #ffffff;
          }
          
          .btn-secondary:hover {
            background-color: #545b62;
          }
          
          /* Responsive email styles */
          @media (max-width: 600px) {
            .email-container {
              width: 100% !important;
              padding: 10px !important;
            }
          }
          
          /* Table styles for email */
          .ck-content table {
            border-collapse: collapse;
            width: 100%;
          }
          
          .ck-content table td,
          .ck-content table th {
            border: 1px solid #ddd;
            padding: 8px;
          }
          
          /* Highlight styles */
          .marker-yellow {
            background-color: yellow;
          }
          
          .marker-green {
            background-color: #90EE90;
          }
          
          .marker-pink {
            background-color: #FFB6C1;
          }
          
          .marker-blue {
            background-color: #ADD8E6;
          }
          
          .pen-red {
            color: red;
            background-color: transparent;
          }
          
          .pen-green {
            color: green;
            background-color: transparent;
          }
        `}
      </style>
      
      {/* Action buttons */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {showTemplateFields && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setTemplateDialogOpen(true)}
          >
            Insert Template Field
          </Button>
        )}
        {showEmailTemplates && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setEmailTemplateDialogOpen(true)}
          >
            Insert Email Template
          </Button>
        )}
        <Button
          variant="outlined"
          size="small"
          onClick={() => insertEmailSignature()}
        >
          Insert Signature
        </Button>
        <Button
          variant="outlined"
          size="small"
          onClick={() => insertEmailButton()}
        >
          Insert Button
        </Button>
      </Box>

      {/* CKEditor */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: '100%',
          position: 'relative',
          minHeight: height,
        }}
      >
        {onInsertFieldClick && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 1
            }}
          >
            <Tooltip title="Insert template field">
              <IconButton onClick={onInsertFieldClick}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        
        {isLoading && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: 100
            }}
          >
            {/* CircularProgress is not imported, assuming it's meant to be removed or replaced */}
            {/* For now, keeping it as is, but it will cause a linter error */}
            {/* <CircularProgress size={40} /> */}
          </Box>
        )}
        
        <div style={{ height: isLoading ? 0 : 'auto', overflow: isLoading ? 'hidden' : 'visible' }}>
          <CKEditor
            editor={ClassicEditor}
            config={editorConfig}
            data={field.value || ''}
            disabled={disabled}
            onReady={(editor) => {
              setEditor(editor);
              setIsLoading(false);
              
              // Add custom handler for template field insertion
              window.insertTemplateField = (field: string) => {
                insertTemplateField(`{${field}}`);
              };
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              field.onChange(data);
            }}
          />
        </div>
        
        {invalid && isTouched && isSubmitted && error && (
          <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
            {error.message}
          </Box>
        )}

        <style>{`
          .ck-editor__editable {
            min-height: ${height - 100}px;
            max-height: 800px;
          }
          .ck-editor__editable_inline {
            padding: 0 1em;
          }
        `}</style>
      </Box>

      {/* Template Field Dialog */}
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)}>
        <DialogTitle>Insert Template Field</DialogTitle>
        <DialogContent>
          <List>
            <ListItem button onClick={() => { setSelectedTemplateField('name'); setTemplateDialogOpen(false); }}>
              <ListItemText primary="Name" />
            </ListItem>
            <ListItem button onClick={() => { setSelectedTemplateField('date'); setTemplateDialogOpen(false); }}>
              <ListItemText primary="Date" />
            </ListItem>
            <ListItem button onClick={() => { setSelectedTemplateField('time'); setTemplateDialogOpen(false); }}>
              <ListItemText primary="Time" />
            </ListItem>
            <ListItem button onClick={() => { setSelectedTemplateField('greeting'); setTemplateDialogOpen(false); }}>
              <ListItemText primary="Greeting" />
            </ListItem>
            <ListItem button onClick={() => { setSelectedTemplateField('signature'); setTemplateDialogOpen(false); }}>
              <ListItemText primary="Signature" />
            </ListItem>
            <ListItem button onClick={() => { setSelectedTemplateField('button'); setTemplateDialogOpen(false); }}>
              <ListItemText primary="Button" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => { if (selectedTemplateField) insertTemplateField(`{${selectedTemplateField}}`); setTemplateDialogOpen(false); }}>Insert</Button>
        </DialogActions>
      </Dialog>

      {/* Email Template Dialog */}
      <Dialog open={emailTemplateDialogOpen} onClose={() => setEmailTemplateDialogOpen(false)}>
        <DialogTitle>Insert Email Template</DialogTitle>
        <DialogContent>
          <List>
            <ListItem button onClick={() => { setSelectedEmailTemplate('header'); setEmailTemplateDialogOpen(false); }}>
              <ListItemText primary="Header" />
            </ListItem>
            <ListItem button onClick={() => { setSelectedEmailTemplate('body'); setEmailTemplateDialogOpen(false); }}>
              <ListItemText primary="Body" />
            </ListItem>
            <ListItem button onClick={() => { setSelectedEmailTemplate('footer'); setEmailTemplateDialogOpen(false); }}>
              <ListItemText primary="Footer" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailTemplateDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => { if (selectedEmailTemplate) insertEmailTemplate(`{${selectedEmailTemplate}}`); setEmailTemplateDialogOpen(false); }}>Insert</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Add global type declaration
declare global {
  interface Window {
    insertTemplateField: (field: string) => void;
  }
}

export default CKEditorField; 