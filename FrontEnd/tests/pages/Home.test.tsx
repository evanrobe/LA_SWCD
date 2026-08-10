import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Home from '../../src/pages/Home/Home'
import { useCharacters } from '../../src/hooks/useCharacters'

vi.mock('../../src/hooks/useCharacters', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/hooks/useCharacters')>()
  return {
    ...actual,
    useCharacters: vi.fn(),
  }
})

const mockedUseCharacters = vi.mocked(useCharacters)

const CHARACTERS = [
  { id: '1', name: 'Luke Skywalker' },
  { id: '2', name: 'Leia Organa' },
]

describe('Home', () => {
  beforeEach(() => {
    mockedUseCharacters.mockReset()
    mockedUseCharacters.mockReturnValue({ data: CHARACTERS } as ReturnType<typeof useCharacters>)
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
    mockedUseCharacters.mockReturnValue({ data: undefined } as ReturnType<typeof useCharacters>)

    render(<Home />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('automatically selects the first character once the list loads', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: 'Luke Skywalker' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Leia Organa' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('does not select anything when the list has no characters', () => {
    mockedUseCharacters.mockReturnValue({ data: [] as typeof CHARACTERS } as ReturnType<typeof useCharacters>)

    render(<Home />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
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

    await user.click(lukeButton)
    expect(lukeButton).toHaveAttribute('aria-pressed', 'true')
    expect(leiaButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('debounces search box input before calling useCharacters with the new term', async () => {
    const user = userEvent.setup()

    render(<Home />)

    expect(mockedUseCharacters).toHaveBeenLastCalledWith('')

    await user.type(screen.getByRole('searchbox', { name: 'Search characters' }), 'leia')

    // Still debouncing immediately after typing — no call with the full term yet.
    expect(mockedUseCharacters).not.toHaveBeenCalledWith('leia')

    await waitFor(() => expect(mockedUseCharacters).toHaveBeenLastCalledWith('leia'), { timeout: 1000 })
  })
})
