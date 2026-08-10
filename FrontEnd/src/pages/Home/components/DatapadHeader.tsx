import styles from './DatapadHeader.module.css'

function DatapadHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Star Wars Character Datapad</h1>

      <div className={styles.search}>
        <svg className={styles.searchIcon} aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="search" className={styles.searchInput} placeholder="Search characters" aria-label="Search characters" />
      </div>
    </header>
  )
}

export default DatapadHeader
