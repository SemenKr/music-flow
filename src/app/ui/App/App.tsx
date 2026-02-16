import {Header} from '@/common/components';
import {Routing} from '@/common/routing';
import {ToastContainer} from 'react-toastify';
import s from './App.module.css'

function App() {
    return (
        <>
            <Header/>
            <main className={s.layout}>
                <Routing/>
            </main>
            <ToastContainer />
        </>
    )
}

export default App
