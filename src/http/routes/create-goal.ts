import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod' // Importa tipo para plugin Fastify com Zod
import { z } from 'zod' // Importa biblioteca Zod para validação de esquemas
import { createGoal } from '../../services/create-goal' // Importa função de criação de meta

// Define rota para criação de metas
export const createGoalRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals', // Rota para a criação de metas
    {
      schema: {
        body: z.object({
          // Define esquema para o corpo da requisição
          title: z.string(), // Campo título deve ser uma string
          desiredWeeklyFrequency: z.number().int().min(1).max(7), // Frequência semanal deve ser um número inteiro entre 1 e 7
        }),
      },
    },
    async request => {
      const { title, desiredWeeklyFrequency } = request.body // Desestrutura os dados do corpo da requisição

      await createGoal({
        // Chama a função para criar a meta com os dados extraídos
        title,
        desiredWeeklyFrequency,
      })
    }
  )
}
