import type { Aluno } from '../types/aluno'

type AlunosListProps = {
 list?: Aluno[]
}

export function AlunosList({ list = [] }: AlunosListProps) {
 return (
   <p className="text-secondary">
     Total de alunos: {list.length}
   </p>
 )
}