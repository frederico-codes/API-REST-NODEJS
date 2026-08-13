import { knex as setupKnex } from 'knex'

export const config = {
  client: 'sqlite3',
  connection: {
    filename: './src/tmp/app.db',
  },
  useNullAsDefault: true,

  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
}

export const knex = setupKnex(config)
