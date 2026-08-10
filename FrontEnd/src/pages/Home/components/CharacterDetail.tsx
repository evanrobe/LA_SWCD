import type { CharacterDetail as CharacterDetailData } from '../../../api/types'
import DetailPanel from './DetailPanel'
import styles from './CharacterDetail.module.css'

interface CharacterDetailProps {
  character: CharacterDetailData | null | undefined
}

function CharacterDetail({ character }: CharacterDetailProps) {
  const attributeRows = [
    { label: 'Birth year', value: character?.attributes.birthYear },
    { label: 'Gender', value: character?.attributes.gender },
    { label: 'Height', value: character?.attributes.height },
    { label: 'Mass', value: character?.attributes.mass },
    { label: 'Eye color', value: character?.attributes.eyeColor },
    { label: 'Hair color', value: character?.attributes.hairColor },
    { label: 'Skin color', value: character?.attributes.skinColor },
  ]

  const speciesRows = [
    { label: 'Classification', value: character?.species?.classification },
    { label: 'Designation', value: character?.species?.designation },
    { label: 'Average height', value: character?.species?.averageHeight },
    { label: 'Average lifespan', value: character?.species?.averageLifespan },
    { label: 'Language', value: character?.species?.language },
  ]

  const homeworldRows = [
    { label: 'Population', value: character?.homeworld?.population?.toLocaleString() },
    { label: 'Terrain', value: character?.homeworld?.terrain },
    { label: 'Climate', value: character?.homeworld?.climate },
    { label: 'Surface water', value: character?.homeworld?.surfaceWater },
    { label: 'Diameter', value: character?.homeworld?.diameter },
    { label: 'Rotation period', value: character?.homeworld?.rotationPeriod },
    { label: 'Orbital period', value: character?.homeworld?.orbitalPeriod },
    { label: 'Gravity', value: character?.homeworld?.gravity },
  ]

  return (
    <section className={styles.container}>
      <p className={styles.spacer} aria-hidden="true">
        &nbsp;
      </p>

      <div className={styles.box}>
        <div className={styles.identity}>
          <span className={styles.avatar} aria-hidden="true">
            <svg viewBox="0 0 24 24" className={styles.avatarIcon}>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </span>
          <h2 className={styles.name}>{character?.name}</h2>
        </div>

        <div className={styles.panels}>
          <DetailPanel title="Attributes" rows={attributeRows} />
          <DetailPanel title="Species" rows={speciesRows} showHeading heading={character?.species?.name} />
          <DetailPanel title="Homeworld" rows={homeworldRows} showHeading heading={character?.homeworld?.name} />
        </div>
      </div>
    </section>
  )
}

export default CharacterDetail
