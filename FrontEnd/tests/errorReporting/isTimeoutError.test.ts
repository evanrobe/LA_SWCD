import { describe, expect, it } from 'vitest'
import { isTimeoutError } from '../../src/errorReporting/isTimeoutError'

describe('isTimeoutError', () => {
  it('returns true for a DOMException named TimeoutError', () => {
    expect(isTimeoutError(new DOMException('Action timed out', 'TimeoutError'))).toBe(true)
  })

  it('returns false for other DOMExceptions', () => {
    expect(isTimeoutError(new DOMException('Cancelled', 'AbortError'))).toBe(false)
  })

  it('returns false for a plain Error', () => {
    expect(isTimeoutError(new Error('boom'))).toBe(false)
  })

  it('returns false for non-error values', () => {
    expect(isTimeoutError('boom')).toBe(false)
    expect(isTimeoutError(null)).toBe(false)
    expect(isTimeoutError(undefined)).toBe(false)
  })
})
