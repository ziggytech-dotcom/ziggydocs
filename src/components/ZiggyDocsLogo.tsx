interface ZiggyDocsLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ZiggyDocsLogo({ className, size = 'md' }: ZiggyDocsLogoProps) {
  const fontSize = size === 'sm' ? '1rem' : size === 'lg' ? '2rem' : '1.25rem'
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-space-grotesk, 'Space Grotesk', sans-serif)",
        fontWeight: 700,
        fontSize,
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}
    >
      <span style={{ color: '#ff1744' }}>Ziggy</span>
      <span style={{ color: '#7c3aed' }}>Docs</span>
    </span>
  )
}
