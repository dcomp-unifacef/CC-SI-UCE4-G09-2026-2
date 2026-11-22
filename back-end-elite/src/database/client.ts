
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";


const connectionString = process.env.DATABASE_URL;


if (!connectionString) {
 throw new Error("DATABASE_URL não definida");
}


const adapter = new PrismaPg({
 connectionString,
});


const prisma = new PrismaClient({
 adapter,


 log: [
   { emit: "event", level: "query" },
   { emit: "stdout", level: "error" },
   { emit: "stdout", level: "info" },
   { emit: "stdout", level: "warn" },
 ],
});


const TABELAS_SENSIVEIS = /"(Usuario|ResetSenhaToken)"/;

// Esta são as instruções que mostrarão no terminal todas
// as instruções SQL geradas pelo Prisma
prisma.$on("query", (e) => {
 console.log("---");
 console.log("Query: " + e.query);
 // Nunca registrar e-mail, hash de senha ou token de redefinição nos logs.
 console.log("Params: " + (TABELAS_SENSIVEIS.test(e.query) ? "[ocultado]" : e.params));
 console.log("Duration: " + e.duration + "ms");
});


export { prisma };

