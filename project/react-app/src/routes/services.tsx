import { createFileRoute } from '@tanstack/react-router'
import { ServicesPage } from '../pages/ServicesPage'

export const Route = createFileRoute('/services')({
  // Каталог услуг с поиском и удалением
  component: ServicesPage,
})
