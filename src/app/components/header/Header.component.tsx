import Link from 'next/link'
import './Header.css'
import { Avatar, Button } from '@mui/material'

/* TODO:
1. 串接User Info


*/

export default function Header(props: {}): JSX.Element {
  return (
    <header className="header">
      <h2 className="text-lg">虛擬畫布：3D模型與繪畫</h2>
      <div className="flex items-center gap-2">
        <Avatar alt="photo" />
        <span>Name</span>
      </div>
    </header>
  )
}
