import { createFileRoute } from '@tanstack/react-router'
import { RevenuePage } from '../pages/RevenuePage'

export const Route = createFileRoute('/revenue')({
  // График доходов (Chart.js)
  component: RevenuePage,
})
