import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Home from '../../src/pages/Home/Home'

describe('Home', () => {
  it('renders the homepage heading', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'LA SWCD' })).toBeInTheDocument()
  })
})
