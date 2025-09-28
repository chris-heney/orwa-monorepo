import React, { useState, useCallback, useRef, useEffect } from 'react';
import { IconButton, Tooltip, Box, Typography, Paper } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import StopIcon from '@mui/icons-material/Stop';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';

interface VoiceToTextProps {
  disabled?: boolean;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({ disabled = false }) => {
  const [editor] = useLexicalComposerContext();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check if Speech Recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Update the transcript state for display
        setTranscript(finalTranscript + interimTranscript);

        // Insert final transcript into the editor
        if (finalTranscript) {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertText(finalTranscript);
            }
          });
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('');
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        setTranscript('');
      };
    } else {
      console.warn('Speech Recognition not supported in this browser');
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [editor]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  if (!isSupported) {
    return (
      <Tooltip title="Voice-to-text not supported in this browser">
        <span>
          <IconButton size="small" disabled>
            <MicOffIcon />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Tooltip title={isListening ? "Stop voice input" : "Start voice input"}>
        <span>
          <IconButton 
            size="small" 
            onClick={toggleListening}
            disabled={disabled}
            sx={{ 
              backgroundColor: isListening ? 'error.main' : 'transparent',
              color: isListening ? 'white' : 'inherit',
              '&:hover': {
                backgroundColor: isListening ? 'error.dark' : 'action.hover'
              },
              animation: isListening ? 'pulse 1.5s infinite' : 'none',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.7)',
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)',
                },
              }
            }}
          >
            {isListening ? <StopIcon /> : <MicIcon />}
          </IconButton>
        </span>
      </Tooltip>

      {/* Live transcript display */}
      {isListening && transcript && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            mt: 1,
            p: 2,
            minWidth: 250,
            maxWidth: 400,
            zIndex: 1000,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 3
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Listening...
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            {transcript}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default VoiceToText;
