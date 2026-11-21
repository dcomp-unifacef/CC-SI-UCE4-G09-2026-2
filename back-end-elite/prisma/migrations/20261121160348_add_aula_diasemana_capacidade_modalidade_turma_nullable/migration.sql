-- DropForeignKey
ALTER TABLE "Modalidade" DROP CONSTRAINT "Modalidade_turmaId_fkey";

-- AlterTable
ALTER TABLE "Aula" ADD COLUMN     "capacidade" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "diaSemana" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "observacao" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Modalidade" ALTER COLUMN "turmaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Modalidade" ADD CONSTRAINT "Modalidade_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "Turma"("id") ON DELETE SET NULL ON UPDATE CASCADE;
