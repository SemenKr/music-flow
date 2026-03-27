import { store } from '@/app/model/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import type { PropsWithChildren } from 'react'

export const AppProviders = ({ children }: PropsWithChildren) => (
  <BrowserRouter>
    <Provider store={store}>{children}</Provider>
  </BrowserRouter>
)
