import styles from './FilmsSection.module.css'

function FilmsSection() {
  return (
    <section className={styles.container}>
      <h2 className={styles.label}>Films</h2>
      <div className={styles.list} aria-label="Films list" />
    </section>
  )
}

export default FilmsSection
