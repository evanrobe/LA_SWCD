import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LoadingOverlay from '../../src/components/LoadingOverlay'

describe('LoadingOverlay', () => {
  it('renders a status role with a loading message', () => {
    render(<LoadingOverlay />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading')
  })
})
