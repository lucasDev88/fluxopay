import { createRoot } from 'react-dom/client'
import '../style/App.css'
import App from './app'
import { AuthProvider } from '../_services/tsxServices/AuthProvider'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
