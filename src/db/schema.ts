import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

// Tabela para armazenar os objetivos
export const goals = pgTable('goals', {
  id: text('id') // ID do objetivo, tipo text
    .primaryKey()
    .$defaultFn(() => createId()), // Geração automática de ID
  title: text('title').notNull(), // Título do objetivo, não pode ser nulo
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(), // Frequência desejada por semana, não pode ser nulo
  createdAt: timestamp('created_at', { withTimezone: true }) // Data de criação, com timezone
    .notNull()
    .defaultNow(), // Valor padrão é a data atual
})

// Tabela para armazenar as conclusões dos objetivos
export const goalsCompletions = pgTable('goals_completions', {
  id: text('id') // ID da conclusão, tipo text
    .primaryKey()
    .$defaultFn(() => createId()), // Geração automática de ID
  goalId: text('goal_id') // ID do objetivo correspondente, tipo text
    .references(() => goals.id) // Referência ao ID da tabela 'goals'
    .notNull(), // Não pode ser nulo
  createdAt: timestamp('created_at', { withTimezone: true }) // Data de criação da conclusão, com timezone
    .notNull()
    .defaultNow(), // Valor padrão é a data atual
})
