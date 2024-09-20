import { client, db } from '.'
import { goals, goalsCompletions } from './schema'
import dayjs from 'dayjs'

async function seed() {
  // Deleta dados existentes nas tabelas goalsCompletions e goals
  await db.delete(goalsCompletions)
  await db.delete(goals)

  // Insere novos objetivos na tabela goals
  const result = await db
    .insert(goals)
    .values([
      { title: 'Learn to cook', desiredWeeklyFrequency: 3 },
      { title: 'Read more books', desiredWeeklyFrequency: 2 },
      { title: 'Exercise', desiredWeeklyFrequency: 4 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  // Insere completions para os objetivos na tabela goalsCompletions
  await db.insert(goalsCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

// Executa a função seed e encerra a conexão com o banco de dados
seed().finally(() => {
  client.end()
})
