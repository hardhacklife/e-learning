import { AppProviders } from '@/app/providers/AppProviders'
import { AppRoutes } from '@/routes'

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}
