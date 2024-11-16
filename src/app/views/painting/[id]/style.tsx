import { CSSProperties } from 'react'

export const Container: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.5rem',
  height: '93%',
  marginTop: '5px',
}

export const ModelHeader: CSSProperties = {
  height: '7%',
  width: '100%',
}

export const ModelWrap: CSSProperties = {
  width: '100%',
  height: '100%',
}

export const CardWrap: CSSProperties = {
  height: '100%',
}

export const Card: CSSProperties = {
  height: 'calc(100% - 30px)',
  border: ' 1px solid #ddd',
}
