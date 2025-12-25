import { createFileRoute } from '@tanstack/react-router'
import { MainPage } from '../pages/MainPage'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  // Главная точка входа: проверяет авторизацию и редиректит внутри MainPage
  return <MainPage />
}
