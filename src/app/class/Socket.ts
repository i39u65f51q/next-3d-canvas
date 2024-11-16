export class SocketModel {
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
