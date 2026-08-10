import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import GlobalLoadingBoundary from '../../src/components/GlobalLoadingBoundary'
import { decrementBusyCount, incrementBusyCount, resetBusyCountForTests } from '../../src/hooks/globalBusyStore'

describe('GlobalLoadingBoundary', () => {
  afterEach(() => {
    resetBusyCountForTests()
  })

  it('renders children without the overlay when nothing is busy', () => {
    render(
      <GlobalLoadingBoundary>
        <p>content</p>
      </GlobalLoadingBoundary>,
    )

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByText('content').closest('div')).not.toHaveAttribute('inert')
  })

  it('shows the overlay and marks content inert while the busy count is above zero', () => {
    render(
      <GlobalLoadingBoundary>
        <p>content</p>
      </GlobalLoadingBoundary>,
    )

    act(() => {
      incrementBusyCount()
    })

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('content').closest('div')).toHaveAttribute('inert')

    act(() => {
      decrementBusyCount()
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('stays busy while multiple actions overlap, until the last one finishes', () => {
    render(
      <GlobalLoadingBoundary>
        <p>content</p>
      </GlobalLoadingBoundary>,
    )

    act(() => {
      incrementBusyCount()
      incrementBusyCount()
    })

    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => {
      decrementBusyCount()
    })

    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => {
      decrementBusyCount()
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('refocuses the element that was focused before the busy state started, once it clears', () => {
    render(
      <GlobalLoadingBoundary>
        <input aria-label="Search characters" />
      </GlobalLoadingBoundary>,
    )

    const input = screen.getByRole('textbox', { name: 'Search characters' })
    input.focus()
    expect(input).toHaveFocus()

    act(() => {
      incrementBusyCount()
    })

    const focusSpy = vi.spyOn(input, 'focus')

    act(() => {
      decrementBusyCount()
    })

    expect(focusSpy).toHaveBeenCalledTimes(1)
  })
})
