import { Box, Button } from '@mui/material'
import React,{ useEffect, useState } from 'react'
import Signature_Pad from 'signature_pad'
interface Props {
	setSignature: React.Dispatch<React.SetStateAction<string>>
}

export default function SignaturePad({ setSignature }: Props) {
  const [signaturePad, setSignaturePad] = useState<Signature_Pad>()

  const clear = () => {
    signaturePad && signaturePad.clear()
    setSignature('')
  }

  function update() {
    signaturePad && setSignature(signaturePad.toDataURL())
  }

  useEffect(() => {
    function readyPad() {
      const wrapper = document.getElementById('signature-pad')
      const canvas = wrapper?.querySelector('canvas')
      if (canvas) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1)
        canvas.width = canvas.offsetWidth * ratio
        canvas.height = canvas.offsetHeight * ratio
        canvas.getContext('2d')?.scale(ratio, ratio)
        const readySignaturePad = new Signature_Pad(canvas)
        setSignaturePad(readySignaturePad)
      }
    }
    readyPad()
  }, [setSignaturePad])

  return (
    <>
      <Button onClick={() => clear()}>Clear Signature</Button>
      <Box
        id='signature-pad'
        style={{
          width: '100%',
          height: 400,
          border: '3px solid',
          borderRadius: 10,
          backgroundColor: 'white',
        }}
      >
        <canvas style={{ width: '100%', height: '100%' }} onClick={update} onTouchEnd={update} />
      </Box>
    </>
  )
}