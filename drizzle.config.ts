import { defineConfig } from 'drizzle-kit' // Importa a função para definir a configuração
import { env } from './src/env' // Importa variáveis de ambiente

export default defineConfig({
  schema: './src/db/schema.ts', // Caminho do esquema do banco de dados
  out: './.migrations', // Pasta para saídas de migrações
  dialect: 'postgresql', // Tipo de banco de dados utilizado

  dbCredentials: {
    url: env.DATABASE_URL, // URL de conexão com o banco de dados
  },
})
