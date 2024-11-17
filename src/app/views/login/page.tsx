'use client'
import useAuth from '@/app/store/auth'
import { Button, Input } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginView(props: {}): JSX.Element {
  const { name, update } = useAuth()
  const [input, setInput] = useState<string>('')
  const router = useRouter()

  function submit(): void {
    update(input)

    router.push('/views/dashboard')
    setInput('')
  }

  return (
    <main className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <span>請輸入您的名稱：</span>
          <Input onChange={(e) => setInput(e.target.value)} value={input} />
        </div>
        <Button variant="contained" onClick={submit} disabled={input === ''}>
          進入平台
        </Button>
      </div>
    </main>
  )
}
