import { Button, Typography } from '@mui/material'
import BoothSvg from './BoothSvg'
import AttendeeSVG from './AttendeeSVG'

interface ApprovalProps {
  registrationType: 'Vendor' | 'Attendee'
  checked: "Vendor" | "Attendee" | null
  setRegistrationType: () => void
}

const buttonClass = 'flex flex-col items-center w-full'
const buttonStyle = { border: '1px solid', borderRadius: '10px', padding: '10px', maxHeight: '115px' }

const VendorOrAttendeeBox = ({ registrationType, checked, setRegistrationType }: ApprovalProps) => {
  return (
    <div>
      {registrationType === 'Vendor' ? (
        <Button
          className={buttonClass}
          sx={{
            ...buttonStyle,
            borderColor: checked === 'Vendor' ? 'lightgreen' : 'lightgray',
            backgroundColor: checked === 'Vendor' ? 'green' : 'transparent'
          }}
          onClick={() => {
            setRegistrationType()
          }}
        >
          <div>
            <BoothSvg active={checked === 'Vendor'} />
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                fontWeight: 800,
                color: checked === 'Vendor' ? 'lightgreen' : 'lightgray'
              }}
            >
              Vendor
            </Typography>
          </div>
        </Button>
      ) : (
        <Button
          className={buttonClass}
          sx={{
            ...buttonStyle,
            borderColor: checked === 'Attendee' ? 'lightgreen' : 'lightgray',
            backgroundColor: checked === 'Attendee' ? 'green' : 'transparent'
          }}
          onClick={() => {
            setRegistrationType()
          }}
        >
          <div>
            <AttendeeSVG active={checked === 'Attendee'} />
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                fontWeight: 800,
                color: checked === 'Attendee' ? 'lightgreen' : 'lightgray'
              }}
            >
              Attendee
            </Typography>
          </div>
        </Button>
      )}
    </div>
  )
}

export default VendorOrAttendeeBox
