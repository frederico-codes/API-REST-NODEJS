# API REST Node.js

API REST para gerenciamento de transações financeiras, desenvolvida com Node.js, TypeScript e Fastify. A aplicação organiza as transações por sessão, identificada por um cookie HTTP, e permite alternar entre SQLite e PostgreSQL por configuração de ambiente.

## Tecnologias

- Node.js 18+
- TypeScript
- Fastify
- Knex.js
- SQLite ou PostgreSQL
- Zod
- Vitest e Supertest
- ESLint
- tsup

## Pré-requisitos

- Node.js 18 ou superior
- npm
- SQLite para execução local com banco de arquivo ou uma instância PostgreSQL

## Instalação

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
DATABASE_CLIENT=sqlite
DATABASE_URL=./db/app.db
PORT=3333
```

Para utilizar PostgreSQL, configure o cliente e informe uma URL de conexão válida:

```env
NODE_ENV=development
DATABASE_CLIENT=pg
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
PORT=3333
```

As variáveis são validadas na inicialização. `DATABASE_CLIENT` aceita apenas `sqlite` ou `pg`; `PORT` assume `3333` quando não informado; `NODE_ENV` assume `production` quando não informado.

## Banco de dados

Execute as migrações para criar e atualizar a estrutura do banco:

```bash
npm run knex migrate:latest
```

Para desfazer a última migração:

```bash
npm run knex migrate:rollback
```

Para desfazer todas as migrações:

```bash
npm run knex migrate:rollback --all
```

As migrações ficam em `db/migrations` e são executadas pelo Knex com suporte a TypeScript.

## Execução

### Desenvolvimento

```bash
npm run dev
```

O servidor inicia na porta definida por `PORT` e escuta em `0.0.0.0`.

### Build

```bash
npm run build
```

O bundle de produção é gerado no diretório `build`.

### Lint

```bash
npm run lint
```

### Testes

```bash
npm test
```

Os testes recriam o esquema do banco antes de cada caso. Para executar os testes com uma configuração separada, crie `.env.test` na raiz, por exemplo:

```env
NODE_ENV=test
DATABASE_CLIENT=sqlite
DATABASE_URL=./db/test.db
PORT=3333
```

## API

A API usa o prefixo `/transactions`. A sessão é criada automaticamente no primeiro cadastro e enviada no cookie `sessionId`. As rotas de consulta exigem esse cookie.

### Criar transação

`POST /transactions`

Não exige sessão prévia. Quando o cookie `sessionId` não existe, a API cria uma sessão, define o cookie por sete dias e associa a transação a ela.

Requisição:

```bash
curl -i -X POST http://localhost:3333/transactions \
  -H "Content-Type: application/json" \
  -d '{"title":"Salário","amount":5000,"type":"credit"}'
```

Corpo:

```json
{
  "title": "Salário",
  "amount": 5000,
  "type": "credit"
}
```

`type` aceita `credit` ou `debit`. Débitos são armazenados como valores negativos. Uma criação válida retorna `201 Created`.

### Listar transações

`GET /transactions`

Exige o cookie `sessionId` e retorna somente as transações da sessão atual.

```bash
curl http://localhost:3333/transactions \
  -H "Cookie: sessionId=<seu-session-id>"
```

Resposta:

```json
{
  "transactions": [
    {
      "id": "uuid",
      "title": "Salário",
      "amount": 5000,
      "created_at": "2026-08-19T12:00:00.000Z",
      "session_id": "uuid"
    }
  ]
}
```

### Buscar uma transação

`GET /transactions/:id`

Exige o cookie `sessionId` e um identificador UUID. A busca é limitada à sessão atual.

```bash
curl http://localhost:3333/transactions/<transaction-id> \
  -H "Cookie: sessionId=<seu-session-id>"
```

### Consultar resumo

`GET /transactions/summary`

Exige o cookie `sessionId` e retorna a soma dos valores das transações da sessão.

```bash
curl http://localhost:3333/transactions/summary \
  -H "Cookie: sessionId=<seu-session-id>"
```

Resposta:

```json
{
  "summary": {
    "amount": 3000
  }
}
```

## Segurança de sessão

- O cookie `sessionId` identifica a sessão do usuário.
- Consultas sem esse cookie retornam `401 Unauthorized`.
- Cada transação é filtrada pelo `session_id`, impedindo que uma sessão consulte os registros de outra por meio das rotas disponíveis.

## Estrutura do projeto

```text
src/
├── app.ts                         # Configuração do Fastify e registro das rotas
├── server.ts                      # Inicialização do servidor HTTP
├── database.ts                    # Configuração e conexão do Knex
├── env/index.ts                   # Carregamento e validação do ambiente
├── middlewares/                   # Middlewares da aplicação
└── routes/transactions.ts         # Endpoints de transações

db/migrations/                     # Migrações do banco de dados
test/transactions.spec.ts          # Testes de integração das rotas
```

## Licença

Este projeto está configurado com a licença `ISC`, conforme o `package.json`.
