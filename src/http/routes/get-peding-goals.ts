import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../../services/get-week-pending-goals'

// Rota para obter objetivos pendentes da semana
export const createPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/pending-goals', async () => {
    const { pedingGoals } = await getWeekPendingGoals() // Chama o serviço para obter os objetivos pendentes

    return { pedingGoals } // Retorna os objetivos pendentes
  })
}
