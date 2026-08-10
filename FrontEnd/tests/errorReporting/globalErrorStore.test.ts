import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  clearGlobalError,
  getGlobalErrorSnapshot,
  reportGlobalError,
  subscribeToGlobalError,
} from '../../src/errorReporting/globalErrorStore'

describe('globalErrorStore', () => {
  afterEach(() => {
    clearGlobalError()
    vi.restoreAllMocks()
  })

  it('starts with no error', () => {
    expect(getGlobalErrorSnapshot()).toBe(false)
  })

  it('sets the error flag and logs to the console when an error is reported', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('boom')

    reportGlobalError(error, 'API request failed')

    expect(getGlobalErrorSnapshot()).toBe(true)
    expect(consoleErrorSpy).toHaveBeenCalledWith('API request failed:', error)
  })

  it('notifies subscribers when the error state changes', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const listener = vi.fn()
    const unsubscribe = subscribeToGlobalError(listener)

    reportGlobalError(new Error('boom'), 'API request failed')
    expect(listener).toHaveBeenCalledTimes(1)

    clearGlobalError()
    expect(listener).toHaveBeenCalledTimes(2)
    expect(getGlobalErrorSnapshot()).toBe(false)

    unsubscribe()
  })
})
