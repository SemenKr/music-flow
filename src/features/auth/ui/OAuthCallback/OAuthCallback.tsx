// Компонент, который рендерится на странице callback после успешной OAuth-авторизации.
// Его задача — получить code из URL, отправить его в основное окно
// и закрыть popup.

import { useEffect } from 'react'
import { getAppOrigin } from '@/common/utils'

export const OAuthCallback = () => {
  useEffect(() => {
    // Создаем объект URL на основе текущего адреса страницы
    const url = new URL(window.location.href)
    // Извлекаем параметр "code" из query-строки (?code=...)
    const code = url.searchParams.get('code')
    const appOrigin = getAppOrigin()

    // Если код существует и страница была открыта из другого окна (popup),
    // отправляем сообщение в родительское окно
    if (code && window.opener) {
      // Передаем code через postMessage
      window.opener.postMessage({ code }, appOrigin)
    }

    // Закрываем popup после отправки сообщения
    window.close()
  }, [])

  // Небольшой текст на случай, если закрытие окна произойдет не мгновенно
  return <p>Logging you in...</p>
}
