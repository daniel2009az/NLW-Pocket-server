import dayjs from 'dayjs'
import { db } from '../db'
import { goals, goalsCompletions } from '../db/schema'
import { and, count, desc, gte, lte, sql } from 'drizzle-orm'
import { eq } from 'drizzle-orm'

export async function getWeekSummary() {
  // Define o primeiro e o último dia da semana
  const lastDayOfWeek = dayjs().endOf('week').toDate()
  const firstDayOfWeek = dayjs().startOf('week').toDate()

  // Seleciona as metas criadas na semana
  const goalsCreatedInTheWeek = db.$with('goals-created-in-the-week').as(
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
          gte(goals.createdAt, firstDayOfWeek),
          lte(goals.createdAt, lastDayOfWeek)
        )
      )
  )

  // Seleciona as metas completadas na semana
  const goalsCompletedInWeek = db.$with('goal-completed-in-week').as(
    db
      .select({
        id: goalsCompletions.id,
        title: goals.title,
        completedAt: goalsCompletions.createdAt,
        completedAtDate: sql /*sql*/`
          DATE(${goalsCompletions.createdAt})
        `.as('completedAtDate'),
      })
      .from(goalsCompletions)
      .innerJoin(goals, eq(goalsCompletions.goalId, goals.id))
      .where(
        and(
          gte(goalsCompletions.createdAt, firstDayOfWeek),
          lte(goalsCompletions.createdAt, lastDayOfWeek),
          gte(goals.createdAt, firstDayOfWeek),
          lte(goals.createdAt, lastDayOfWeek)
        )
      )
  )

  // Agrupa as metas completadas por dia da semana
  const goalsCompletedByWeekDay = db.$with('goals-completed-by-week-day').as(
    db
      .select({
        completedAtDate: goalsCompletedInWeek.completedAtDate,
        completions: sql /*sql*/`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${goalsCompletedInWeek.id},
            'title', ${goalsCompletedInWeek.title},
            'completedAt', ${goalsCompletedInWeek.completedAt}
          )
            ORDER BY(${goalsCompletedInWeek.completedAt}) DESC
        )
        `.as('completions'),
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedAtDate)
      .orderBy(desc(goalsCompletedInWeek.completedAtDate))
  )

  type goalsPerDay = Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >

  // Consulta final para obter o resumo da semana
  const result = await db
    .with(goalsCreatedInTheWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed:
        sql /*sql*/`(SELECT COUNT(${goalsCompletedInWeek}) FROM${goalsCompletedInWeek})`.mapWith(
          Number
        ),
      total:
        sql /*sql*/`(SELECT SUM(${goalsCreatedInTheWeek.desiredWeeklyFrequency}) FROM${goalsCreatedInTheWeek})`.mapWith(
          Number
        ),
      goalsPerDay: sql<goalsPerDay> /*sql */`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate}, ${goalsCompletedByWeekDay.completions}
        )
        `,
    })
    .from(goalsCompletedByWeekDay)

  // Retorna o resumo da semana
  return {
    summary: result[0],
  }
}
