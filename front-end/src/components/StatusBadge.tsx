type Status = 'ativo' | 'inadimplente' | 'inativo' | 'atrasado'

interface Props { status: Status }

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`badge-status ${status}`}>
      {status === 'ativo'        && 'Ativo'}
      {status === 'inadimplente' && 'Inadimplente'}
      {status === 'inativo'      && 'Inativo'}
      {status === 'atrasado'     && 'Atrasado'}
    </span>
  )
}
