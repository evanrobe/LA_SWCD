// Empty placeholder section for a character's films (not yet backed by API data).
import styles from './FilmsSection.module.css'

/** An empty titled, bordered list placeholder for the not-yet-implemented films section. */
function FilmsSection() {
  return (
    <section className={styles.container}>
      <h2 className={styles.label}>Films</h2>
      <div className={styles.list} aria-label="Films list" />
    </section>
  )
}

export default FilmsSection
