import { AppProviders } from '@/app/providers'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/app/ui/App/App'

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>,
)
