import React, { useMemo, useState, useCallback } from 'react';
import { Box, Paper, Dialog, DialogContent, IconButton, TextField, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useInput } from 'react-admin';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HashtagNode } from '@lexical/hashtag';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HtmlSyncPlugin, ImageNode, MergeTagPlugin, Placeholder, Toolbar } from './components';


type LexicalEditorProps = {
  source: string;
  label?: string;
  fullWidth?: boolean;
  validate?: any;
  onInsertFieldClick?: () => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
};

const LexicalEditor: React.FC<LexicalEditorProps> = ({
  source,
  fullWidth = true,
  validate,
  onInsertFieldClick,
  placeholder,
  height = 400,
  disabled = false,
}) => {
  const {
    field,
    fieldState: { error, invalid, isTouched },
    formState: { isSubmitted },
  } = useInput({ source, validate });

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Editor mode state: 'rich' | 'html' | 'preview'
  const [editorMode, setEditorMode] = useState<'rich' | 'html' | 'preview'>('rich');
  
  // HTML source state for direct editing
  const [htmlSource, setHtmlSource] = useState<string>('');

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  // Sync HTML source when switching to HTML mode
  const handleModeChange = useCallback((newMode: 'rich' | 'html' | 'preview') => {
    if (newMode === 'html' && editorMode !== 'html') {
      setHtmlSource(field.value || '');
    } else if (editorMode === 'html' && newMode !== 'html') {
      // Save HTML changes back to field when leaving HTML mode
      field.onChange(htmlSource);
    }
    setEditorMode(newMode);
  }, [editorMode, field, htmlSource]);

  // Handle HTML source changes
  const handleHtmlSourceChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlSource(event.target.value);
  }, []);

  // Handle HTML paste and apply to editor
  const handleHtmlPaste = useCallback(() => {
    field.onChange(htmlSource);
    setEditorMode('rich');
  }, [field, htmlSource]);

  const initialConfig = useMemo(
    () => ({
      namespace: 'CIWebLexicalEditor',
      theme: {
        text: {
          bold: 'lexical-bold',
          italic: 'lexical-italic',
          underline: 'lexical-underline',
          strikethrough: 'lexical-strikethrough',
          subscript: 'lexical-subscript',
          superscript: 'lexical-superscript',
          code: 'lexical-inline-code',
        },
        quote: 'lexical-quote',
        heading: {
          h1: 'lexical-h1',
          h2: 'lexical-h2',
          h3: 'lexical-h3',
          h4: 'lexical-h4',
          h5: 'lexical-h5',
          h6: 'lexical-h6',
        },
        list: {
          ul: 'lexical-ul',
          ol: 'lexical-ol',
          listitem: 'lexical-li',
          nested: {
            listitem: 'lexical-nested-listitem',
          },
          checklist: 'lexical-checklist',
        },
        link: 'lexical-link',
        code: 'lexical-code-block',
        codeHighlight: {
          atrule: 'lexical-token-atrule',
          attr: 'lexical-token-attr',
          boolean: 'lexical-token-boolean',
          builtin: 'lexical-token-builtin',
          cdata: 'lexical-token-cdata',
          char: 'lexical-token-char',
          class: 'lexical-token-class',
          'class-name': 'lexical-token-class-name',
          comment: 'lexical-token-comment',
          constant: 'lexical-token-constant',
          deleted: 'lexical-token-deleted',
          doctype: 'lexical-token-doctype',
          entity: 'lexical-token-entity',
          function: 'lexical-token-function',
          important: 'lexical-token-important',
          inserted: 'lexical-token-inserted',
          keyword: 'lexical-token-keyword',
          namespace: 'lexical-token-namespace',
          number: 'lexical-token-number',
          operator: 'lexical-token-operator',
          prolog: 'lexical-token-prolog',
          property: 'lexical-token-property',
          punctuation: 'lexical-token-punctuation',
          regex: 'lexical-token-regex',
          selector: 'lexical-token-selector',
          string: 'lexical-token-string',
          symbol: 'lexical-token-symbol',
          tag: 'lexical-token-tag',
          url: 'lexical-token-url',
          variable: 'lexical-token-variable',
        },
        table: 'lexical-table',
        tableCell: 'lexical-table-cell',
        tableCellHeader: 'lexical-table-cell-header',
        hashtag: 'lexical-hashtag',
        hr: 'lexical-hr',
        paragraph: 'lexical-paragraph',
      },
      onError: (e: any) => console.error('Lexical error:', e),
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        CodeNode,
        CodeHighlightNode,
        HashtagNode,
        TableNode,
        TableRowNode,
        TableCellNode,
        HorizontalRuleNode,
        ImageNode,
      ],
      editable: !disabled,
    }),
    [disabled]
  );

  // Single editor content - we'll move this outside to avoid dual instances
  const editorContent = useMemo(() => (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar 
        onInsertFieldClick={onInsertFieldClick} 
        disabled={disabled} 
        field={field}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        editorMode={editorMode}
        onModeChange={handleModeChange}
      />

      <Box sx={{ position: 'relative' }}>
        {editorMode === 'rich' && (
          <>
            <RichTextPlugin
              contentEditable={
                // @ts-ignore mismatched React types across workspace packages
                <ContentEditable
                  onFocus={() => {
                    const evt = new CustomEvent('setActiveField', { detail: { field: source } });
                    window.dispatchEvent(evt);
                  }}
                  style={{
                    minHeight: isFullscreen ? 'calc(100vh - 200px)' : height,
                    padding: 12,
                    outline: 'none',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontSize: 14,
                  }}
                />
              }
              placeholder={<Placeholder text={placeholder} />}
              ErrorBoundary={LexicalErrorBoundary}
            />

            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <HashtagPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <TablePlugin />
            <MergeTagPlugin fieldName={source} />
            <HtmlSyncPlugin value={field.value as string} onChangeHTML={html => field.onChange(html)} />
          </>
        )}

        {editorMode === 'html' && (
          <Box sx={{ p: 2 }}>
            <TextField
              multiline
              fullWidth
              value={htmlSource}
              onChange={handleHtmlSourceChange}
              placeholder="Enter or paste HTML content here..."
              minRows={isFullscreen ? 30 : 15}
              maxRows={isFullscreen ? 50 : 25}
              sx={{
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  lineHeight: 1.4,
                },
              }}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleHtmlPaste}
                disabled={!htmlSource.trim()}
              >
                Apply HTML
              </Button>
              <Button
                variant="outlined"
                onClick={() => setHtmlSource(field.value || '')}
              >
                Reset to Current
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigator.clipboard.writeText(htmlSource)}
              >
                Copy HTML
              </Button>
            </Box>
          </Box>
        )}

        {editorMode === 'preview' && (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Email Preview
            </Typography>
            <Paper 
              sx={{ 
                p: 3, 
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                minHeight: isFullscreen ? 'calc(100vh - 300px)' : height - 100,
                maxWidth: '600px',
                mx: 'auto',
                '& *': {
                  fontFamily: 'Arial, sans-serif !important',
                },
                '& p': {
                  margin: '0 0 16px 0',
                },
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  margin: '0 0 16px 0',
                },
                '& ul, & ol': {
                  margin: '0 0 16px 0',
                  paddingLeft: '20px',
                },
                '& blockquote': {
                  margin: '0 0 16px 20px',
                  paddingLeft: '10px',
                  borderLeft: '3px solid #ccc',
                  fontStyle: 'italic',
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                },
              }}
              dangerouslySetInnerHTML={{ __html: field.value || '<p>No content to preview</p>' }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              This preview shows how your content will appear in email clients with basic HTML styling.
            </Typography>
          </Box>
        )}
      </Box>
    </LexicalComposer>
  ), [initialConfig, onInsertFieldClick, disabled, field, toggleFullscreen, isFullscreen, source, height, placeholder, editorMode, handleModeChange, htmlSource, handleHtmlSourceChange, handleHtmlPaste]);

  if (isFullscreen) {
    return (
      <Dialog
        open={isFullscreen}
        onClose={exitFullscreen}
        maxWidth={false as any}
        fullWidth
        PaperProps={{
          sx: {
            width: '100vw',
            height: '100vh',
            maxWidth: 'none',
            maxHeight: 'none',
            margin: 0,
            borderRadius: 0,
            '& .lexical-bold': { fontWeight: 'bold' },
            '& .lexical-italic': { fontStyle: 'italic' },
            '& .lexical-underline': { textDecoration: 'underline' },
            '& .lexical-strikethrough': { textDecoration: 'line-through' },
            '& .lexical-subscript': { fontSize: '0.8em', verticalAlign: 'sub' },
            '& .lexical-superscript': { fontSize: '0.8em', verticalAlign: 'super' },
            '& .lexical-inline-code': { 
              backgroundColor: theme => theme.palette.grey[100],
              padding: '2px 4px',
              borderRadius: '3px',
              fontSize: '0.9em',
              fontFamily: 'monospace'
            },
            '& .lexical-quote': {
              borderLeft: theme => `4px solid ${theme.palette.primary.main}`,
              paddingLeft: theme => theme.spacing(2),
              margin: theme => `${theme.spacing(1)} 0`,
              fontStyle: 'italic',
              backgroundColor: theme => theme.palette.grey[50]
            },
            '& .lexical-h1': { fontSize: '2rem', fontWeight: 'bold', margin: '0.5em 0' },
            '& .lexical-h2': { fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5em 0' },
            '& .lexical-h3': { fontSize: '1.25rem', fontWeight: 'bold', margin: '0.5em 0' },
            '& .lexical-h4': { fontSize: '1.125rem', fontWeight: 'bold', margin: '0.5em 0' },
            '& .lexical-h5': { fontSize: '1rem', fontWeight: 'bold', margin: '0.5em 0' },
            '& .lexical-h6': { fontSize: '0.875rem', fontWeight: 'bold', margin: '0.5em 0' },
            '& .lexical-ul, & .lexical-ol': { paddingLeft: '1.5em' },
            '& .lexical-li': { margin: '0.25em 0' },
            '& .lexical-link': { 
              color: theme => theme.palette.primary.main, 
              textDecoration: 'underline',
              cursor: 'pointer'
            },
            '& .lexical-code-block': {
              backgroundColor: theme => theme.palette.grey[100],
              padding: theme => theme.spacing(1),
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.9em',
              margin: theme => `${theme.spacing(1)} 0`,
              border: theme => `1px solid ${theme.palette.grey[300]}`
            },
            '& .lexical-table': {
              borderCollapse: 'collapse',
              width: '100%',
              margin: theme => `${theme.spacing(1)} 0`
            },
            '& .lexical-table-cell': {
              border: theme => `1px solid ${theme.palette.grey[300]}`,
              padding: theme => theme.spacing(1),
              minWidth: '50px'
            },
            '& .lexical-table-cell-header': {
              border: theme => `1px solid ${theme.palette.grey[300]}`,
              padding: theme => theme.spacing(1),
              backgroundColor: theme => theme.palette.grey[100],
              fontWeight: 'bold'
            },
            '& .lexical-hashtag': { 
              color: theme => theme.palette.primary.main,
              fontWeight: 'bold'
            },
            '& .lexical-hr': {
              border: 'none',
              borderTop: theme => `2px solid ${theme.palette.grey[300]}`,
              margin: theme => `${theme.spacing(2)} 0`
            },
            '& .lexical-paragraph': { margin: '0.5em 0' },
            // Image styling
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              margin: '10px auto',
              borderRadius: '4px',
              boxShadow: theme => theme.shadows[1]
            }
          }
        }}
      >
        <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Close button */}
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1000 }}>
            <IconButton onClick={exitFullscreen} sx={{ backgroundColor: 'background.paper', '&:hover': { backgroundColor: 'action.hover' } }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {editorContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Paper
      sx={{
        p: 0,
        borderRadius: 1,
        boxShadow: theme => theme.shadows[1],
        width: fullWidth ? '100%' : 'auto',
        position: 'relative',
        border: theme => `1px solid ${theme.palette.divider}`,
        '& .lexical-bold': { fontWeight: 'bold' },
        '& .lexical-italic': { fontStyle: 'italic' },
        '& .lexical-underline': { textDecoration: 'underline' },
        '& .lexical-strikethrough': { textDecoration: 'line-through' },
        '& .lexical-subscript': { fontSize: '0.8em', verticalAlign: 'sub' },
        '& .lexical-superscript': { fontSize: '0.8em', verticalAlign: 'super' },
        '& .lexical-inline-code': { 
          backgroundColor: theme => theme.palette.grey[100],
          padding: '2px 4px',
          borderRadius: '3px',
          fontSize: '0.9em',
          fontFamily: 'monospace'
        },
        '& .lexical-quote': {
          borderLeft: theme => `4px solid ${theme.palette.primary.main}`,
          paddingLeft: theme => theme.spacing(2),
          margin: theme => `${theme.spacing(1)} 0`,
          fontStyle: 'italic',
          backgroundColor: theme => theme.palette.grey[50]
        },
        '& .lexical-h1': { fontSize: '2rem', fontWeight: 'bold', margin: '0.5em 0' },
        '& .lexical-h2': { fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5em 0' },
        '& .lexical-h3': { fontSize: '1.25rem', fontWeight: 'bold', margin: '0.5em 0' },
        '& .lexical-h4': { fontSize: '1.125rem', fontWeight: 'bold', margin: '0.5em 0' },
        '& .lexical-h5': { fontSize: '1rem', fontWeight: 'bold', margin: '0.5em 0' },
        '& .lexical-h6': { fontSize: '0.875rem', fontWeight: 'bold', margin: '0.5em 0' },
        '& .lexical-ul, & .lexical-ol': { paddingLeft: '1.5em' },
        '& .lexical-li': { margin: '0.25em 0' },
        '& .lexical-link': { 
          color: theme => theme.palette.primary.main, 
          textDecoration: 'underline',
          cursor: 'pointer'
        },
        '& .lexical-code-block': {
          backgroundColor: theme => theme.palette.grey[100],
          padding: theme => theme.spacing(1),
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.9em',
          margin: theme => `${theme.spacing(1)} 0`,
          border: theme => `1px solid ${theme.palette.grey[300]}`
        },
        '& .lexical-table': {
          borderCollapse: 'collapse',
          width: '100%',
          margin: theme => `${theme.spacing(1)} 0`
        },
        '& .lexical-table-cell': {
          border: theme => `1px solid ${theme.palette.grey[300]}`,
          padding: theme => theme.spacing(1),
          minWidth: '50px'
        },
        '& .lexical-table-cell-header': {
          border: theme => `1px solid ${theme.palette.grey[300]}`,
          padding: theme => theme.spacing(1),
          backgroundColor: theme => theme.palette.grey[100],
          fontWeight: 'bold'
        },
        '& .lexical-hashtag': { 
          color: theme => theme.palette.primary.main,
          fontWeight: 'bold'
        },
        '& .lexical-hr': {
          border: 'none',
          borderTop: theme => `2px solid ${theme.palette.grey[300]}`,
          margin: theme => `${theme.spacing(2)} 0`
        },
        '& .lexical-paragraph': { margin: '0.5em 0' },
        // Image styling
        '& img': {
          maxWidth: '100%',
          height: 'auto',
          display: 'block',
          margin: '10px auto',
          borderRadius: '4px',
          boxShadow: theme => theme.shadows[1]
        }
      }}
    >
      {editorContent}

      {invalid && isTouched && isSubmitted && error && (
        <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>{error.message}</Box>
      )}
    </Paper>
  );
};

export default LexicalEditor;