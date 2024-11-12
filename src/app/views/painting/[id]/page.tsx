'use client'

import PaintingCanvas from '@/app/views/painting/[id]/components/PaintingCanvas.component'
import PaintingModel from '@/app/views/painting/[id]/components/PaintingModel.component'
import { use, useEffect, useState } from 'react'
import { CardWrap, Container, Card, ModelHeader, ModelWrap } from './style'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@mui/material'
import { ColorResult, SketchPicker } from 'react-color'

export default function PaintingView(props: {}): JSX.Element {
  const [imgUrl, setImgUrl] = useState<string>()
  const [canvas, setCanvas] = useState<HTMLCanvasElement>()
  const [color, setColor] = useState<string>('#fff')
  const [onSelectedColor, setOnSelectedColor] = useState(false)
  const params = useParams()

  useEffect(() => {
    const roomId = params.id
    console.log('roomId', roomId)
  })

  function onSelectColor(newColor: ColorResult): void {
    setColor(newColor.hex)
  }

  function handleColorPicker(): void {
    setOnSelectedColor(!onSelectedColor)
  }

  function clear(): void {}

  return (
    <main>
      <div style={ModelHeader}>
        <div style={ModelWrap} className="flex justify-end relative">
          <Button variant="contained" size="small" onClick={handleColorPicker}>
            {onSelectedColor ? '完成' : '選擇顏色'}
          </Button>
          <Button variant="" onClick={clear}>
            清除
          </Button>
          {onSelectedColor && (
            <SketchPicker
              className="absolute top-12 right-16"
              color={color}
              onChangeComplete={onSelectColor}
            />
          )}
        </div>
      </div>
      <div style={Container}>
        <div style={CardWrap}>
          展示區域
          <div style={Card}>
            <PaintingModel imgUrl={imgUrl} canvas={canvas} />
          </div>
        </div>
        <div style={CardWrap}>
          創作區域
          <div style={Card}>
            <PaintingCanvas
              setImgUrl={setImgUrl}
              setCanvas={setCanvas}
              color={color}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
