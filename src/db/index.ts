import { drizzle } from 'drizzle-orm/postgres-js' // Importa o drizzle
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '../env'

export const client = postgres(env.DATABASE_URL) // Cria uma conexão com o banco de dados

export const db = drizzle(client, { schema, logger: true }) // Cria uma instância do drizzle com o client e o schema e ativa o logger do terminal
