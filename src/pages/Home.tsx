export default function Home() {
  return (
    <div>
      <h1 style={{ 
        fontSize: 'var(--ttn-500-xl-01-size)', 
        lineHeight: 'var(--ttn-500-xl-01-lh)',
        color: 'var(--primitive-text-primary)'
      }}>
        Welcome to Over Prototype
      </h1>
      <p style={{ 
        fontSize: 'var(--ttn-400-m-01-size)', 
        lineHeight: 'var(--ttn-400-m-01-lh)',
        color: 'var(--primitive-text-secondary)',
        marginTop: 'var(--spacing-2x)'
      }}>
        This is the home page.
      </p>
    </div>
  )
}
