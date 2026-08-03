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

  const inputClassName =
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-left">
      <div className="flex flex-col gap-5">
        {/* Card number */}
        <div className="flex flex-col">
          <label
            className="mb-1 text-left text-sm font-semibold text-slate-900"
            htmlFor="cardNumber"
          >
            Card number <span className="text-red-500">*</span>
          </label>

          <div className="relative block">
            <InputMask
              {...register(`${source}.card`, { required: 'Card number is required' })}
              mask={cardMask}
              onKeyUp={(e) => updateMasks(e.currentTarget.value)}
              required
              placeholder='XXXX XXXX XXXX XXXX'
              className={`${inputClassName} pr-[46px]`}
            />
            {getError(`${source}.card`) && <span className="text-sm text-red-500 text-left">*{getError(`${source}.card`)}</span>}

            <span className="absolute inset-y-2 right-3 flex h-6 w-[34px] items-center justify-center">
              <CardImage type={returnCardType(getValues("card")) as string} />
            </span>
          </div>
        </div>

        {/* Expiry date and cvv */}
        <div className="flex gap-4">
          {/* Expiry date */}
          <div className="flex flex-col">
            <label
              className="mb-1 text-left text-sm font-semibold text-slate-900"
              htmlFor="cardExpiry"
            >
              Expiry date <span className="text-red-500">*</span>
            </label>

            <InputMask
              {...register(`${source}.exp`, { required: 'Expiry date is required' })}
              mask="99/99"
              required
              placeholder="MM/YY"
              className={inputClassName}
            />
            {getError(`${source}.exp`) && <span className="text-sm text-red-500 text-left">*{getError(`${source}.exp`)}</span>}
          </div>

          {/* CVV */}
          <div className="flex flex-col">
            <label
              className="mb-1 text-left text-sm font-semibold text-slate-900"
              htmlFor="cardCvv"
            >
              CVC/CVV <span className="text-red-500">*</span>
            </label>

            <InputMask
              {...register(`${source}.cvv`, { required: 'CVV is required' })}
              mask={CVVMask}
              required
              placeholder="999"
              className={inputClassName}
            />
            {getError(`${source}.cvv`) && <span className="text-sm text-red-500 text-left">*{getError(`${source}.cvv`)}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardForm