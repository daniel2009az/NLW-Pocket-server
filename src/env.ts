import z from 'zod'
// Define a schema for the environment variables
const envSchema = z.object({
  // Cria um schema com as variáveis de ambiente
  DATABASE_URL: z.string().url(), // Define que a variável DATABASE_URL é uma string e deve ser uma URL
})

export const env = envSchema.parse(process.env) // exporta  a variável env que é o resultado do parse do schema com as variáveis de ambiente
