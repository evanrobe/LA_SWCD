import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NotFound from '../../src/pages/NotFound/NotFound'

describe('NotFound', () => {
  it('renders a not-found heading', () => {
    render(<NotFound />)

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })
})
