import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useMergeTagInput } from './useMergeTagInput';
import { useMergeTag } from './MergeTagContext';
import { TextInput } from 'react-admin';

interface MergeTagTextFieldProps {
  source: string;
  label: string;
  validate?: any;
  multiline?: boolean;
  rows?: number;
  fullWidth?: boolean;
  onInsertFieldClick?: () => void;
  helperText?: string;
  placeholder?: string;
  defaultValue?: any;
  characterLimit?: number;
  showCharacterCount?: boolean;
}

const MergeTagTextField: React.FC<MergeTagTextFieldProps> = ({
  source,
  label,
  validate,
  multiline = false,
  rows,
  fullWidth = true,
  onInsertFieldClick,
  helperText,
  placeholder,
  defaultValue,
  characterLimit,
  showCharacterCount = false,
}) => {
  // Use validation from schema if no custom validation provided
  const finalValidate = validate
  
  // Check if field is required based on validation
  const isRequired = React.useMemo(() => {
    if (!validate) return false;
    
    // Handle array of validators
    if (Array.isArray(validate)) {
      return validate.some(validator => 
        validator && 
        (validator.name === 'required' || 
         (typeof validator === 'function' && validator.toString().includes('required')))
      );
    }
    
    // Handle single validator function
    if (typeof validate === 'function') {
      return validate.toString().includes('required') || 
             validate.name === 'required';
    }
    
    return false;
  }, [validate]); 
  
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted },
    inputRef,
    handleFocus,
    handleBlur,
  } = useMergeTagInput({ source, validate: finalValidate, defaultValue });

  const { setActiveField } = useMergeTag();

  const currentLength = (field.value || '').length;
  const isOverLimit = characterLimit ? currentLength > characterLimit : false;

  // Calculate SMS segments if this is a text message
  const calculateSMSSegments = (text: string): { segments: number; remaining: number } => {
    if (!text) return { segments: 0, remaining: 160 };
    
    const length = text.length;
    if (length <= 160) {
      return { segments: 1, remaining: 160 - length };
    }
    
    // For messages over 160 characters, each segment is 153 characters
    const segments = Math.ceil(length / 153);
    const remaining = (segments * 153) - length;
    
    return { segments, remaining };
  };

  const smsInfo = showCharacterCount && source.includes('message') 
    ? calculateSMSSegments(field.value || '')
    : null;

  return (
    <Box>
      <TextInput
        {...field}
        inputRef={inputRef}
        label={label}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        source={source}
        validate={validate}
        placeholder={placeholder}
        required={isRequired}
        error={!!(isSubmitted && error) || isOverLimit}
        helperText={
          isSubmitted && error 
            ? error.message 
            : isOverLimit
            ? `Character limit exceeded (${currentLength}/${characterLimit})`
            : helperText
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
          },
        }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
        <Box>
          {onInsertFieldClick && (
            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => {
                // Ensure the correct field is targeted even if focus moved to the dialog
                setActiveField(source);
                onInsertFieldClick();
              }}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Insert Merge Tag
            </Button>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {showCharacterCount && (
            <Typography 
              variant="caption" 
              color={isOverLimit ? 'error' : 'text.secondary'}
            >
              {characterLimit 
                ? `${currentLength}/${characterLimit} characters`
                : `${currentLength} characters`
              }
            </Typography>
          )}
          
          {smsInfo && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: '0.7rem' }}
            >
              {smsInfo.segments} SMS segment{smsInfo.segments !== 1 ? 's' : ''} 
              {smsInfo.remaining > 0 && ` (${smsInfo.remaining} remaining)`}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MergeTagTextField;
