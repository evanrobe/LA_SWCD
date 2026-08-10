export interface Character {
  id: string
  name: string
}

export interface CharacterAttributes {
  birthYear: string | null
  gender: string | null
  height: string | null
  mass: string | null
  hairColor: string | null
  eyeColor: string | null
  skinColor: string | null
}

export interface CharacterSpecies {
  name: string
  classification: string | null
  designation: string | null
  averageHeight: string | null
  averageLifespan: string | null
  language: string | null
}

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

export interface CharacterDetail {
  id: string
  name: string
  attributes: CharacterAttributes
  species: CharacterSpecies | null
  homeworld: CharacterHomeworld | null
}
