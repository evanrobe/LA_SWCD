import { describe, expect, it } from 'vitest'
import { fetchWithTimeout, isTimeoutError } from '../../src/api/fetchWithTimeout'

describe('fetchWithTimeout', () => {
  it('resolves with the fetcher result when it completes before the timeout', async () => {
    const result = await fetchWithTimeout(async () => 'ok', new AbortController().signal, 1000)

    expect(result).toBe('ok')
  })

  it('aborts the inner signal and rejects with a TimeoutError when the timeout elapses', async () => {
    let innerSignal: AbortSignal | undefined

    const fetcher = (signal: AbortSignal) => {
      innerSignal = signal
      return new Promise<string>((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason))
      })
    }

    try {
      await fetchWithTimeout(fetcher, new AbortController().signal, 10)
      expect.fail('expected fetchWithTimeout to reject')
    } catch (error) {
      expect(isTimeoutError(error)).toBe(true)
    }

    expect(innerSignal?.aborted).toBe(true)
  })

  it('propagates an outer abort into the inner signal', async () => {
    const outerController = new AbortController()
    let innerSignal: AbortSignal | undefined

    const fetcher = (signal: AbortSignal) => {
      innerSignal = signal
      return new Promise<string>((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason))
      })
    }

    const promise = fetchWithTimeout(fetcher, outerController.signal, 5000)
    outerController.abort(new DOMException('Cancelled', 'AbortError'))

    try {
      await promise
      expect.fail('expected fetchWithTimeout to reject')
    } catch (error) {
      expect(isTimeoutError(error)).toBe(false)
      expect((error as DOMException).name).toBe('AbortError')
    }

    expect(innerSignal?.aborted).toBe(true)
  })
})
