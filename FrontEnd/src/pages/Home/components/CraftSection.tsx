import styles from './CraftSection.module.css'

interface CraftSectionProps {
  title: string
}

function CraftSection({ title }: CraftSectionProps) {
  return (
    <section className={styles.container}>
      <h2 className={styles.label}>{title}</h2>
      <div className={styles.list} aria-label={`${title} list`} />
    </section>
  )
}

export default CraftSection
