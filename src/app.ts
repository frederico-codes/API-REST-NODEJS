import fastify from 'fastify'

const app = fastify()

export default app

app.get('/hello', async () => {
  return 'Hello'
})
