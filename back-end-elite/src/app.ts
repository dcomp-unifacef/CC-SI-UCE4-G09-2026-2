import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index'
import usersRouter from './routes/users'
import alunosRouter from './routes/alunos'
import evolucoesRouter from './routes/evolucoes'
import aulaRouter from './routes/aula'
import professorRouter from './routes/professor'
import pessoaRouter from './routes/pessoa'
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
app.use('/aula', aulaRouter)
app.use('/professor', professorRouter)
app.use('/pessoa', pessoaRouter)

export default app
