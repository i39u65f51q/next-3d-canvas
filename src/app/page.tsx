'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/* TODO:
進入頁面時：
1. 身份驗證

*/

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/views/dashboard')
  })

  return <main></main>
}
