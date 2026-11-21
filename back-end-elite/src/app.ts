import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import logger from 'morgan'

import indexRouter from './routes/index'
import usersRouter from './routes/users'
import alunosRouter from './routes/alunos'
import evolucoesRouter from './routes/evolucoes'
import aulaRouter from './routes/aula'
import professorRouter from './routes/professor'
import pessoaRouter from './routes/pessoa'
import turmasRouter from './routes/turmas'
import notificacoesRouter from './routes/notificacoes'
import modalidadesRouter from './routes/modalidades'
import horariosRouter from './routes/horarios'
import aulasParticularesRouter from './routes/aulasParticulares'
import presencasRouter from './routes/presencas'
import campeonatosRouter from './routes/campeonatos'
import financeiroRouter from './routes/financeiro'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors({ origin: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean) }))

/***************** ROTAS *************************/

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/alunos', alunosRouter)
app.use('/evolucoes', evolucoesRouter)
app.use('/presencas', presencasRouter)
app.use('/campeonatos', campeonatosRouter)
app.use('/aulas', aulaRouter)
app.use('/professor', professorRouter)
app.use('/pessoa', pessoaRouter)
app.use('/turmas', turmasRouter)
app.use('/modalidades', modalidadesRouter)
app.use('/notificacoes', notificacoesRouter)
app.use('/financeiro', financeiroRouter)
app.use('/horarios', horariosRouter)
app.use('/aulas-particulares', aulasParticularesRouter)

// Tratamento de erros centralizado
app.use(errorHandler)

export default app
