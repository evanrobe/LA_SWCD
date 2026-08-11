import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CharacterDetail from '../../../../src/pages/Home/components/CharacterDetail'

const LUKE = {
  id: '1',
  name: 'Luke Skywalker',
  attributes: {
    birthYear: '19BBY',
    gender: 'male',
    height: '172 cm',
    mass: '77 kg',
    hairColor: 'blond',
    eyeColor: 'blue',
    skinColor: 'fair',
  },
  species: {
    name: 'Human',
    classification: 'mammal',
    designation: 'sentient',
    averageHeight: '180 cm',
    averageLifespan: '120 years',
    language: 'Galactic Basic',
  },
  homeworld: {
    name: 'Tatooine',
    climate: 'arid',
    terrain: 'desert',
    population: 200000,
    surfaceWater: '1%',
    diameter: '10,465 km',
    rotationPeriod: '23 hr',
    orbitalPeriod: '304 d',
    gravity: '1 standard',
  },
  starships: [],
}

describe('CharacterDetail', () => {
  it('renders the character name and attribute values', () => {
    render(<CharacterDetail character={LUKE} />)

    expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument()
    expect(screen.getByText('19BBY')).toBeInTheDocument()
    expect(screen.getByText('male')).toBeInTheDocument()
    expect(screen.getByText('172 cm')).toBeInTheDocument()
    expect(screen.getByText('77 kg')).toBeInTheDocument()
  })

  it('renders the species heading and rows', () => {
    render(<CharacterDetail character={LUKE} />)

    expect(screen.getByText('mammal')).toBeInTheDocument()
    expect(screen.getByText('sentient')).toBeInTheDocument()
    expect(screen.getByText('120 years')).toBeInTheDocument()
    expect(screen.getAllByText('Human')).not.toHaveLength(0)
  })

  it('renders the homeworld heading, formatted population, and rows', () => {
    render(<CharacterDetail character={LUKE} />)

    expect(screen.getAllByText('Tatooine')).not.toHaveLength(0)
    expect(screen.getByText('200,000')).toBeInTheDocument()
    expect(screen.getByText('desert')).toBeInTheDocument()
    expect(screen.getByText('arid')).toBeInTheDocument()
    expect(screen.getByText('1%')).toBeInTheDocument()
    expect(screen.getByText('10,465 km')).toBeInTheDocument()
    expect(screen.getByText('23 hr')).toBeInTheDocument()
    expect(screen.getByText('304 d')).toBeInTheDocument()
    expect(screen.getByText('1 standard')).toBeInTheDocument()
  })

  it('renders an empty state when no character is selected', () => {
    render(<CharacterDetail character={undefined} />)

    expect(screen.getByRole('heading', { level: 2, name: '' })).toBeInTheDocument()
  })
})
