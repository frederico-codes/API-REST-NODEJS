import { knex as setupKnex } from 'knex'

export const knex = setupKnex({
  client: 'sqlite', // or 'better-sqlite3'
  connection: {
    filename: './tmp/app.db',
  },
  useNullAsDefault: true,
})
