import { io, Socket } from 'socket.io-client'

// Храним единственный экземпляр сокета (Singleton)
let socket: Socket | null = null

// Функция получения сокета
export const getSocket = (): Socket => {
  // Если сокет ещё не создан — создаём соединение
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      path: '/api/1.0/ws', // кастомный путь Socket.IO сервера
      transports: ['websocket'], // используем только WebSocket (без polling)
    })

    // Срабатывает при успешном подключении
    socket.on('connect', () => console.log('✅ Connected to server'))

    // Срабатывает при разрыве соединения
    socket.on('disconnect', () => console.log('❌ Disconnected from server'))
  }

  // Возвращаем существующий сокет (или только что созданный)
  return socket
}
