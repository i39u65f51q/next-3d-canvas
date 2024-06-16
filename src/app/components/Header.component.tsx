import Link from 'next/link'
import './Header.css'

export default function Header(props: {}): JSX.Element {
  return (
    <header className="header">
      <h2>虛擬畫布：3D模型與繪畫</h2>
      <nav>
        <Link href="/views/modeling">建模</Link>
        <Link href="/views/painting">繪畫</Link>
        <Link href="/views/display">展示</Link>
      </nav>
    </header>
  )
}
