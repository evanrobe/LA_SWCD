import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StarshipsSection from '../../../../src/pages/Home/components/StarshipsSection'

const STARSHIPS = [
  {
    id: '12',
    name: 'X-wing',
    classification: 'Starfighter',
    crew: 1,
    passengers: 0,
    model: 'T-65 X-wing',
    manufacturer: 'Incom Corporation',
  },
  {
    id: '22',
    name: 'Imperial shuttle',
    classification: 'Armed government transport',
    crew: 6,
    passengers: 20,
    model: 'Lambda-class T-4a shuttle',
    manufacturer: 'Sienar Fleet Systems',
  },
]

describe('StarshipsSection', () => {
  it('renders the section heading', () => {
    render(<StarshipsSection starships={[]} />)

    expect(screen.getByRole('heading', { name: 'Starships' })).toBeInTheDocument()
  })

  it('renders a row for each starship with its name and classification', () => {
    render(<StarshipsSection starships={STARSHIPS} />)

    expect(screen.getByText('X-wing')).toBeInTheDocument()
    expect(screen.getByText('Starfighter')).toBeInTheDocument()
    expect(screen.getByText('Imperial shuttle')).toBeInTheDocument()
    expect(screen.getByText('Armed government transport')).toBeInTheDocument()
  })

  it('renders crew/passengers and model/manufacturer for each starship', () => {
    render(<StarshipsSection starships={STARSHIPS} />)

    expect(screen.getByText('1 / 0')).toBeInTheDocument()
    expect(screen.getByText('T-65 X-wing / Incom Corporation')).toBeInTheDocument()
    expect(screen.getByText('6 / 20')).toBeInTheDocument()
    expect(screen.getByText('Lambda-class T-4a shuttle / Sienar Fleet Systems')).toBeInTheDocument()
  })

  it('renders no starship rows when the list is empty', () => {
    render(<StarshipsSection starships={[]} />)

    expect(screen.getByLabelText('Starships list')).toBeEmptyDOMElement()
  })
})
