import { createFileRoute } from '@tanstack/react-router'
import { TariffsPage } from '../pages/TariffsPage'

export const Route = createFileRoute('/tariffs')({
  // Основная страница CRUD по тарифам
  component: TariffsPage,
})
