import dayjs from 'dayjs'
import { db } from '../db'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { goals, goalsCompletions } from '../db/schema'

// Função para obter metas pendentes da semana
export async function getWeekPendingGoals() {
  const lastDayOfWeek = dayjs().endOf('week').toDate() // Último dia da semana
  const firstDayOfWeek = dayjs().startOf('week').toDate() // Primeiro dia da semana

  // Subconsulta para metas criadas até a semana atual
  const goalsCreatedUpToWeek = db.$with('goals-created-up-to-week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(
        and(
          lte(goals.createdAt, lastDayOfWeek),
          gte(goals.createdAt, firstDayOfWeek)
        )
      )
  )

  // Subconsulta para contagem de completions das metas na semana
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
          lte(goalsCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalsCompletions.goalId)
  )

  // Consulta final para obter metas pendentes
  const pedingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionCounts)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount:
        sql /*sql*/`COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number),
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalsCreatedUpToWeek.id, goalCompletionCounts.goalId)
    )

  return { pedingGoals }
}
