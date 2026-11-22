import { Router } from "express"
import { autenticar, exigirPapel, carregarAluno } from "../middlewares/auth"
import * as controller from "../controllers/alunoMeController"

const router = Router()

// Todas as rotas /aluno exigem: autenticação + papel ALUNO + carregarAluno
router.use(autenticar, exigirPapel("ALUNO"), carregarAluno)

router.get("/me", controller.obterPerfil)
router.put("/me", controller.atualizarPerfil)
router.get("/me/frequencia", controller.obterFrequencia)
router.get("/me/aulas", controller.obterAulas)
router.get("/me/financeiro", controller.obterFinanceiro)
router.get("/me/evolucoes", controller.obterEvolucoes)
router.post("/me/evolucoes", controller.criarEvolucao)
router.get("/me/campeonatos", controller.obterCampeonatos)

export default router
router.get("/me/notificacoes", controller.obterNotificacoes)
router.patch("/me/notificacoes/:id/lida", controller.marcarNotificacaoLida)
router.patch("/me/notificacoes/marcar-todas-lidas", controller.marcarTodasNotificacoesLidas)
