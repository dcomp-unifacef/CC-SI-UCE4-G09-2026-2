
import * as repository from "../repositories/aulaParticularRepository";
import * as alunoService from "./alunoService";

import type { aulaParticular } from "../../generated/prisma/client";

import type { CreateAulaParticularDto } from "../dto/aulaParticular/createAulaParticularDto";
import type { UpdateAulaParticularDto } from "../dto/aulaParticular/updateAulaParticularDto";
import type { AgendarRecorrenteDto } from "../dto/aulaParticular/agendarRecorrenteDto";

import { NotFoundError } from "../errors/NotFoundError";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";

// Valida o formato e a existência da data.
function validarData(data: string): void {
    if (
        typeof data !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(data)
    ) {
        throw new BadRequestError(
            "Data inválida. Utilize AAAA-MM-DD."
        );
    }

    const dataConvertida = new Date(`${data}T12:00:00Z`);

    if (
        !Number.isFinite(dataConvertida.getTime()) ||
        dataConvertida.toISOString().slice(0, 10) !== data
    ) {
        throw new BadRequestError("Data inexistente.");
    }
}

// Valida o formato do horário.
function validarHorario(horario: string): void {
    if (
        typeof horario !== "string" ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)
    ) {
        throw new BadRequestError(
            "Horário inválido. Utilize HH:mm."
        );
    }
}

// Obtém a data e o horário atuais de São Paulo.
function agoraSaoPaulo() {
    const partes = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    }).formatToParts(new Date());

    const valores = Object.fromEntries(
        partes.map(parte => [parte.type, parte.value])
    );

    return {
        data: `${valores.year}-${valores.month}-${valores.day}`,
        horario: `${valores.hour}:${valores.minute}`
    };
}

// Impede conflitos de horário para o mesmo aluno.
async function validarConflito(
    alunoId: number,
    data: string,
    horario: string,
    ignorarId?: number
): Promise<void> {
    const conflito = await repository.findConflito(
        alunoId,
        data,
        horario,
        ignorarId
    );

    if (conflito) {
        throw new ConflictError(
            `O aluno já possui uma aula em ${data}, às ${horario}.`
        );
    }
}

// Lista todas as aulas particulares.
export async function findAll(): Promise<aulaParticular[]> {
    return repository.findAll();
}

// Busca uma aula particular pelo ID.
export async function findById(
    id: number
): Promise<aulaParticular> {
    const aula = await repository.findById(id);

    if (!aula) {
        throw new NotFoundError(
            "Aula particular não encontrada."
        );
    }

    return aula;
}

// Cria uma aula utilizando as regras de agendamento.
export async function create(
    data: CreateAulaParticularDto
): Promise<aulaParticular> {
    return agendar(data);
}

// Agenda uma aula particular individual.
export async function agendar(
    data: CreateAulaParticularDto
): Promise<aulaParticular> {
    if (!data || !Number.isInteger(data.alunoId) || data.alunoId <= 0) {
        throw new BadRequestError("Aluno inválido.");
    }

    validarData(data.data);
    validarHorario(data.horario);

    await alunoService.findById(data.alunoId);

    await validarConflito(
        data.alunoId,
        data.data,
        data.horario
    );

    return repository.agendar(data);
}

// Atualiza uma aula particular agendada.
export async function update(
    id: number,
    data: UpdateAulaParticularDto
): Promise<aulaParticular> {
    const aula = await findById(id);

    if (aula.status !== "AGENDADA") {
        throw new ConflictError(
            "Apenas aulas agendadas podem ser alteradas."
        );
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new BadRequestError("Dados de atualização inválidos.");
    }

    const alunoId = data.alunoId ?? aula.alunoId;
    const dataAula = data.data ?? aula.data;
    const horario = data.horario ?? aula.horario;

    if (!Number.isInteger(alunoId) || alunoId <= 0) {
        throw new BadRequestError("Aluno inválido.");
    }

    validarData(dataAula);
    validarHorario(horario);

    await alunoService.findById(alunoId);

    await validarConflito(
        alunoId,
        dataAula,
        horario,
        id
    );

    return repository.update(id, {
        alunoId,
        data: dataAula,
        horario
    });
}

// Exclui uma aula particular.
export async function remove(id: number): Promise<void> {
    await findById(id);
    await repository.remove(id);
}

// Cancela uma aula particular individual.
export async function cancelar(
    id: number
): Promise<aulaParticular> {
    const aula = await findById(id);

    if (aula.status !== "AGENDADA") {
        throw new ConflictError(
            "Apenas aulas agendadas podem ser canceladas."
        );
    }

    return repository.cancelar(id);
}

// Registra presença e conclui a aula particular.
export async function registrar(
    id: number,
    presenca: boolean
): Promise<aulaParticular> {
    const aula = await findById(id);

    if (aula.status !== "AGENDADA") {
        throw new ConflictError(
            "Apenas aulas agendadas podem registrar presença."
        );
    }

    if (typeof presenca !== "boolean") {
        throw new BadRequestError(
            "A presença deve ser true ou false."
        );
    }

    const agora = agoraSaoPaulo();

    if (
        aula.data > agora.data ||
        (
            aula.data === agora.data &&
            aula.horario > agora.horario
        )
    ) {
        throw new ConflictError(
            "A presença só pode ser registrada após o início da aula."
        );
    }

    return repository.registrar(id, presenca);
}

// Agenda aulas recorrentes de 1 a 5 vezes por semana.
export async function agendarRecorrente(
    dados: AgendarRecorrenteDto
) {
    if (!dados) {
        throw new BadRequestError(
            "Dados do agendamento não informados."
        );
    }

    const {
        alunoId,
        dataInicio,
        dataFim,
        diasSemana,
        horario
    } = dados;

    if (!Number.isInteger(alunoId) || alunoId <= 0) {
        throw new BadRequestError("Aluno inválido.");
    }

    validarData(dataInicio);
    validarData(dataFim);
    validarHorario(horario);

    if (dataInicio > dataFim) {
        throw new BadRequestError(
            "A data inicial deve ser anterior ou igual à final."
        );
    }

    if (
        !Array.isArray(diasSemana) ||
        diasSemana.length < 1 ||
        diasSemana.length > 5 ||
        new Set(diasSemana).size !== diasSemana.length ||
        diasSemana.some(
            dia => !Number.isInteger(dia) || dia < 0 || dia > 6
        )
    ) {
        throw new BadRequestError(
            "Selecione de 1 a 5 dias diferentes da semana."
        );
    }

    await alunoService.findById(alunoId);

    const aulas: CreateAulaParticularDto[] = [];

    const dataAtual = new Date(`${dataInicio}T12:00:00Z`);
    const dataLimite = new Date(`${dataFim}T12:00:00Z`);

    // Gera as aulas dentro do período informado.
    while (dataAtual <= dataLimite) {
        if (diasSemana.includes(dataAtual.getUTCDay())) {
            const dataAula = dataAtual
                .toISOString()
                .slice(0, 10);

            aulas.push({
                alunoId,
                data: dataAula,
                horario
            });
        }

        dataAtual.setUTCDate(
            dataAtual.getUTCDate() + 1
        );

        if (aulas.length > 100) {
            throw new BadRequestError(
                "O limite é de 100 aulas por recorrência."
            );
        }
    }

    if (aulas.length === 0) {
        throw new BadRequestError(
            "Nenhuma aula corresponde aos dias selecionados."
        );
    }

    // Verifica conflitos antes de cadastrar.
    for (const aula of aulas) {
        await validarConflito(
            aula.alunoId,
            aula.data,
            aula.horario
        );
    }

    return repository.agendarRecorrente(dados, aulas);
}

// Busca uma recorrência pelo ID.
export async function findRecorrenciaById(id: number) {
    const recorrencia = await repository.findRecorrenciaById(id);

    if (!recorrencia) {
        throw new NotFoundError(
            "Recorrência não encontrada."
        );
    }

    return recorrencia;
}

// Cancela apenas as aulas futuras de uma recorrência.
export async function cancelarRecorrencia(id: number) {
    await findRecorrenciaById(id);

    const agora = agoraSaoPaulo();

    return repository.cancelarRecorrencia(
        id,
        agora.data,
        agora.horario
    );
}
