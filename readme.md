# NLW Pocket Server In.orbit

Este é o repositório do **NLW Pocket Server**, parte de um projeto **"In.orbit"** desenvolvido durante a **Next Level Week** da **Rocketseat**.

## 📋 Descrição

O NLW Pocket Server é a API backend desenvolvida para o gerenciamento de metas semanais, com foco em desempenho, escalabilidade e boas práticas. Este servidor é responsável por lidar com autenticação, armazenamento de dados e outras funcionalidades necessárias para a operação do aplicativo In.orbit.

## 🚀 Tecnologias

As principais tecnologias usadas neste projeto incluem:

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Fastify**: Framework web altamente eficiente para construção de APIs.
- **Drizzle ORM**: ORM para gerenciamento do banco de dados.
- **PostgreSQL**: Banco de dados relacional utilizado no projeto.
- **Zod**: Biblioteca para validação de esquemas.
- **Day.js**: Biblioteca para manipulação de datas.
- **Docker**: Para criaçao do container do banco 
## 🛠️ Configuração do Servidor
O servidor é configurado utilizando Fastify com suporte a CORS. As rotas são registradas para gerenciar a criação de metas, a conclusão de metas e o resumo semanal

## 📊 Esquema do Banco de Dados
**Tabela *goals***
id: ID do objetivo (string, chave primária, gerado automaticamente).
title: Título do objetivo (string, não pode ser nulo).
desiredWeeklyFrequency: Frequência desejada semanal (inteiro, não pode ser nulo).
createdAt: Data de criação (timestamp com timezone, não pode ser nulo, padrão é a data atual).
**Tabela *goals_completions***
id: ID da conclusão (string, chave primária, gerado automaticamente).
goalId: ID do objetivo correspondente (string, referência à tabela goals, não pode ser nulo).
createdAt: Data de criação da conclusão (timestamp com timezone, não pode ser nulo, padrão é a data atual).

## 📚 Documentação da API
- Criação de Metas
POST /goals: Cria uma nova meta.

- Conclusão de Metas
POST /completions: Registra a conclusão de uma meta.

- Resumo Semanal
GET /summary: Obtém um resumo das metas da semana.

- Metas Pendentes
GET /pending-goals: Obtém as metas pendentes da semana.


Agradeço a [Rocketseat](https://www.rocketseat.com.br/) pelo maravilhoso bootcamp.
Como estudante e alguem que deseja entrar na area isso é uma experiência valiosa.
[Linkedin: Daniel Duarte Azvedo](https://www.linkedin.com/in/daniel-duarte-azevedo-64590a167/)
