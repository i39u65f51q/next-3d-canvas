'use client'

import PaintingCanvas from '@/app/views/painting/[id]/components/PaintingCanvas.component'
import PaintingModel from '@/app/views/painting/[id]/components/PaintingModel.component'
import { use, useCallback, useEffect, useState } from 'react'
import { CardWrap, Container, Card, ModelHeader, ModelWrap } from './style'
import { useParams, useRouter } from 'next/navigation'
import { Socket, io } from 'socket.io-client'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  Input,
  Modal,
  Snackbar,
  Switch,
  Typography,
} from '@mui/material'
import { ColorResult, SketchPicker } from 'react-color'
import { WsSocket } from '@/app/class/WsSocket'
import useAuth from '@/app/store/auth'
import { debounce } from 'lodash'
import { basicModal } from '@/app/styles/style'

const ok = true

export default function PaintingView(props: {}): JSX.Element {
  const auth = useAuth()
  const router = useRouter()
  const [imgUrl, setImgUrl] = useState<string>()
  const [canvas, setCanvas] = useState<HTMLCanvasElement>()
  const [color, setColor] = useState<string>('#fff')
  const [onSelectedColor, setOnSelectedColor] = useState(false)
  const [members, setMembers] = useState<string[]>([])
  const [socket, setSocket] = useState<Socket>()

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [aiImgs, setAiImgs] = useState<string[]>([])
  const [aiImg, setAiImg] = useState<string>('')
  const [keyWordSwitch, setKeyWordSwitch] = useState<boolean>(false)
  const [paintSwitch, setPaintSwitch] = useState<boolean>(false)
  const [selectedAiImg, setSelectedAiImg] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')

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

    socket.on('connect', () => {
      console.log('connected', socket)

      socket.emit('join', auth.name)
      socket.on('on-join', (res) => {
        const data = new WsSocket.JoinModel(res)
        openSnackBar(data)
        setMembers(data.members)
        if (data.img !== '') setImgUrl(data.img)
        if (data.aiImgs.length > 0) setAiImgs(data.aiImgs)
      })

      socket.on('on-paint', (imgUrl: string) => {
        setImgUrl(imgUrl)
      })

      socket.on('on-g-img-img', (aiImgs: string[]) => {
        setAiImgs(aiImgs)
      })

      socket.on('on-g-img-prompt', (aiImgs: string[]) => {
        console.log(aiImgs)
        setAiImgs(aiImgs)
      })
    })
    return () => {
      socket.disconnect()
    }
  }, [socket])

  const emitResult = useCallback(
    debounce((socket: Socket, imgUrl) => {
      setTimeout(() => {
        socket.emit('paint', imgUrl)
      }, 300)
    }, 300),
    []
  )

  useEffect(() => {
    if (socket) {
      emitResult(socket, imgUrl)
    }

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

  function clearRect(): void {
    if (socket) socket.emit('paint', '')
  }

  function emitGImg(): void {
    if (socket) socket.emit('g-img-img', imgUrl)
  }

  function emitGPrompt(): void {
    if (socket) socket.emit('g-img-prompt', prompt) //TODO:
  }

  function openSnackBar(data: WsSocket.JoinModel): void {
    setSnackBarState({
      ...snackBarState,
      message: `${data.name} 已加入畫室 🫥`,
      open: true,
    })
  }
  function closeSnackBar(): void {
    setSnackBarState({ ...snackBarState, open: false })
  }

  function openAiModal(): void {
    setOpenModal(true)
  }

  function handleModalClose(): void {
    setOpenModal(false)
    setSelectedAiImg('')
    setKeyWordSwitch(false)
    setPaintSwitch(false)
  }

  function handleGenerateImg(): void {
    if (keyWordSwitch && paintSwitch) {
      alert('請選擇其中一個條件')
      return
    } else {
      if (keyWordSwitch) {
        if (prompt === '') {
          alert('請輸入關鍵字')
          return
        }
        setAiImgs([...aiImgs, 'loading'])
        emitGPrompt()
      } else if (paintSwitch) {
        if (!imgUrl || imgUrl === '') {
          alert('當前畫布為空')
          return
        }
        setAiImgs([...aiImgs, 'loading'])
        emitGImg()
      }
      setKeyWordSwitch(false)
      setPaintSwitch(false)
      setPrompt('')
    }
  }

  function mappingAiImg(imgUrl: string): void {
    setSelectedAiImg(imgUrl)
  }

  function handleMapping(): void {
    setAiImg(selectedAiImg)
    handleModalClose()
  }

  return (
    <main>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...basicModal }} className="bg-white">
          <h2 className="text-xl">AI 製圖空間</h2>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center">
                <Switch
                  checked={keyWordSwitch}
                  onChange={() => setKeyWordSwitch(!keyWordSwitch)}
                />
                <span>關鍵字生成：</span>
                <Input
                  placeholder="輸入關鍵字"
                  disabled={!keyWordSwitch}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className="flex items-center">
                <Switch
                  checked={paintSwitch}
                  onChange={() => setPaintSwitch(!paintSwitch)}
                />
                <span>當前畫布生成：</span>
              </div>
              <Button
                variant="contained"
                onClick={handleGenerateImg}
                disabled={!keyWordSwitch && !paintSwitch}
              >
                生成圖片
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex ">
                <span>已生成圖片：</span>
                <div className="flex items-center ">
                  {aiImgs.map((img) => {
                    if (img !== 'loading') {
                      return (
                        <img
                          src={img}
                          key={img}
                          className={`object-cover w-36 h-36 cursor-pointer hover:scale-100  ${
                            selectedAiImg === img ? 'scale-100' : 'scale-90'
                          }`}
                          onClick={() => mappingAiImg(img)}
                        />
                      )
                    } else {
                      return (
                        <div className="w-36 flex justify-center">
                          <CircularProgress />
                        </div>
                      )
                    }
                  })}
                </div>
              </div>
              <Button
                onClick={handleMapping}
                variant="contained"
                disabled={!selectedAiImg}
              >
                套用
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
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
          <div className="flex gap-2">
            <div className="flex gap-2 ">
              <Button
                variant="contained"
                size="small"
                onClick={handleColorPicker}
              >
                {onSelectedColor ? '完成' : '選擇顏色'}
              </Button>
              <Button variant="outlined" size="small" onClick={clearRect}>
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
            <div className="flex gap-2">
              <Button onClick={openAiModal} disabled={!ok}>
                AI製圖
              </Button>
            </div>
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
              aiImgUrl={aiImg}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
