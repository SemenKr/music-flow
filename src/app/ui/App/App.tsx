import {Header} from '@/common/components';
import {useGlobalLoading} from '@/common/hooks';
import {Routing} from '@/common/routing';
import {ToastContainer} from 'react-toastify';
import s from './App.module.css'

function App() {

    const isGlobalLoading = useGlobalLoading()

    return (
        <>
            <Header showProgress={isGlobalLoading} />
            <main className={s.layout}>

                <Routing/>

            </main>
            <ToastContainer/>
        </>
    )
}

export default App
