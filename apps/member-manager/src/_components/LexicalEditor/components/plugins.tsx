import React, { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $getSelection, $isRangeSelection } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

// Merge Tag Plugin for inserting dynamic fields
interface MergeTagPluginProps {
  fieldName: string;
}

export const MergeTagPlugin: React.FC<MergeTagPluginProps> = ({ fieldName }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ field: string; tag: string }>;
      if (custom?.detail?.field === fieldName) {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertText(custom.detail.tag);
          }
        });
      }
    };
    window.addEventListener('insertMergeTag', handler as EventListener);
    return () => window.removeEventListener('insertMergeTag', handler as EventListener);
  }, [editor, fieldName]);
  return null;
};

// HTML Sync Plugin for bidirectional HTML synchronization
interface HtmlSyncPluginProps {
  value: string;
  onChangeHTML: (html: string) => void;
}

export const HtmlSyncPlugin: React.FC<HtmlSyncPluginProps> = ({ value, onChangeHTML }) => {
  const [editor] = useLexicalComposerContext();
  const initialized = useRef(false);
  const lastValueRef = useRef('');
  const isUpdatingFromExternal = useRef(false);

  useEffect(() => {
    // Only update on initial load or when value changes significantly
    if (!initialized.current) {
    initialized.current = true;
      lastValueRef.current = value;
      
      if (value) {
        isUpdatingFromExternal.current = true;
        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(value, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          const root = $getRoot();
          root.clear();
          root.append(...nodes);
        });
        setTimeout(() => {
          isUpdatingFromExternal.current = false;
        }, 100);
      }
      return;
    }

    // For subsequent updates, only update if the change is from external (not from typing)
    // We'll handle this via a manual trigger instead of automatic syncing
  }, [editor, value]);

  return (
    <OnChangePlugin
      onChange={(editorState, ed) => {
        // Don't trigger onChange when we're updating from external HTML
        if (isUpdatingFromExternal.current) return;
        
        editorState.read(() => {
          const html = $generateHtmlFromNodes(ed);
          lastValueRef.current = html;
          onChangeHTML(html);
        });
      }}
    />
  );
};
