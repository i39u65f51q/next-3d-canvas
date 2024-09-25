import { CSSProperties } from 'react'

export const Container: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.5rem',
  height: '80%',
  marginTop: '5px',
}

export const ModelHeader: CSSProperties = {
  height: '20%',
  width: '100%',
}

export const ModelWrap: CSSProperties = {
  width: '100%',
  height: '100%',
  border: '1px solid black',
}

export const CardWrap: CSSProperties = {
  height: '100%',
}

export const Card: CSSProperties = {
  height: 'calc(100% - 30px)',
  border: ' 1px solid black',
}
