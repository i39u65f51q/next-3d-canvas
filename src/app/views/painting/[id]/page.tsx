'use client'

import PaintingCanvas from '@/app/views/painting/[id]/components/PaintingCanvas.component'
import PaintingModel from '@/app/views/painting/[id]/components/PaintingModel.component'
import { use, useEffect, useState } from 'react'
import { CardWrap, Container, Card, ModelHeader, ModelWrap } from './style'
import { useParams, useRouter } from 'next/navigation'

export default function PaintingView(props: {}): JSX.Element {
  const [imgUrl, setImgUrl] = useState<string>()
  const [canvas, setCanvas] = useState<HTMLCanvasElement>()

  const router = useRouter()

  const params = useParams()

  useEffect(() => {
    const roomId = params.id
    console.log('roomId', roomId)
  })

  return (
    <main>
      <div style={ModelHeader}>
        Select Models
        <div style={ModelWrap}>Models</div>
      </div>
      <div style={Container}>
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
      </div>
    </main>
  )
}
