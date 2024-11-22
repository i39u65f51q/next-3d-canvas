import { WsSocket } from '@/app/class/WsSocket'
import { get } from 'lodash'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'

export default function PaintingCanvas(props: {
  setImgUrl: React.Dispatch<React.SetStateAction<string | undefined>>
  setCanvas: React.Dispatch<React.SetStateAction<HTMLCanvasElement | undefined>>
  color: string
  imgUrl: string | undefined
  aiImgUrl: string
}): JSX.Element {
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  const canvasRef: React.MutableRefObject<null | HTMLCanvasElement> =
    useRef(null)

  function drawing(event: SyntheticEvent) {
    if (!isDrawing || !context) return
    const { offsetX, offsetY } = event.nativeEvent as MouseEvent
    context.lineTo(offsetX, offsetY)
    context.stroke()
    saveToUrl()
  }

  function start(event: SyntheticEvent) {
    if (!context) return
    const { offsetX, offsetY } = event.nativeEvent as MouseEvent
    context.beginPath()
    context.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  function end(event: SyntheticEvent) {
    if (!context) return
    context.closePath()
    setIsDrawing(false)
  }

  function saveToUrl() {
    if (!canvasRef.current || !context) return
    const url = canvasRef.current.toDataURL()
    props.setImgUrl(url)
    // canvasRef.current.toBlob((blob) => {
    //   if (!blob) return
    //   const url: string = URL.createObjectURL(blob)
    //   props.setImgUrl(url)
    // })
    // URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (canvasRef && canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current
      props.setCanvas(canvas)
      if (!canvas) return
      canvas.width = get(canvas.parentElement, 'offsetWidth', 0)
      canvas.height = get(canvas.parentElement, 'offsetHeight', 0)
      const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
      if (context) setContext(context)
    }
  }, [])

  useEffect(() => {
    if (!context || !canvasRef.current) return
    context.lineCap = 'round'
    context.lineWidth = 2
  }, [context])

  useEffect(() => {
    if (!context || !props.color) return
    context.strokeStyle = props.color
  }, [props.color, context])

  useEffect(() => {
    if (!context) return
    if (props.imgUrl === '' || !props.imgUrl) {
      context.clearRect(0, 0, 5000, 5000)
      return
    }
    const image = new Image()
    image.src = props.imgUrl
    image.onload = () => {
      context.drawImage(image, 0, 0)
    }
  }, [props.imgUrl])

  // FIXME:
  useEffect(() => {
    if (!context || !props.aiImgUrl) return
    const img = new Image()
    img.src = props.aiImgUrl
    img.onload = () => {
      context.drawImage(img, 0, 0)
    }
  }, [props.aiImgUrl])

  return (
    <canvas
      style={{ backgroundColor: '#EFEFEF' }}
      ref={canvasRef}
      onMouseDown={start}
      onMouseUp={end}
      onMouseMove={drawing}
    ></canvas>
  )
}
