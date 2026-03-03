import { Path } from '@/common/routing'
import { useLoginMutation } from '@/features/auth/api/authApi'
import s from './Login.module.css'

export const Login = () => {
    // Хук RTK Query для выполнения запроса логина
    const [login] = useLoginMutation()

    const loginHandler = () => {
        // Формируем redirectUri — адрес, на который OAuth-сервер
        // перенаправит пользователя после успешной авторизации
        const redirectUri =
            import.meta.env.VITE_DOMAIN_ADDRESS + Path.OAuthRedirect

        // Формируем URL для старта OAuth-процесса на backend.
        // Передаем callbackUrl, чтобы сервер знал,
        // куда вернуть пользователя после авторизации.
        const url = `${import.meta.env.VITE_BASE_URL}auth/oauth-redirect?callbackUrl=${redirectUri}`

        // Открываем popup-окно с OAuth-страницей
        // Размеры заданы явно для удобства пользователя
        window.open(url, 'oauthPopup', 'width=500, height=600')

        // Обработчик сообщений из popup-окна
        // Ожидаем, что после авторизации окно отправит нам postMessage с кодом
        const receiveMessage = async (event: MessageEvent) => {
            // Проверяем источник сообщения (безопасность)
            // Игнорируем сообщения не с нашего домена
            if (event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) return

            const { code } = event.data

            // Если код авторизации отсутствует — выходим
            if (!code) return

            // Удаляем слушатель, чтобы избежать повторной обработки
            window.removeEventListener('message', receiveMessage)

            // Отправляем код на backend для обмена на access/refresh токены
            login({
                code,
                redirectUri,
                rememberMe: false,
            })
        }

        // Подписываемся на получение сообщений от popup
        window.addEventListener('message', receiveMessage)
    }

    return (
        <button
            type="button"
            className={s.loginButton}
            onClick={loginHandler}
            aria-label="Log in"
        >
            {/* Иконка кнопки (декоративная) */}
            <span className={s.icon} aria-hidden="true" />

            {/* Текст кнопки */}
            <span className={s.label}>login</span>
        </button>
    )
}
