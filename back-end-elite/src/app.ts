import { env } from './config/env'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
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
import authRouter from './routes/auth'
import alunoMeRouter from './routes/alunoMe'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.set('trust proxy', env.trustProxy)
app.use(helmet())
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
// CORS: apenas FRONTEND_URL e as origens extras de ALLOWED_ORIGINS
const origensPermitidas = [...new Set([env.frontendUrl, ...env.allowedOrigins].filter(Boolean))]
app.use(cors({ origin: origensPermitidas }))

/***************** ROTAS *************************/

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/aluno', alunoMeRouter)
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
