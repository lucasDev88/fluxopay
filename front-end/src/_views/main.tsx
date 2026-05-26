// main.tsx
import { createRoot } from 'react-dom/client'
import '../style/App.css'
import App from './app'
import { AuthProvider } from '../_services/tsxServices/AuthProvider'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)