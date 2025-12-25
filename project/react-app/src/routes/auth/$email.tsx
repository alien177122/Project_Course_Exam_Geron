import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/$email')({
  component: RouteComponent,
})

function RouteComponent() {
  // Любые ссылки вида /auth/:email перенаправляем на обычную страницу авторизации
  return <Navigate to="/auth" />
}
