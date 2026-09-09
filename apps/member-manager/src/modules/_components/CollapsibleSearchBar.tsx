import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

type CollapsibleSearchBarProps = {
  /** Whether the search row is expanded. Toggled by the magnifying glass. */
  open: boolean;
  /** Current (committed) search string — usually the list filter's `q`. */
  value: string;
  /** Called (debounced) with the trimmed search string, or "" to clear. */
  onChange: (value: string) => void;
  /** Called when the user presses Escape — caller typically closes + clears. */
  onClose?: () => void;
  placeholder?: string;
  /** Debounce before `onChange` fires while typing. */
  debounceMs?: number;
  /** aria-label / test hook for the input */
  label?: string;
};

/**
 * Accordion search row that sits directly under a grey tab/heading bar.
 * Height collapses to zero when closed; the input auto-focuses when opened.
 * Typing is debounced before it reaches `onChange` so store-backed filters
 * (RaStore → user preferences) are not written on every keystroke.
 */
const CollapsibleSearchBar = ({
  open,
  value,
  onChange,
  onClose,
  placeholder = 'Search…',
  debounceMs = 350,
  label = 'Search',
}: CollapsibleSearchBarProps) => {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keep the field in sync when the committed value changes from outside
  // (tab switch, clear-on-close, store hydration). Compare against the
  // trimmed draft so a trailing space mid-typing is not stripped.
  useEffect(() => {
    if (value !== text.trim()) setText(value);
  }, [value]);

  // Debounced commit. Re-running after an external sync is a no-op because
  // the trimmed draft already equals `value`.
  useEffect(() => {
    const trimmed = text.trim();
    if (trimmed === value) return;
    const t = window.setTimeout(() => onChange(trimmed), debounceMs);
    return () => window.clearTimeout(t);
  }, [text, value, debounceMs]);

  return (
    <Collapse in={open} timeout={200} unmountOnExit onEntered={() => inputRef.current?.focus()}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.grey[900]
              : theme.palette.grey[50],
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TextField
          inputRef={inputRef}
          size="small"
          fullWidth
          value={text}
          placeholder={placeholder}
          inputProps={{ 'aria-label': label }}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              onClose?.();
            }
          }}
          sx={{
            maxWidth: 520,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: text ? (
              <InputAdornment position="end">
                <Tooltip title="Clear">
                  <IconButton
                    size="small"
                    aria-label="Clear search"
                    onClick={() => {
                      setText('');
                      onChange('');
                      inputRef.current?.focus();
                    }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>
    </Collapse>
  );
};

export default CollapsibleSearchBar;
