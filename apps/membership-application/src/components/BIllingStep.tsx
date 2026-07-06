import { useFormContext } from 'react-hook-form'
// import { useContext } from 'react'
import CardForm from './CardForm'
// import { SelectInput } from 'mj-react-form-builder'
// import { stateOptions } from '../data/stateOptions'
import PaymentTypeOptions from './PaymentTypesOptions'

const BillingStep = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext()
//   const payload = useContext(PayloadProvider)
  const paymentType = watch('paymentType')

  const inputClass = 'className="flex h-10 w-full rounded-md border-2 bg-background px-4 py-1.5 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-purple-600 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 undefined"'

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className='grid md:grid-cols-2 gap-4'>
        <div className="billing-info">

          {/* Billing Info */}
            <>
              <h6 className="text-2xl font-bold mb-6">Billing Information</h6>
              <div className="flex flex-col space-y-4">
                <input type="text" placeholder="Address" className={inputClass} {...register('address', { required: 'Address is required' })} />
                {errors.address && <span className="text-red-500 text-left">*{errors.address.message as string}</span>}
                <input type="text" placeholder="City" className={inputClass} {...register('city', { required: 'City is required' })} />
                {errors.city && <span className="text-red-500 text-left">*{errors.city.message as string}</span>}
                {/* <SelectInput source='billing_state' options={stateOptions} label='State'/> */}
                {errors.state && <span className="text-red-500 text-left">*{errors.state.message as string}</span>}
                <input type="text" placeholder="Zip" maxLength={5} className={inputClass} {...register('zip', { required: 'Zip is required' })} />
                {errors.zip && <span className="text-red-500 text-left">*{errors.zip.message as string}</span>}
              </div>
            </>
          

        </div>

        {/* Reciept Information */}
        <div>
          <h6 className="text-2xl font-bold mb-4">Receipt</h6>

          {/* {(payload.registrationPayload.submitted
            && !payload.registrationPayload.error
            && payload.registrationPayload.paymentType === 'Card'
          )
            && <h1 className="text-green-800">This transaction has been approved.</h1>
          }

          {(payload.registrationPayload.submitted && !payload.registrationPayload.error)
            && <h1 className="text-green-800">You will receive an email confirming your registration.</h1>
          } */}
          {/* <CheckoutReciept /> */}
        </div>

          <>
            {/* Checkout Type */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Checkout Type</h2>
              <div className="flex flex-col space-y-4">
                <PaymentTypeOptions 
                  {...register('paymentType')}
                  paymentType={'Card'}
                  checked={paymentType}
                  setRegistrationType={() => setValue('paymentType', 'Card')}
                />
                <PaymentTypeOptions 
                  {...register('paymentType')}
                  paymentType={'Invoice'}
                  checked={paymentType}
                  setRegistrationType={() => setValue('paymentType', 'Invoice')}
                />
              </div>
            </div>

            {/* Card Information */}
            {paymentType === 'Card' && (
              <CardForm source="payment_information" />
              )}
          </>
        
      </div>
    </div>
  )
}

export default BillingStep
