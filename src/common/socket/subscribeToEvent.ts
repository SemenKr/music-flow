import type { SocketEvents } from '@/common/constants'
import { getSocket } from './getSocket.ts'
import type { Socket } from 'socket.io-client'

// Тип callback функции, которая будет вызываться при получении события
type Callback<T> = (data: T) => void

// Универсальная функция подписки на WebSocket событие
export const subscribeToEvent = <T>(event: SocketEvents, callback: Callback<T>) => {
  // Получаем существующее socket соединение (Singleton)
  const socket: Socket = getSocket()

  // Подписываемся на событие от сервера
  socket.on(event, callback)

  // Возвращаем функцию отписки (cleanup)
  return () => {
    socket.off(event, callback) // удаляем слушатель события
  }
}
