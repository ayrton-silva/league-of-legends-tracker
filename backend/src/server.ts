import { fastifyCors } from '@fastify/cors'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env.ts'
import { getSummonersRoute } from './http/routes/get-summoners-by-nickname.ts'
import { getSummonerRoute } from './http/routes/get-summoner-by-nickname-and-tagname.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', () => {
  return 'OK'
})

app.register(getSummonersRoute)
app.register(getSummonerRoute)

app.listen({ port: env.PORT })
