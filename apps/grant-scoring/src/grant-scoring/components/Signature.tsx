import { Box, Button } from '@mui/material'
import React,{ useEffect } from 'react'
import Signature_Pad from 'signature_pad'


interface Props {
	setSignature: React.Dispatch<React.SetStateAction<string>>
  signaturePad: Signature_Pad | undefined
  setSignaturePad: React.Dispatch<React.SetStateAction<Signature_Pad | undefined>>
}

export default function SignaturePad({ setSignature, setSignaturePad, signaturePad }: Props) {
  
  const clear = () => {
    signaturePad && signaturePad.clear()
    setSignature('')
  }

  function update() {
    console.log('updating')
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
  }, [])

  return (
    <Box>
      <Box display={'flex'} justifyContent={'flex-start'}>
        <Button onClick={() => clear()}>Clear Signature</Button>
      </Box>
      <Box
        id='signature-pad'
        style={{
          width: '100%',
          height: 290,
          border: '3px solid',
          borderRadius: 10,
          backgroundColor: 'white',
        }}
      >
        <canvas style={{ width: '100%', height: '100%' }} onClick={update} onDrag={update} onTouchStart={update} onTouchEnd={update}/>
      </Box>
    </Box>
  )
}