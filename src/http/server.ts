import fastify from 'fastify' // Importa o framework Fastify
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod' // Importa provedores de tipo do Zod
import { createGoalRoute } from './routes/create-goal' // Importa rota para criar metas
import { createCompletionRoute } from './routes/create-completion' // Importa rota para criar conclusões
import { createPendingGoalsRoute } from './routes/get-peding-goals' // Importa rota para obter metas pendentes
import { getWeekSummaryRoute } from './routes/get-week-summary' // Importa rota para resumo semanal
import fastifyCors from '@fastify/cors' // Importa suporte a CORS

const app = fastify().withTypeProvider<ZodTypeProvider>() // Inicializa o aplicativo Fastify com provedores de tipo Zod

app.register(fastifyCors, {
  // Registra o middleware CORS
  origin: '*', // Permite requisições de qualquer origem
})

app.setValidatorCompiler(validatorCompiler) // Define compilador de validação
app.setSerializerCompiler(serializerCompiler) // Define compilador de serialização

// Registra as rotas no aplicativo
app.register(createPendingGoalsRoute)
app.register(createGoalRoute)
app.register(createCompletionRoute)
app.register(getWeekSummaryRoute)

// Inicia o servidor na porta 3333 e exibe mensagem de status
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server running on http://localhost:3333') // Mensagem de confirmação
  })
