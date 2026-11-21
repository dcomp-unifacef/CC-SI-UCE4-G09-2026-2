interface Props {
  rows?: number
  height?: string
  className?: string
}

export default function SkeletonLoader({ rows = 1, height = '1rem', className = '' }: Props) {
  return (
    <div className={`d-flex flex-column gap-2 ${className}`} aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="shimmer"
          style={{
            height,
            borderRadius: '0.375rem',
            width: i % 3 === 2 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  )
}
