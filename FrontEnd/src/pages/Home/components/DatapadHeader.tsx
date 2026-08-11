// Page header: app title and the character search input.
import styles from './DatapadHeader.module.css'

interface DatapadHeaderProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
}

/** Renders the page title and a controlled search input. */
function DatapadHeader({ searchTerm, onSearchTermChange }: DatapadHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Star Wars Character Datapad</h1>

      <div className={styles.search}>
        <svg className={styles.searchIcon} aria-hidden="true" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search characters"
          aria-label="Search characters"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
        />
      </div>
    </header>
  )
}

export default DatapadHeader
