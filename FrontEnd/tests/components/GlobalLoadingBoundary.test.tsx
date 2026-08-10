import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import GlobalLoadingBoundary from '../../src/components/GlobalLoadingBoundary'

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useIsFetching: vi.fn(),
    useIsMutating: vi.fn(),
  }
})

const mockedUseIsFetching = vi.mocked(useIsFetching)
const mockedUseIsMutating = vi.mocked(useIsMutating)

describe('GlobalLoadingBoundary', () => {
  it('renders children without the overlay when nothing is fetching or mutating', () => {
    mockedUseIsFetching.mockReturnValue(0)
    mockedUseIsMutating.mockReturnValue(0)

    render(
      <GlobalLoadingBoundary>
        <p>content</p>
      </GlobalLoadingBoundary>,
    )

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('content').closest('div')).not.toHaveAttribute('inert')
  })

  it('shows the overlay and marks content inert while a query is fetching', () => {
    mockedUseIsFetching.mockReturnValue(1)
    mockedUseIsMutating.mockReturnValue(0)

    render(
      <GlobalLoadingBoundary>
        <p>content</p>
      </GlobalLoadingBoundary>,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('content').closest('div')).toHaveAttribute('inert')
  })

  it('shows the overlay while a mutation is in flight', () => {
    mockedUseIsFetching.mockReturnValue(0)
    mockedUseIsMutating.mockReturnValue(1)

    render(
      <GlobalLoadingBoundary>
        <p>content</p>
      </GlobalLoadingBoundary>,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
