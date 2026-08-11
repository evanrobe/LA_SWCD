// Shapes returned by the LASWCD Web API's character endpoints.

/** A character search result: just enough to list and select a character. */
export interface Character {
  id: string
  name: string
}

/** A character's display-formatted physical attributes. */
export interface CharacterAttributes {
  birthYear: string | null
  gender: string | null
  height: string | null
  mass: string | null
  hairColor: string | null
  eyeColor: string | null
  skinColor: string | null
}

/** A character's species. */
export interface CharacterSpecies {
  name: string
  classification: string | null
  designation: string | null
  averageHeight: string | null
  averageLifespan: string | null
  language: string | null
}

/** A character's homeworld. */
export interface CharacterHomeworld {
  name: string
  climate: string | null
  terrain: string | null
  population: number | null
  surfaceWater: string | null
  diameter: string | null
  rotationPeriod: string | null
  orbitalPeriod: string | null
  gravity: string | null
}

/** A starship piloted by a character. */
export interface CharacterStarship {
  id: string
  name: string
  classification: string | null
  crew: number | null
  passengers: number | null
  model: string | null
  manufacturer: string | null
}

/** A character's full composed detail view, as returned by GET /api/v1/characters/{id}. */
export interface CharacterDetail {
  id: string
  name: string
  attributes: CharacterAttributes
  species: CharacterSpecies | null
  homeworld: CharacterHomeworld | null
  starships: CharacterStarship[]
}
