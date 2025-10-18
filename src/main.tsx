
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/tailwind.css'
import App from './App'
import Dashboard from './pages/Dashboard'
import Radiografia from './pages/Radiografia'
import Deudas from './pages/Deudas'
import Fondo from './pages/Fondo'
import Tareas from './pages/Tareas'
import Recursos from './pages/Recursos'
import Perfil from './pages/Perfil'
import Coach from './pages/Coach'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'radiografia', element: <Radiografia /> },
      { path: 'deudas', element: <Deudas /> },
      { path: 'fondo', element: <Fondo /> },
      { path: 'tareas', element: <Tareas /> },
      { path: 'recursos', element: <Recursos /> },
      { path: 'perfil', element: <Perfil /> },
      { path: 'coach', element: <Coach /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
