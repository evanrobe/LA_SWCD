import DetailPanel from './DetailPanel'
import styles from './CharacterDetail.module.css'

const ATTRIBUTE_ROWS = ['Birth year', 'Gender', 'Height', 'Mass', 'Eye color', 'Hair color', 'Skin color']
const SPECIES_ROWS = ['Classification', 'Designation', 'Average height', 'Average lifespan', 'Language']
const HOMEWORLD_ROWS = [
  'Population',
  'Terrain',
  'Climate',
  'Surface water',
  'Diameter',
  'Rotation period',
  'Orbital period',
  'Gravity',
]

function CharacterDetail() {
  return (
    <section className={styles.container}>
      <div className={styles.identity}>
        <span className={styles.avatar} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.avatarIcon}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
          </svg>
        </span>
        <h2 className={styles.name}></h2>
      </div>

      <div className={styles.panels}>
        <DetailPanel title="Attributes" rows={ATTRIBUTE_ROWS} />
        <DetailPanel title="Species" rows={SPECIES_ROWS} showHeading />
        <DetailPanel title="Homeworld" rows={HOMEWORLD_ROWS} showHeading />
      </div>
    </section>
  )
}

export default CharacterDetail
