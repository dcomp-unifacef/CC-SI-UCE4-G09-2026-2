import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index'
import usersRouter from './routes/users'
import alunosRouter from './routes/alunos'
import evolucoesRouter from './routes/evolucoes'
import turmasRouter from './routes/turmas'
import modalidadesRouter from './routes/modalidades'
import notificacoesRouter from './routes/notificacoes'

const app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

/***************** ROTAS *************************/

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.use('/alunos', alunosRouter)
app.use('/evolucoes', evolucoesRouter)
app.use('/turmas', turmasRouter)
app.use('/modalidades', modalidadesRouter)
app.use('./notificacoes', notificacoesRouter)
export default app
