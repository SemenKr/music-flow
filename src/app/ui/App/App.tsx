import { Header } from '@/common/components'
import { useGlobalLoading } from '@/common/hooks'
import { AppRouter } from '@/app/router'
import { ToastContainer } from 'react-toastify'
import s from './App.module.css'

function App() {
  const isGlobalLoading = useGlobalLoading()

  return (
    <>
      <Header showProgress={isGlobalLoading} />
      <main className={s.layout}>
        <AppRouter />
      </main>
      <ToastContainer />
    </>
  )
}

export default App
