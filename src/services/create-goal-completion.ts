import { count, and, gte, lte, eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { goals, goalsCompletions } from '../db/schema'
import dayjs from 'dayjs'

interface createGoalCompletionRequest {
  goalId: string
}

export async function createGoalCompletions({
  goalId,
}: createGoalCompletionRequest) {
  // Define o primeiro e o último dia da semana atual
  const lastDayOfWeek = dayjs().endOf('week').toDate()
  const firstDayOfWeek = dayjs().startOf('week').toDate()

  // Cria uma subconsulta para contar as conclusões de metas na semana atual
  const goalCompletionCounts = db.$with('goal-completion-count').as(
    db
      .select({
        goalId: goalsCompletions.goalId,
        completionCount: count(goalsCompletions.id).as('completionCount'),
      })
      .from(goalsCompletions)
      .where(
        and(
          gte(goalsCompletions.createdAt, firstDayOfWeek),
          lte(goalsCompletions.createdAt, lastDayOfWeek),
          eq(goalsCompletions.goalId, goalId)
        )
      )
      .groupBy(goalsCompletions.goalId)
  )

  // Consulta principal para obter a frequência desejada e a contagem de conclusões
  const result = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount:
        sql /*sql*/`COALESCE(${goalCompletionCounts.completionCount}, 0)
          `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1)

  const { completionCount, desiredWeeklyFrequency } = result[0]
  // Verifica se a meta já foi concluída na semana
  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed')
  }

  // Insere uma nova conclusão de meta
  const insertResult = await db
    .insert(goalsCompletions)
    .values({ goalId })
    .returning()

  const goalCompletion = result[0]

  // Retorna a conclusão da meta
  return { goalCompletion }
}
