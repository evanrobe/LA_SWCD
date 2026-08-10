import DatapadHeader from './components/DatapadHeader'
import CharacterList from './components/CharacterList'
import CharacterDetail from './components/CharacterDetail'
import FilmsSection from './components/FilmsSection'
import CraftSection from './components/CraftSection'
import styles from './Home.module.css'

function Home() {
  return (
    <main className={styles.page}>
      <DatapadHeader />

      <div className={styles.charactersRow}>
        <CharacterList />
        <CharacterDetail />
      </div>

      <FilmsSection />

      <div className={styles.craftRow}>
        <CraftSection title="Starships" />
        <CraftSection title="Vehicles" />
      </div>
    </main>
  )
}

export default Home
