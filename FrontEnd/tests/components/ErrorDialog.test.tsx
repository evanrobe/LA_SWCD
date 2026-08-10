import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ErrorDialog from '../../src/components/ErrorDialog'
import { clearGlobalError, reportGlobalError } from '../../src/errorReporting/globalErrorStore'

describe('ErrorDialog', () => {
  afterEach(() => {
    clearGlobalError()
    vi.restoreAllMocks()
  })

  it('renders nothing when there is no global error', () => {
    render(<ErrorDialog />)

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('shows a generic message (not the specific error) and reloads the page when OK is clicked', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const reloadSpy = vi.fn()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: reloadSpy },
    })
    const user = userEvent.setup()

    reportGlobalError(new Error('some very specific internal detail'), 'API request failed')

    render(<ErrorDialog />)

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument()
    expect(screen.queryByText('some very specific internal detail')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'OK' }))

    expect(reloadSpy).toHaveBeenCalledTimes(1)
  })
})
