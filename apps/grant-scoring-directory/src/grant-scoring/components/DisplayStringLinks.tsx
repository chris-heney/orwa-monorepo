import { Box, Typography, Divider, Link } from '@mui/material';

interface DisplayStringLinksProps {
  links: string;
  title: string;
}

const DisplayStringLinks = ({ links, title }: DisplayStringLinksProps) => {
  if (!links) return null;

  const linkList = links.split(',').map(link => link.trim());

  const linkElements = linkList.map((link, index) => (
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
        href={link} 
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
        {link} ({title} {index + 1})
      </Link>
    </Box>
  ));

  return (
    <Box sx={{ marginBottom: '16px' }}>
      <Typography 
        variant="body1" 
        fontWeight="bold" 
        textAlign="left" 
        sx={{ marginBottom: '8px' }}
      >
        {title} ({linkList.length})
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box component="ul" sx={{ paddingLeft: '0', margin: '0' }}>
        {linkElements}
      </Box>
    </Box>
  );
};

export default DisplayStringLinks;