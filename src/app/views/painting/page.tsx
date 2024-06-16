'use client'

import PaintingCanvas from '@/app/components/PaintingCanvas.component'
import PaintingModel from '@/app/components/PaintingModel.component'
import { useEffect, useState } from 'react'
import { CardWrap, Container, Card } from './style'

export default function PaintingView(props: {}): JSX.Element {
  const [selectedModel, setSelectedModel] = useState()
  const [imgUrl, setImgUrl] = useState<string>()
  const [canvas, setCanvas] = useState<HTMLCanvasElement>()

  return (
    <main style={Container}>
      <div style={CardWrap}>
        Model-View
        <div style={Card}>
          <PaintingModel imgUrl={imgUrl} canvas={canvas} />
        </div>
      </div>
      <div style={CardWrap}>
        Canvas-View
        <div style={Card}>
          <PaintingCanvas setImgUrl={setImgUrl} setCanvas={setCanvas} />
        </div>
      </div>
      {/* <div className='card'>
        my models
      </div> */}
    </main>
  )
}
