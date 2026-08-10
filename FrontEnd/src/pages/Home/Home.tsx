import { useState } from 'react'
import { useCharacters } from '../../hooks/useCharacters'
import DatapadHeader from './components/DatapadHeader'
import CharacterList from './components/CharacterList'
import CharacterDetail from './components/CharacterDetail'
import FilmsSection from './components/FilmsSection'
import CraftSection from './components/CraftSection'
import styles from './Home.module.css'

function Home() {
  const { data } = useCharacters()
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)

  return (
    <main className={styles.page}>
      <DatapadHeader />

      <div className={styles.charactersRow}>
        <CharacterList characters={data ?? []} selectedId={selectedCharacterId} onSelect={setSelectedCharacterId} />
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
