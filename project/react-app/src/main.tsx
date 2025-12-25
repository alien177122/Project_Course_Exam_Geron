import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.ts'
import "./index.css"

// Собираем дерево маршрутов, сгенерированное TanStack Router
// routeTree генерируется при старте dev-сервера или сборке
const router = createRouter({ routeTree })

// Регистрируем router в типах TanStack, чтобы useNavigate и др. знали о маршрутах
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Корневая точка монтирования приложения */}
    <RouterProvider router={router} />
  </StrictMode>,
)
