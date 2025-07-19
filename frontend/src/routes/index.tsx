import { createBrowserRouter } from 'react-router-dom'
import Signin from '../pages/sign/Signin'
import Signup from '../pages/sign/Signup'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
  },
])
