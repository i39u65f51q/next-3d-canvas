import { CSSProperties } from 'react'

export const Container: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.5rem',
}

export const CardWrap: CSSProperties = {
  height: '100%',
}

export const Card: CSSProperties = {
  height: 'calc(100% - 30px)',
  border: ' 1px solid black',
}
