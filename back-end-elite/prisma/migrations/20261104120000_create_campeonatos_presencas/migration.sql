-- CreateTable
CREATE TABLE "Presenca" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "alunoId" INTEGER NOT NULL,
    CONSTRAINT "Presenca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campeonato" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "locomocao" TEXT NOT NULL,
    "valores" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "pesosDeLuta" TEXT[],
    CONSTRAINT "Campeonato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InscricaoCampeonato" (
    "id" SERIAL NOT NULL,
    "pesoDeLuta" TEXT NOT NULL,
    "campeonatoId" INTEGER NOT NULL,
    "alunoId" INTEGER NOT NULL,
    CONSTRAINT "InscricaoCampeonato_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Presenca_alunoId_data_key" ON "Presenca"("alunoId", "data");
CREATE UNIQUE INDEX "Campeonato_nome_key" ON "Campeonato"("nome");
CREATE UNIQUE INDEX "InscricaoCampeonato_campeonatoId_alunoId_key" ON "InscricaoCampeonato"("campeonatoId", "alunoId");

ALTER TABLE "Presenca" ADD CONSTRAINT "Presenca_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InscricaoCampeonato" ADD CONSTRAINT "InscricaoCampeonato_campeonatoId_fkey" FOREIGN KEY ("campeonatoId") REFERENCES "Campeonato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InscricaoCampeonato" ADD CONSTRAINT "InscricaoCampeonato_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "Aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;
