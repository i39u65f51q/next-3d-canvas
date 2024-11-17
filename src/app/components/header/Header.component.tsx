'use client'

import './Header.css'
import { Avatar, Button } from '@mui/material'
import useAuth from '@/app/store/auth'
import { useRouter } from 'next/navigation'

export default function Header(props: {}): JSX.Element {
  const { name, update } = useAuth()
  const router = useRouter()

  function logout(): void {
    update('')
    router.push('/views/login')
    alert('登出成功')
  }

  return (
    <header className="header">
      <h2 className="text-lg">虛擬畫布：3D模型與繪畫</h2>
      {name !== '' && (
        <div className="flex items-center gap-2">
          <Avatar alt="photo" />
          <span>{name}</span>
          <Button onClick={logout}>登出</Button>
        </div>
      )}
    </header>
  )
}
