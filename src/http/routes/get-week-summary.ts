import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekSummary } from '../../services/get-week-summary'

// Rota para obter o resumo semanal
export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/summary', async () => {
    const { summary } = await getWeekSummary() // Chama o serviço para obter o resumo

    return { summary } // Retorna o resumo
  })
}
