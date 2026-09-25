-- CreateTable
CREATE TABLE "Aluno" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,
    "valorMensalidade" DOUBLE PRECISION NOT NULL,
    "graduacao" TEXT NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evolucao" (
    "id" SERIAL NOT NULL,
    "pesoAtual" DOUBLE PRECISION NOT NULL,
    "bioimpedancia" DOUBLE PRECISION NOT NULL,
    "dataAvaliacao" TIMESTAMP(3) NOT NULL,
    "alunoId" INTEGER NOT NULL,

    CONSTRAINT "Evolucao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_cpf_key" ON "Aluno"("cpf");

-- AddForeignKey
ALTER TABLE "Evolucao" ADD CONSTRAINT "Evolucao_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
