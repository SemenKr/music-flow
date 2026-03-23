# music-flow

Frontend на `React + TypeScript + Vite`.

## Local run

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Deploy to Vercel

Проект готов к статическому деплою на Vercel:

- роутинг через `BrowserRouter` поддержан rewrite-правилом в `vercel.json`
- OAuth callback строится от текущего origin, поэтому домен Vercel не зашит в код
- `VITE_BASE_URL` нормализуется со слешем на конце, чтобы API-роуты не ломались

Задай в Vercel переменные окружения:

```bash
VITE_BASE_URL=https://musicfun.it-incubator.app/api/1.0/
VITE_API_KEY=your_api_key
VITE_SOCKET_URL=https://musicfun.it-incubator.app
```

`VITE_DOMAIN_ADDRESS` больше не требуется.
