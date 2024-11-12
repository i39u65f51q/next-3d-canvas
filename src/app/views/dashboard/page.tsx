'use client'
import { Avatar, AvatarGroup, Button, Stack } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/* TODO:

頁面功能：
1. 加入畫室
2. 建立畫室
3. 瀏覽畫室

*/

export default function DashboardView() {
  const router = useRouter()

  const temp = [
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
  ]

  // 建立房間
  function createRoom(): void {}

  // 加入房間
  function joinRoom(roomId: number): void {
    console.log('join', roomId)
    router.push(`/views/painting/${roomId}`)
  }

  // 刪除房間
  function deleteRoom(roomId: number): void {
    console.log('delete', roomId)
  }

  // useEffect(() => {
  //   router.push('/views/painting')
  // })

  return (
    <main>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button variant="contained" onClick={() => createRoom()}>
            建立畫室
          </Button>
          <Button>搜尋畫室</Button>
        </div>
        <Stack spacing={2}>
          {temp.map((t) => (
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
                {/* TODO: disabled user and owner */}
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
