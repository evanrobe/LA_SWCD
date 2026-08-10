import { afterEach, describe, expect, it } from 'vitest'
import {
  decrementBusyCount,
  getBusyCountSnapshot,
  incrementBusyCount,
  resetBusyCountForTests,
  takeElementFocusedBeforeBusy,
} from '../../src/hooks/globalBusyStore'

describe('globalBusyStore', () => {
  afterEach(() => {
    resetBusyCountForTests()
    document.body.innerHTML = ''
  })

  it('tracks overlapping busy calls with a count', () => {
    expect(getBusyCountSnapshot()).toBe(0)

    incrementBusyCount()
    incrementBusyCount()
    expect(getBusyCountSnapshot()).toBe(2)

    decrementBusyCount()
    expect(getBusyCountSnapshot()).toBe(1)

    decrementBusyCount()
    expect(getBusyCountSnapshot()).toBe(0)
  })

  it('never goes negative', () => {
    decrementBusyCount()
    expect(getBusyCountSnapshot()).toBe(0)
  })

  it('does not overwrite the captured element on an overlapping increment', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    incrementBusyCount() // 0 -> 1: captures `input`

    const other = document.createElement('input')
    document.body.appendChild(other)
    other.focus()
    incrementBusyCount() // 1 -> 2: not a 0 -> 1 transition, should not overwrite

    expect(takeElementFocusedBeforeBusy()).toBe(input)
  })

  it('returns the element that was focused when the busy period started', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    incrementBusyCount()

    expect(takeElementFocusedBeforeBusy()).toBe(input)
  })

  it('returns null and only returns the element once', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()

    incrementBusyCount()

    expect(takeElementFocusedBeforeBusy()).toBe(input)
    expect(takeElementFocusedBeforeBusy()).toBeNull()
  })

  it('does not capture document.body as the focused element', () => {
    document.body.focus()

    incrementBusyCount()

    expect(takeElementFocusedBeforeBusy()).toBeNull()
  })
})
