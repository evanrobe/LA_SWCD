import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Home from '../../src/pages/Home/Home'
import { useSearchCharacters } from '../../src/hooks/useSearchCharacters'
import { useCharacterDetail } from '../../src/hooks/useCharacterDetail'

vi.mock('../../src/hooks/useSearchCharacters', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/hooks/useSearchCharacters')>()
  return {
    ...actual,
    useSearchCharacters: vi.fn(),
  }
})

vi.mock('../../src/hooks/useCharacterDetail', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/hooks/useCharacterDetail')>()
  return {
    ...actual,
    useCharacterDetail: vi.fn(),
  }
})

const mockedUseSearchCharacters = vi.mocked(useSearchCharacters)
const mockedUseCharacterDetail = vi.mocked(useCharacterDetail)

const CHARACTERS = [
  { id: '1', name: 'Luke Skywalker' },
  { id: '2', name: 'Leia Organa' },
]

const LUKE_DETAIL = {
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
  starships: [
    {
      id: '12',
      name: 'X-wing',
      classification: 'Starfighter',
      crew: 1,
      passengers: 0,
      model: 'T-65 X-wing',
      manufacturer: 'Incom Corporation',
    },
  ],
}

describe('Home', () => {
  beforeEach(() => {
    mockedUseSearchCharacters.mockReset()
    mockedUseSearchCharacters.mockReturnValue({ data: CHARACTERS } as ReturnType<typeof useSearchCharacters>)
    mockedUseCharacterDetail.mockReset()
    mockedUseCharacterDetail.mockReturnValue({ data: LUKE_DETAIL } as ReturnType<typeof useCharacterDetail>)
  })

  it('renders the datapad header and search box', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'Star Wars Character Datapad' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search characters' })).toBeInTheDocument()
  })

  it('renders the detail panels and the films/starships/vehicles sections', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'Attributes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Species' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Homeworld' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Films' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Starships' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Vehicles' })).toBeInTheDocument()
  })

  it('renders the fetched characters in the list', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: 'Luke Skywalker' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leia Organa' })).toBeInTheDocument()
  })

  it('renders no characters when data has not loaded yet', () => {
    mockedUseSearchCharacters.mockReturnValue({ data: undefined } as ReturnType<typeof useSearchCharacters>)

    render(<Home />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('automatically selects the first character once the list loads', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: 'Luke Skywalker' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Leia Organa' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('does not select anything when the list has no characters', () => {
    mockedUseSearchCharacters.mockReturnValue({ data: [] as typeof CHARACTERS } as ReturnType<typeof useSearchCharacters>)

    render(<Home />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('requests character detail for the selected character id', () => {
    render(<Home />)

    expect(mockedUseCharacterDetail).toHaveBeenLastCalledWith('1')
  })

  it('renders the selected character detail data', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument()
    expect(screen.getByText('19BBY')).toBeInTheDocument()
    expect(screen.getByText('blond')).toBeInTheDocument()
    expect(screen.getAllByText('Human')).not.toHaveLength(0)
    expect(screen.getByText('sentient')).toBeInTheDocument()
    expect(screen.getAllByText('Tatooine')).not.toHaveLength(0)
    expect(screen.getByText('desert')).toBeInTheDocument()
    expect(screen.getByText('X-wing')).toBeInTheDocument()
    expect(screen.getByText('Starfighter')).toBeInTheDocument()
  })

  it('allows selecting a single character from the list', async () => {
    const user = userEvent.setup()

    render(<Home />)

    const lukeButton = screen.getByRole('button', { name: 'Luke Skywalker' })
    const leiaButton = screen.getByRole('button', { name: 'Leia Organa' })

    expect(lukeButton).toHaveAttribute('aria-pressed', 'true')

    await user.click(leiaButton)
    expect(leiaButton).toHaveAttribute('aria-pressed', 'true')
    expect(lukeButton).toHaveAttribute('aria-pressed', 'false')
    expect(mockedUseCharacterDetail).toHaveBeenLastCalledWith('2')

    await user.click(lukeButton)
    expect(lukeButton).toHaveAttribute('aria-pressed', 'true')
    expect(leiaButton).toHaveAttribute('aria-pressed', 'false')
    expect(mockedUseCharacterDetail).toHaveBeenLastCalledWith('1')
  })

  it('debounces search box input before calling useSearchCharacters with the new term', async () => {
    const user = userEvent.setup()

    render(<Home />)

    expect(mockedUseSearchCharacters).toHaveBeenLastCalledWith('')

    await user.type(screen.getByRole('searchbox', { name: 'Search characters' }), 'leia')

    // Still debouncing immediately after typing — no call with the full term yet.
    expect(mockedUseSearchCharacters).not.toHaveBeenCalledWith('leia')

    await waitFor(() => expect(mockedUseSearchCharacters).toHaveBeenLastCalledWith('leia'), { timeout: 1000 })
  })
})
