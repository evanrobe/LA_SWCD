import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from '../src/App'

vi.mock('../src/api/hooks/useCharacters', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/api/hooks/useCharacters')>()
  return {
    ...actual,
    useCharacters: vi.fn(() => ({ data: [] })),
  }
})

describe('App routing', () => {
  it('renders the homepage at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Star Wars Character Datapad' })).toBeInTheDocument()
  })

  it('renders the not-found page for an unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
