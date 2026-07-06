import React from 'react'
import { Button, SxProps } from '@mui/material'
import { RaRecord, useRecordContext } from 'react-admin'
import ContactsIcon from '@mui/icons-material/Contacts'


interface ContactVcardProps {
  sx?: SxProps
}

const ContactVcard = ({
  sx,
}: ContactVcardProps = { }) => {

  const record = useRecordContext<RaRecord>()

  const download = () => {

    const vCardString = `BEGIN:VCARD
VERSION:3.0
N*:;${record.last}; ${record.first};;
FN:${record.first} ${record.last}
ORG:Oklahoma Rural Water Association
TEL:${record.phone}
EMAIL:${record.email}
END:VCARD`

    const vCardBlob = new Blob([vCardString], { type: 'text/vcard' })

    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(vCardBlob)
    downloadLink.setAttribute('download', `${record.first}-${record.last}.vcf`)
    
    document.body.appendChild(downloadLink)
    downloadLink.click()
    
    document.body.removeChild(downloadLink)
  }

  return (
    <Button
      variant={'text'} 
      sx={{
        textTransform: 'none',
        ...sx
      }}
      onClick={download}>
      <ContactsIcon sx={{ fontSize: '1.865rem', ...sx }} />
    </Button>
  )
}

export default ContactVcard