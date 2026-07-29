import * as React from 'react'
import { Button, Typography } from '@mui/material'
import DenyIcon from '@mui/icons-material/DoNotDisturb'
import ApproveIcon from '@mui/icons-material/Verified'

const svgSx = { fontSize: 75 }

interface ApprovalProps {
  type: 'approve' | 'deny'
  approved: boolean | null
  setApprovedApplication: React.Dispatch<React.SetStateAction<boolean | null>>
}

const ApprovalBox = ({ type, approved, setApprovedApplication }: ApprovalProps) => {

  const active = approved === null ? '#cccccc' : type === 'approve' ? 'green' : 'red'
  return (
    <Button
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      onClick={() => type === 'approve' ? setApprovedApplication(true) : setApprovedApplication(false)}
      disabled={ (approved && type === 'approve') || (!approved && type === 'deny' && approved !== null)}
    >
      {type === 'approve' ? (
        <ApproveIcon sx={{ ...svgSx, color: approved ? active : '#cccccc' }} />
      ) : (
        <DenyIcon sx={{ ...svgSx, color: approved ? '#cccccc' : active }} />
      )}
      <Typography
        variant="body1"
        sx={{
          textAlign: 'left',
          fontWeight: 800,
          color: (approved === null ? '#cccccc' 
            : approved && type === 'approve' ? 'green'
            : !approved && type === 'deny' ? 'red'
            : '#cccccc'
          )
        }}
      >{type !== 'approve' && <>Not</>} Approved</Typography>
    </Button>
  )
}

export default ApprovalBox