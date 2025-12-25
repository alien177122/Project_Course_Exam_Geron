import { createFileRoute } from '@tanstack/react-router'
import { OrdersPage } from '../pages/OrdersPage'

export const Route = createFileRoute('/orders')({
  // Таблица заказов с изменением статуса
  component: OrdersPage,
})
