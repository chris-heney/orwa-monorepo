import { Box, Typography, Divider, Link } from '@mui/material';
import { StrapiFile, StrapiFiles } from '../types';

interface DisplayStrapiFilesProps {
  strapiFiles: StrapiFile | StrapiFiles;
  title: string;
}

const DisplayStrapiFiles = ({ strapiFiles, title }: DisplayStrapiFilesProps) => {
  if (!strapiFiles || strapiFiles === null) return null;

  // Handle single file scenario
  const filesArray = Array.isArray(strapiFiles.data) ? strapiFiles.data : [strapiFiles.data];

  const linkElements = filesArray.map((file: any, index: number) => {
    const { url, name } = file;
    const fullUrl = `${import.meta.env.VITE_API_ENDPOINT.replace('/api', '')}${url}`;

    return (
      <Box 
        key={index} 
        component="li" 
        sx={{ 
          marginBottom: '8px', 
          lineHeight: '1.5em',
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box 
          component="span" 
          sx={{ 
            marginRight: '8px', 
            fontSize: '0.75em', 
            color: 'gray',
            fontWeight: 'bold',
            display: 'inline-block',
            width: '12px',
            textAlign: 'center',
            lineHeight: '1em',
          }}
        >
          •
        </Box>
        <Link 
          href={fullUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          sx={{
            fontSize: '1rem',  // match the size of the rest of the text
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {name} 
        </Link>
      </Box>
    );
  });

  return (
    <Box sx={{ marginBottom: '16px' }}>
      <Typography 
        variant="body1" 
        fontWeight="bold" 
        textAlign="left" 
        sx={{ marginBottom: '8px' }}
      >
        {title} ({filesArray.length})
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box component="ul" sx={{ paddingLeft: '0', margin: '0' }}>
        {linkElements}
      </Box>
    </Box>
  );
};

export default DisplayStrapiFiles;