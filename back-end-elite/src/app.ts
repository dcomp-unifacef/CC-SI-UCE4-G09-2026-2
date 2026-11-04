import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index'
import usersRouter from './routes/users'
import alunosRouter from './routes/alunos'
import evolucoesRouter from './routes/evolucoes'
import presencasRouter from './routes/presencas'
import campeonatosRouter from './routes/campeonatos'
import { AppError } from './errors/AppError'
import type { NextFunction, Request, Response } from 'express'
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
app.use('/presencas', presencasRouter)
app.use('/campeonatos', campeonatosRouter)

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message })
    return
  }

  if (error.message === 'Id inválido.') {
    res.status(400).json({ message: error.message })
    return
  }

  console.error(error)
  res.status(500).json({ message: 'Erro interno do servidor.' })
})

export default app
