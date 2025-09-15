import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Bold, Italic, Underline, Strikethrough, Subscript, Superscript } from '@ckeditor/ckeditor5-basic-styles';
import { Link } from '@ckeditor/ckeditor5-link';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { List, TodoList } from '@ckeditor/ckeditor5-list';
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
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List as MuiList, ListItem, ListItemText, Box, Typography } from '@mui/material';

interface CKEditorWithPluginsProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  showTemplateFields?: boolean;
  showEmailTemplates?: boolean;
  disabled?: boolean;
}

const CKEditorWithPlugins: React.FC<CKEditorWithPluginsProps> = ({
  value = '',
  onChange,
  placeholder = "Start typing...",
  height = 400,
  showTemplateFields = true,
  showEmailTemplates = true,
  disabled = false
}) => {
  const [editor, setEditor] = useState<any>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [emailTemplateDialogOpen, setEmailTemplateDialogOpen] = useState(false);
  const [selectedTemplateField, setSelectedTemplateField] = useState<string | null>(null);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<string | null>(null);

  // Email templates
  const emailTemplates = {
    header: `<div class="email-header">
      <h1>Your Company Name</h1>
      <p>Professional Email Header</p>
    </div>`,
    
    body: `<div class="email-container">
      <p>Dear {name},</p>
      <p>We hope this email finds you well. We wanted to reach out to you regarding...</p>
      <p>Please don't hesitate to contact us if you have any questions.</p>
    </div>`,
    
    footer: `<div class="email-footer">
      <p>Best regards,<br>
      Your Name<br>
      Your Company<br>
      Email: your.email@company.com<br>
      Phone: (555) 123-4567</p>
      <p><small>This email was sent to {email}. If you no longer wish to receive these emails, you can <a href="#">unsubscribe</a>.</small></p>
    </div>`,

    newsletter: `<div class="email-container">
      <div class="email-header">
        <h1 style="color: #333; text-align: center;">Monthly Newsletter</h1>
        <p style="text-align: center; color: #666;">Stay updated with our latest news</p>
      </div>
      
      <h2>What's New This Month</h2>
      <p>Here are the highlights from this month...</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 15px; border: 1px solid #ddd; background-color: #f9f9f9;">
            <h3>Feature Update</h3>
            <p>We've added new functionality to improve your experience.</p>
          </td>
        </tr>
      </table>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="#" class="btn btn-primary">Read More</a>
      </div>
    </div>`,

    confirmation: `<div class="email-container">
      <div class="email-header">
        <h1 style="color: #28a745;">Confirmation</h1>
      </div>
      
      <p>Dear {name},</p>
      <p>Thank you for your recent action. This email confirms that we have successfully processed your request.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0;">
        <h3>Details:</h3>
        <ul>
          <li>Date: {date}</li>
          <li>Time: {time}</li>
          <li>Reference: {reference}</li>
        </ul>
      </div>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
    </div>`
  };

  // Template fields
  const templateFields = [
    { key: 'name', label: 'Name', description: 'Recipient\'s name' },
    { key: 'email', label: 'Email', description: 'Recipient\'s email address' },
    { key: 'date', label: 'Date', description: 'Current date' },
    { key: 'time', label: 'Time', description: 'Current time' },
    { key: 'company', label: 'Company', description: 'Company name' },
    { key: 'greeting', label: 'Greeting', description: 'Personalized greeting' },
    { key: 'signature', label: 'Signature', description: 'Email signature' },
    { key: 'reference', label: 'Reference', description: 'Reference number' },
    { key: 'unsubscribe', label: 'Unsubscribe', description: 'Unsubscribe link' }
  ];

  // Insert template field at cursor position
  const insertTemplateField = (field: string) => {
    if (editor) {
      editor.model.change((writer: any) => {
        const insertPosition = editor.model.document.selection.getFirstPosition();
        writer.insertText(`{${field}}`, insertPosition);
      });
    }
  };

  // Insert email template
  const insertEmailTemplate = (templateKey: string) => {
    if (editor && emailTemplates[templateKey as keyof typeof emailTemplates]) {
      const template = emailTemplates[templateKey as keyof typeof emailTemplates];
      editor.setData(template);
      if (onChange) {
        onChange(template);
      }
    }
  };

  // Custom editor configuration
  const editorConfig = {
    plugins: [
      Essentials,
      Bold, Italic, Underline, Strikethrough, Subscript, Superscript,
      Link,
      Paragraph,
      Heading,
      List, TodoList,
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
      columns: 5,
      documentColors: 10,
      colorPicker: { format: 'hex' }
    },
    fontBackgroundColor: {
      colors: [
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
      columns: 5,
      documentColors: 10,
      colorPicker: { format: 'hex' }
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
        { name: 'resizeImage:original', label: 'Original', value: null },
        { name: 'resizeImage:25', label: '25%', value: '25' },
        { name: 'resizeImage:50', label: '50%', value: '50' },
        { name: 'resizeImage:75', label: '75%', value: '75' }
      ]
    },
    link: {
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: { download: 'file' }
        },
        openInNewTab: {
          mode: 'manual',
          label: 'Open in a new tab',
          attributes: { target: '_blank', rel: 'noopener noreferrer' }
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
          .line-height-single { line-height: 1.0 !important; }
          .line-height-115 { line-height: 1.15 !important; }
          .line-height-150 { line-height: 1.5 !important; }
          .line-height-double { line-height: 2.0 !important; }
          
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
          .marker-yellow { background-color: yellow; }
          .marker-green { background-color: #90EE90; }
          .marker-pink { background-color: #FFB6C1; }
          .marker-blue { background-color: #ADD8E6; }
          .pen-red { color: red; background-color: transparent; }
          .pen-green { color: green; background-color: transparent; }
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
      </Box>

      {/* CKEditor */}
      <CKEditor
        editor={ClassicEditor}
        config={editorConfig}
        data={value}
        disabled={disabled}
        onReady={(editor) => {
          setEditor(editor);
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          if (onChange) {
            onChange(data);
          }
        }}
      />

      {/* Template Field Dialog */}
      <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Insert Template Field</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select a template field to insert into your email:
          </Typography>
          <MuiList>
            {templateFields.map((field) => (
              <ListItem 
                key={field.key}
                button 
                onClick={() => {
                  insertTemplateField(field.key);
                  setTemplateDialogOpen(false);
                }}
              >
                <ListItemText 
                  primary={field.label}
                  secondary={field.description}
                />
              </ListItem>
            ))}
          </MuiList>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Email Template Dialog */}
      <Dialog open={emailTemplateDialogOpen} onClose={() => setEmailTemplateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Insert Email Template</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select an email template to use as a starting point:
          </Typography>
          <MuiList>
            <ListItem 
              button 
              onClick={() => {
                insertEmailTemplate('header');
                setEmailTemplateDialogOpen(false);
              }}
            >
              <ListItemText 
                primary="Header"
                secondary="Professional email header with company branding"
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => {
                insertEmailTemplate('body');
                setEmailTemplateDialogOpen(false);
              }}
            >
              <ListItemText 
                primary="Basic Email Body"
                secondary="Standard email body with greeting and closing"
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => {
                insertEmailTemplate('footer');
                setEmailTemplateDialogOpen(false);
              }}
            >
              <ListItemText 
                primary="Footer"
                secondary="Professional email footer with contact information"
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => {
                insertEmailTemplate('newsletter');
                setEmailTemplateDialogOpen(false);
              }}
            >
              <ListItemText 
                primary="Newsletter"
                secondary="Complete newsletter template with sections"
              />
            </ListItem>
            <ListItem 
              button 
              onClick={() => {
                insertEmailTemplate('confirmation');
                setEmailTemplateDialogOpen(false);
              }}
            >
              <ListItemText 
                primary="Confirmation"
                secondary="Confirmation email with details section"
              />
            </ListItem>
          </MuiList>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailTemplateDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CKEditorWithPlugins; 