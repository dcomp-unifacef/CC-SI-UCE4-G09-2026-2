import { Link, useLocation } from 'react-router'

export default function NotFound() {
  const location = useLocation()
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center px-3">
      <h1 className="font-display" style={{ fontSize: '4rem' }}>404</h1>
      <p className="text-secondary">Página não encontrada: {location.pathname}</p>
      <Link to="/" className="btn btn-primary mt-3">Voltar ao início</Link>
    </div>
  )
}
