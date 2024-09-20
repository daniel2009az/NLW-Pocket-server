import { db } from '../db' // Importa a conexão com o banco de dados
import { goals } from '../db/schema' // Importa o esquema da tabela goals

// Define a estrutura do pedido para criar uma meta
interface createGoalRequest {
  title: string // Título da meta
  desiredWeeklyFrequency: number // Frequência desejada semanal
}

// Função assíncrona para criar uma nova meta
export async function createGoal({
  title,
  desiredWeeklyFrequency,
}: createGoalRequest) {
  // Insere a nova meta no banco de dados e retorna o resultado
  const result = await db
    .insert(goals)
    .values({
      title, // Define o título da meta
      desiredWeeklyFrequency, // Define a frequência desejada
    })
    .returning() // Retorna a nova meta inserida

  const goal = result[0] // Armazena a meta criada

  return { goal } // Retorna a meta criada
}
