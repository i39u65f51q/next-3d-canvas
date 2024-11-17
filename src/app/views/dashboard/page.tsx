'use client'
import useAuth from '@/app/store/auth'
import { basicModal } from '@/app/styles/style'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Input,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardView() {
  const auth = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [snackbarState, setSnackbarState] = useState<{
    open: boolean
    message: string
  }>({
    open: false,
    message: '',
  })
  const [newName, setNewName] = useState<string>('')
  const [selectedModal, setSelectedModal] = useState<number>(1)
  const [roomList, setRoomList] = useState([
    {
      id: 1,
      name: '畢卡索畫室',
      modelId: 1,
      imgId: 1,
      members: [
        { id: 1, name: 'Alan' },
        { id: 2, name: 'Ben' },
      ],
      owner: { id: 1, name: 'Alan' },
    },
  ])

  const modalOptions = [
    {
      value: 1,
      name: '正方型',
    },
    {
      value: 2,
      name: '圓型',
    },
  ]

  // 建立房間
  function createRoom(): void {
    setRoomList([
      ...roomList,
      {
        id: 1,
        name: newName,
        modelId: 1,
        imgId: 1,
        members: [{ id: 1, name: auth.name }],
        owner: { id: 1, name: auth.name },
      },
    ])
    handleModalClose()
  }

  // 加入房間
  function joinRoom(roomId: number): void {
    router.push(`/views/painting/${roomId}`)
  }

  // 刪除房間
  function deleteRoom(roomId: number): void {
    console.log('delete', roomId)
  }

  function handleModalClose(): void {
    setOpen(false)
    setNewName('')
  }

  function onValueChanged(event: any): void {
    setNewName(event.target.value)
  }

  function onModalChanged(event: any): void {
    setSelectedModal(event.target.value)
  }

  function closeSnackBar(): void {
    setSnackbarState({ ...snackbarState, open: false, message: '' })
  }
  useEffect(() => {
    if (!auth.name) {
      router.push('/views/login')
      return
    }

    setSnackbarState({
      open: true,
      message: `登入成功：歡迎 ${auth.name} 加入虛擬畫布平台`,
    })
  }, [])

  return (
    <main>
      <Snackbar
        open={snackbarState.open}
        message={snackbarState.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={closeSnackBar}
        autoHideDuration={2000}
        key="dashboard-snackbar"
      />
      <Modal open={open} onClose={handleModalClose}>
        <Box className="bg-white" sx={{ ...basicModal }}>
          <h2 className="text-xl">建立畫室</h2>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <label htmlFor="room-name">畫室名稱</label>
              <Input id="room-name" onChange={onValueChanged} value={newName} />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="room-type">選擇模型</label>
              <Select
                id="room-type"
                onChange={onModalChanged}
                value={selectedModal}
              >
                {modalOptions.map((option) => {
                  return (
                    <MenuItem value={option.value} key={option.name}>
                      {option.name}
                    </MenuItem>
                  )
                })}
              </Select>
            </div>
            <div className="flex items-center justify-end">
              <Button variant="contained" onClick={() => createRoom()}>
                建立
              </Button>
              <Button onClick={() => handleModalClose()}>取消</Button>
            </div>
          </div>
        </Box>
      </Modal>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="contained" onClick={() => setOpen(true)}>
            建立畫室
          </Button>
          <Button>搜尋畫室</Button>
        </div>
        <Stack spacing={2}>
          {roomList.map((t) => (
            <div
              className="w-full border flex justify-between px-4 py-1 rounded shadow items-center cursor-pointer transition ease-in-out"
              key={t.id}
            >
              <span>編號: {t.id}</span>
              <span>名稱: {t.name}</span>
              <span>模型: {t.modelId}</span>
              <div className="flex items-center">
                <span>擁有人: </span>
                <Avatar alt={t.owner.name} />
              </div>
              <div className="flex items-center">
                <span>成員:</span>
                <AvatarGroup max={4}>
                  {t.members.map((member) => (
                    <Avatar alt={member.name} key={member.id} />
                  ))}
                </AvatarGroup>
              </div>

              <div className="flex items-center">
                <Button onClick={() => joinRoom(t.id)}>加入</Button>
                <Button color="error" disabled onClick={() => deleteRoom(t.id)}>
                  刪除
                </Button>
              </div>
            </div>
          ))}
        </Stack>
      </div>
    </main>
  )
}
