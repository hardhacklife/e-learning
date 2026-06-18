import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { persistor, store } from '@/app/store'
import { AuthProvider } from '@/features/auth/context/AuthProvider'
import { Spinner } from '@/components/ui/Spinner'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex min-h-screen items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
        persistor={persistor}
      >
        <BrowserRouter>
          <NuqsAdapter>
            <AuthProvider>{children}</AuthProvider>
          </NuqsAdapter>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}
