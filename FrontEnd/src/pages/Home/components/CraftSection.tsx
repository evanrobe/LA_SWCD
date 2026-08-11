// Generic empty placeholder section (currently used for "Vehicles", not yet backed by API data).
import styles from './CraftSection.module.css'

interface CraftSectionProps {
  title: string
}

/** An empty titled, bordered list placeholder for a not-yet-implemented section. */
function CraftSection({ title }: CraftSectionProps) {
  return (
    <section className={styles.container}>
      <h2 className={styles.label}>{title}</h2>
      <div className={styles.list} aria-label={`${title} list`} />
    </section>
  )
}

export default CraftSection
