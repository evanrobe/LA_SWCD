import type { CharacterStarship } from '../../../api/types'
import styles from './StarshipsSection.module.css'

interface StarshipsSectionProps {
  starships: CharacterStarship[]
}

function StarshipsSection({ starships }: StarshipsSectionProps) {
  return (
    <section className={styles.container}>
      <h2 className={styles.label}>Starships</h2>

      <div className={styles.list} aria-label="Starships list">
        {starships.map((starship) => (
          <div key={starship.id} className={styles.item}>
            <span className={styles.thumbnail} aria-hidden="true">
              <svg viewBox="0 0 64 64" className={styles.thumbnailIcon}>
                <rect x="1" y="1" width="62" height="62" />
                <line x1="1" y1="1" x2="63" y2="63" />
                <line x1="63" y1="1" x2="1" y2="63" />
              </svg>
            </span>

            <div className={styles.details}>
              <p className={styles.heading}>
                <span className={styles.name}>{starship.name}</span>
                <span className={styles.classification}>{starship.classification}</span>
              </p>

              <dl className={styles.rows}>
                <dt>Crew / Passengers:</dt>
                <dd>
                  {starship.crew ?? ''} / {starship.passengers ?? ''}
                </dd>
                <dt>Model / Manufacturer:</dt>
                <dd>
                  {starship.model} / {starship.manufacturer}
                </dd>
              </dl>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StarshipsSection
