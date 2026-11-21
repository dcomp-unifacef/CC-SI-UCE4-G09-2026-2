-- CreateEnum
CREATE TYPE "StatusAluno" AS ENUM ('ATIVO', 'INADIMPLENTE', 'INATIVO');

-- AlterTable
ALTER TABLE "Aluno" ADD COLUMN     "dataMatricula" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "modalidades" TEXT[],
ADD COLUMN     "status" "StatusAluno" NOT NULL DEFAULT 'ATIVO',
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "telefone" TEXT;

-- AlterTable
ALTER TABLE "Presenca" ALTER COLUMN "foto" SET DEFAULT '';
