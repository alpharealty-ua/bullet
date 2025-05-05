import { toast } from 'react-toastify'
import { Socket } from 'socket.io-client'

export const notify = (
  message: string,
  type: 'info' | 'success' | 'error' | 'warning',
) => {
  !import.meta.env.PROD && toast[type](message)
}

export class SocketEvents {
  protected eventListener: (() => void)[] = []

  constructor(protected socket: Socket) {}

  dettachEventListeners() {
    let off = null
    while ((off = this.eventListener.pop())) {
      off()
    }
  }

  on<T>(event: string, handler: (...args: T[]) => void) {
    this.socket.on(event, handler)

    this.eventListener.push(() => {
      this.socket.off(event, handler)
    })
  }

  off<T>(event: string, handler: (...args: T[]) => void) {
    this.socket.off(event, handler)
  }
}
