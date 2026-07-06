import { useState } from 'react'
import InputMask from 'react-input-mask'
import creditCardType from 'credit-card-type'
import { useFormContext } from 'react-hook-form'
import CardImage from './CardImage'
import { getError } from '../helpers/getError'

const CardForm = ({source}: {
  source: string
}) => {

  const { register, getValues } = useFormContext()

  const returnCardType = (value: string) => {
    if (!value) return
    return creditCardType(value)[0]?.type
  }

  const masks = {
    card: {
      other: '9999 9999 9999 9999',
      'american-express': '9999 999999 99999'
    },
    cvv: {
      other: '999',
      'american-express': '9999'
    }
  }

  const updateMasks = (value: string) => {
    if (!value) return

    if (value.startsWith('3')) {
      setCardMask(masks.card['american-express'])
      setCVVMask(masks.cvv['american-express'])
    } else {
      setCardMask(masks.card.other)
      setCVVMask(masks.cvv.other)
    }
  }
  const [cardMask, setCardMask] = useState(masks.card.other)
  const [CVVMask, setCVVMask] = useState(masks.cvv.other)

  return (
    <div className="border rounded-lg">
      <div className="py-6 px-4 bg-neutral-50 rounded-2xl">
        <div className="flex flex-col gap-6">

          {/* Card number */}
          <div className="flex flex-col">
            <label
              className="text-lg text-neutral-900 mb-3"
              htmlFor="cardNumber"
            >
              Enter your card number
            </label>

            <div className="relative block">
              <InputMask
                {...register(`${source}.card`, { required: 'Card number is required' })}
                mask={cardMask}
                onKeyUp={(e) => updateMasks(e.currentTarget.value)}
                required
                placeholder='XXXX XXXX XXXX XXXX'
                className="py-[14px] px-3 h-[52px] rounded-md w-full border-[1.5px] border-neutral-300 pr-[34px]"
             
              />
              {getError(`${source}.card`) && <span className="text-red-500 text-left">*{getError(`${source}.card`)}</span>}

              <span className="absolute inset-y-3 right-3 w-[34px] h-6 flex justify-center items-center border border-neutral-100">
                <CardImage type={returnCardType(getValues("card")) as string} />
              </span>
            </div>
          </div>

          {/* Expiry date and cvv */}
          <div className="flex gap-4">
            {/* Expiry date */}
            <div className="flex flex-col">
              <label
                className="text-lg text-neutral-900 mb-3"
                htmlFor="cardNumber"
              >
                Expiry date
              </label>

              <InputMask
                {...register(`${source}.exp`, { required: 'Expiry date is required' })}
                mask="99/99"
                required
                placeholder="MM/YY"
                className="rounded-md py-[14px] px-3 border-[1.5px] border-neutral-300 bg-white h-[52px] w-full"
              />
              {getError(`${source}.exp`) && <span className="text-red-500 text-left">*{getError(`${source}.exp`)}</span>}
            </div>

            {/* CVV */}
            <div className="flex flex-col">
              <label
                className="text-lg text-neutral-900 mb-3"
                htmlFor="cardNumber"
              >
                CVC/CVV
              </label>

              <InputMask
                {...register(`${source}.cvv`, { required: 'CVV is required' })}
                mask={CVVMask}
                required
                placeholder="999"
                className="rounded-md py-[14px] px-3 border-[1.5px] border-neutral-300 bg-white h-[52px] w-full"
              />
              {getError(`${source}.cvv`) && <span className="text-red-500 text-left">*{getError(`${source}.cvv`)}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardForm