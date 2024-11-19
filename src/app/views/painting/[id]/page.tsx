'use client'

import PaintingCanvas from '@/app/views/painting/[id]/components/PaintingCanvas.component'
import PaintingModel from '@/app/views/painting/[id]/components/PaintingModel.component'
import { use, useCallback, useEffect, useState } from 'react'
import { CardWrap, Container, Card, ModelHeader, ModelWrap } from './style'
import { useParams, useRouter } from 'next/navigation'
import { Socket, io } from 'socket.io-client'
import { Avatar, AvatarGroup, Button, Snackbar } from '@mui/material'
import { ColorResult, SketchPicker } from 'react-color'
import { WsSocket } from '@/app/class/WsSocket'
import useAuth from '@/app/store/auth'
import { debounce } from 'lodash'

export default function PaintingView(props: {}): JSX.Element {
  const auth = useAuth()
  const router = useRouter()
  const [imgUrl, setImgUrl] = useState<string>()
  const [canvas, setCanvas] = useState<HTMLCanvasElement>()
  const [color, setColor] = useState<string>('#fff')
  const [onSelectedColor, setOnSelectedColor] = useState(false)
  const [members, setMembers] = useState<string[]>([])
  const [socket, setSocket] = useState<Socket>()
  const [mouses, setMouses] = useState<WsSocket.MouseModel[]>([])

  // const [members, setMembers] = useState<string[]>([])
  const [snackBarState, setSnackBarState] = useState<{
    open: boolean
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
    message: string
  }>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    message: '',
  })

  const { open, vertical, horizontal, message } = snackBarState

  const params = useParams()

  useEffect(() => {
    if (!auth.name) {
      router.push('/views/login')
      return
    }

    const roomId = params.id
    console.log('roomId', roomId)

    setSocket(
      // io('http://ec2-54-250-164-109.ap-northeast-1.compute.amazonaws.com:3200')
      io('http://localhost:3200')
    )

    return () => {
      if (socket && socket.connected) socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) return
    console.log('socket', socket)

    socket.on('connect', () => {
      console.log('connected', socket)

      socket.emit('join', auth.name)
      socket.on('on-join', (res) => {
        const data = new WsSocket.JoinModel(res)
        openSnackBar(data)
        setMembers(data.members)
        if (data.img !== '') setImgUrl(data.img)
      })

      socket.on('on-paint', (imgUrl: string) => {
        setImgUrl(imgUrl)
      })
    })
    return () => {
      socket.disconnect()
    }
  }, [socket])

  const emitResult = useCallback(
    debounce((socket: Socket, imgUrl) => {
      // Simulate an API call
      setTimeout(() => {
        socket.emit('paint', imgUrl)
      }, 300)
    }, 300), // 500ms debounce
    []
  )

  // useEffect to watch for searchTerm changes
  useEffect(() => {
    if (socket) {
      emitResult(socket, imgUrl)
    }
    // Cleanup the debounce on unmount
    return () => {
      emitResult.cancel()
    }
  }, [imgUrl, emitResult])

  function onSelectColor(newColor: ColorResult): void {
    setColor(newColor.hex)
  }

  function handleColorPicker(): void {
    setOnSelectedColor(!onSelectedColor)
  }

  function clearRect(): void {}

  function openSnackBar(data: WsSocket.JoinModel): void {
    console.log(data)
    setSnackBarState({
      ...snackBarState,
      message: `${data.name} 已加入畫室 🫥`,
      open: true,
    })
  }
  function closeSnackBar(): void {
    setSnackBarState({ ...snackBarState, open: false })
  }

  return (
    <main>
      <Snackbar
        open={open}
        message={message}
        anchorOrigin={{ vertical, horizontal }}
        onClose={closeSnackBar}
        key={vertical + horizontal}
        autoHideDuration={2000}
      />
      <div style={ModelHeader}>
        <div
          style={ModelWrap}
          className="flex justify-between relative items-center"
        >
          <div className="flex items-center">
            <div>當前畫室成員：</div>
            <AvatarGroup max={5}>
              {members.map((member: string, index: number) => {
                return (
                  <Avatar
                    key={index}
                    src="https://picsum.photos/id/237/200/300"
                  />
                )
              })}
            </AvatarGroup>
          </div>
          <div>
            <Button
              variant="contained"
              size="small"
              onClick={handleColorPicker}
            >
              {onSelectedColor ? '完成' : '選擇顏色'}
            </Button>
            <Button variant="" onClick={clearRect}>
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
              imgUrl={imgUrl}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
