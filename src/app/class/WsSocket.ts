import { get } from 'lodash'

export namespace WsSocket {
  export class PaintingModel {
    public readonly name: string
    public readonly x: number
    public readonly y: number
    public readonly color: string
    constructor(name: string, x: number, y: number, color: string) {
      this.name = name
      this.x = x
      this.y = y
      this.color = color
    }
  }

  export class JoinModel {
    public readonly name: string
    public readonly members: string[]
    public readonly img: string
    public readonly aiImgs: string[]
    constructor(payload: unknown) {
      this.name = get(payload, 'name', '')
      this.members = get(payload, 'members', [])
      this.img = get(payload, 'img', '')
      this.aiImgs = get(payload, 'aiImgs', [])
    }
  }

  export class MouseModel {
    public readonly name: string
    public readonly x: number
    public readonly y: number
    constructor(payload: unknown) {
      this.name = get(payload, 'name', '')
      this.x = get(payload, 'x', 0)
      this.y = get(payload, 'y', 0)
    }
  }
}
