import { Button, Typography } from '@mui/material'
import CardSVG from './CardSVG'
import InvoiceSVG from './InvoiceSVG'


interface ApprovalProps {
  paymentType: "Invoice" | "Card" | null
  checked: "Invoice" | "Card" | null
  setRegistrationType: React.Dispatch<React.SetStateAction<'Card' | 'Invoice' | null>>
}

const buttonClass = 'flex flex-col items-center'
const buttonStyle = { border: '1px solid', borderRadius: '10px', padding: '10px' }

const PaymentTypeOptions = ({ paymentType, checked, setRegistrationType }: ApprovalProps) =>
  <>
    {paymentType === 'Invoice' ? (
      <Button
        className={buttonClass}
        sx={{ 
          ...buttonStyle,
          borderColor: checked === 'Invoice' ? 'lightgreen' : 'lightgray',
          backgroundColor: checked === 'Invoice' ? 'green' : 'transparent'
        }}
        onClick={() => {
          setRegistrationType(paymentType)
        }}
        disabled={checked === paymentType}
      >
        <div>
          <InvoiceSVG active={checked === 'Invoice'} />
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              fontWeight: 800,
              color: checked === 'Invoice' ? 'lightgreen' : 'lightgray'
            }}
          >
            Invoice
          </Typography>
        </div>
        </Button>
    ) : (
      <Button
        className={buttonClass}
        sx={{ 
          ...buttonStyle,
          borderColor: checked === 'Card' ? 'lightgreen' : 'lightgray',
          backgroundColor: checked === 'Card' ? 'green' : 'transparent'
        }}
        onClick={() => {
          setRegistrationType(paymentType)
        }}
        disabled={checked === paymentType}
      >
        <div>
          <CardSVG active={checked === 'Card'} />
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              fontWeight: 800,
              color: checked === 'Card' ? 'lightgreen' : 'lightgray'
            }}
          >
            Card
          </Typography>
        </div>
      </Button>
    )}
  </>
export default PaymentTypeOptions
