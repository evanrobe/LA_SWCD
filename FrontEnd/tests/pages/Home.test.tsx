import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Home from '../../src/pages/Home/Home'

describe('Home', () => {
  it('renders the datapad header and search box', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'Star Wars Character Datapad' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: 'Search characters' })).toBeInTheDocument()
  })

  it('renders the character list and detail panels', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'Characters' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Attributes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Species' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Homeworld' })).toBeInTheDocument()
  })

  it('renders the films, starships, and vehicles sections', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'Films' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Starships' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Vehicles' })).toBeInTheDocument()
  })
})
