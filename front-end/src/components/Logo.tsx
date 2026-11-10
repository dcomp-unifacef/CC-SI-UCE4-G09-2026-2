import logo from '../assets/logo-elite.png'

interface LogoProps {
  size?: number
  showWordmark?: boolean
  className?: string
}

export default function Logo({ size = 40, showWordmark = false, className = '' }: LogoProps) {
  return (
    <div className={`d-flex align-items-center gap-2 ${className}`}>
      <img
        src={logo}
        alt="Elite Fight Club"
        width={size}
        height={size}
        className="rounded object-fit-contain"
        style={{ width: size, height: size }}
      />
      {showWordmark && (
        <div className="lh-1">
          <div className="font-display logo-word">ELITE</div>
          <div className="font-display logo-sub">FIGHT CLUB</div>
        </div>
      )}
    </div>
  )
}
