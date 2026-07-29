import { Box, Typography, Divider, Button } from '@mui/material'

const DisplayLinks = ({ links, title }: { links: string, title: string }) => {
  if (links === null ) return null

  const linkList = links.split(',').map(link => link.trim())

  const linkElements = linkList.map((link, index) => {
    const content = link.endsWith('.pdf') ? (
      <iframe key={index} src={link} width="100%" height="500"></iframe>
    ) :  (
      <Button
        key={index}
        size='small'
        variant="contained"
        color="primary"
        onClick={() => window.open(link, '_blank')}
      >
        Download {title}
      </Button>
    )

    return (
      <Box key={index}>
        {index === 0 && (
          <>
            <Typography variant="body1" fontWeight="bold" textAlign="left"> {title} ({linkList.length})</Typography>
            <Divider sx={{ mb: 2 }} />
          </>
        )}
        {content}
        <Divider sx={{ mt: 2 }} />
      </Box>
    )
  })

  return (
    <ul>
      {linkElements}
    </ul>
  )
}

export default DisplayLinks
