import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { router } from './routes/index.tsx'
import { RouterProvider } from 'react-router-dom'

// Styles
import './styles/index.css'
import './styles/vendor/pucoui.min.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
