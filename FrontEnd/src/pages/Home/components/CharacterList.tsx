import styles from './CharacterList.module.css'

function CharacterList() {
  return (
    <section className={styles.container}>
      <h2 className={styles.label}>Characters</h2>
      <ul className={styles.list} aria-label="Character list" />
    </section>
  )
}

export default CharacterList
