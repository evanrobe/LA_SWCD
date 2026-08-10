import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getBusyCountSnapshot, resetBusyCountForTests } from '../../src/hooks/globalBusyStore'
import { useServiceAction } from '../../src/hooks/useServiceAction'
import { isTimeoutError } from '../../src/errorReporting/isTimeoutError'
import { clearGlobalError, getGlobalErrorSnapshot } from '../../src/errorReporting/globalErrorStore'

describe('useServiceAction', () => {
  afterEach(() => {
    resetBusyCountForTests()
    clearGlobalError()
    vi.restoreAllMocks()
  })

  it('starts in a loading state and increments the busy counter', () => {
    const { result } = renderHook(() => useServiceAction(() => new Promise(() => {}), []))

    expect(result.current.isLoading).toBe(true)
    expect(getBusyCountSnapshot()).toBe(1)
  })

  it('resolves with the action result and decrements the busy counter', async () => {
    const { result } = renderHook(() => useServiceAction(async () => 'ok', []))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toBe('ok')
    expect(result.current.isError).toBe(false)
    expect(getBusyCountSnapshot()).toBe(0)
  })

  it('retries once by default, then succeeds without ever setting an error', async () => {
    let calls = 0
    const action = vi.fn(async () => {
      calls += 1
      if (calls === 1) {
        throw new Error('transient failure')
      }
      return 'recovered'
    })

    const { result } = renderHook(() => useServiceAction(action, [], { retryDelayMs: 5 }))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toBe('recovered')
    expect(result.current.isError).toBe(false)
    expect(action).toHaveBeenCalledTimes(2)
  })

  it('reports a global error and stops retrying once retries are exhausted', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const failure = new Error('permanent failure')
    const action = vi.fn(async () => {
      throw failure
    })

    const { result } = renderHook(() => useServiceAction(action, [], { retryCount: 1, retryDelayMs: 5 }))

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(failure)
    expect(action).toHaveBeenCalledTimes(2)
    expect(getGlobalErrorSnapshot()).toBe(true)
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
  })

  it('aborts the action and surfaces a TimeoutError when it exceeds the timeout', async () => {
    let capturedSignal: AbortSignal | undefined
    const action = (signal: AbortSignal) => {
      capturedSignal = signal
      return new Promise<string>((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason))
      })
    }

    const { result } = renderHook(() => useServiceAction(action, [], { timeoutMs: 20, retryCount: 0 }))

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(isTimeoutError(result.current.error)).toBe(true)
    expect(capturedSignal?.aborted).toBe(true)
  })

  it('aborts the in-flight action and ignores its result when a dependency changes', async () => {
    let firstSignal: AbortSignal | undefined
    const action = vi.fn((name: string, signal: AbortSignal) => {
      if (name === 'first') {
        firstSignal = signal
      }
      return new Promise<string>((resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason))
        if (name === 'second') {
          resolve('second-result')
        }
      })
    })

    const { result, rerender } = renderHook(({ name }: { name: string }) => useServiceAction((signal) => action(name, signal), [name]), {
      initialProps: { name: 'first' },
    })

    rerender({ name: 'second' })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.data).toBe('second-result')
    expect(firstSignal?.aborted).toBe(true)
  })
})
