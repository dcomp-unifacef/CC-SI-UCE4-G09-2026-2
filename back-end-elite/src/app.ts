import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index'
import usersRouter from './routes/users'
import alunosRouter from './routes/alunos'
import evolucoesRouter from './routes/evolucoes'
import modalidadesRouter from './routes/modalidades'
import horariosRouter from './routes/horarios'
import aulasParticularesRouter from './routes/aulasParticulares'
import { errorHandler } from './middlewares/errorHandler'

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
app.use('/modalidades', modalidadesRouter)
app.use('/horarios', horariosRouter)
app.use('/aulas-particulares', aulasParticularesRouter)

//Tratamento de erros
app.use(errorHandler)

export default app
