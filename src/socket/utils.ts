import { toast } from 'react-toastify'
import { Socket } from 'socket.io-client'

export const notify = (
  message: string,
  type: 'info' | 'success' | 'error' | 'warning',
) => {
  !import.meta.env.PROD && toast[type](message)
}

export class SocketEvents<EventList = undefined> {
  protected socketEventListeners: (() => void)[] = []
  protected eventListeners: ((event: EventList) => void)[] = []

  constructor(protected socket: Socket) {}

  onEvent(event: EventList) {
    this.eventListeners.forEach((onEvent) => onEvent(event))
  }

  addEventsListener(onEvent: (event: EventList) => void) {
    this.eventListeners.push(onEvent)
  }

  removeEventsListener(onEvent: (event: EventList) => void) {
    const index = this.eventListeners.findIndex((onEvt) => onEvt === onEvent)

    if (index === -1) {
      return
    }

    this.eventListeners.splice(index, 1)
  }

  dettachEventListeners() {
    let off = null
    while ((off = this.socketEventListeners.pop())) {
      off()
    }
  }

  on<T>(event: string, handler: (...args: T[]) => void) {
    this.socket.on(event, handler)

    this.socketEventListeners.push(() => {
      this.socket.off(event, handler)
    })
  }

  off<T>(event: string, handler: (...args: T[]) => void) {
    this.socket.off(event, handler)
  }
}
