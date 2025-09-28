import { useEffect, useRef } from 'react';
import { useInput } from 'react-admin';
import { useMergeTag } from './MergeTagContext';

interface UseMergeTagInputProps {
  source: string;
  validate?: any;
  defaultValue?: any;
}

export const useMergeTagInput = ({ source, validate, defaultValue }: UseMergeTagInputProps) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { activeField, setActiveField } = useMergeTag();
  
  const {
    field,
    fieldState: { error, invalid, isTouched },
    formState: { isSubmitted }
  } = useInput({
    source,
    validate,
    defaultValue,
  });

  // Insert merge tag at cursor position
  const insertTagAtCursor = (tag: string) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentValue = field.value || '';
    
    const newValue = currentValue.slice(0, start) + tag + currentValue.slice(end);
    field.onChange(newValue);
    
    // Restore cursor position after the inserted tag
    setTimeout(() => {
      if (input) {
        const newPosition = start + tag.length;
        input.setSelectionRange(newPosition, newPosition);
        input.focus();
      }
    }, 0);
  };

  // Listen for merge tag insertion events
  useEffect(() => {
    const handleInsertTag = (event: CustomEvent) => {
      const { field: targetField, tag } = event.detail;
      if (targetField === source) {
        insertTagAtCursor(tag);
      }
    };

    window.addEventListener('insertMergeTag', handleInsertTag as EventListener);
    return () => {
      window.removeEventListener('insertMergeTag', handleInsertTag as EventListener);
    };
  }, [source]);

  // Track focus to set active field
  const handleFocus = () => {
    setActiveField(source);
  };

  const handleBlur = () => {
    // Don't clear active field immediately - let user click insert button
    setTimeout(() => {
      if (activeField === source) {
        setActiveField(null);
      }
    }, 200);
  };

  return {
    field,
    fieldState: { error, invalid, isTouched },
    formState: { isSubmitted },
    inputRef,
    handleFocus,
    handleBlur,
    insertTagAtCursor,
  };
};

