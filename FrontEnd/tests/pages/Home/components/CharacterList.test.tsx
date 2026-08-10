import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CharacterList from '../../../../src/pages/Home/components/CharacterList'

const CHARACTERS = [
  { id: '1', name: 'Luke Skywalker' },
  { id: '2', name: 'Leia Organa' },
]

describe('CharacterList', () => {
  it('renders a button for each character', () => {
    render(<CharacterList characters={CHARACTERS} selectedId={null} onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Luke Skywalker' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leia Organa' })).toBeInTheDocument()
  })

  it('marks the selected character as pressed', () => {
    render(<CharacterList characters={CHARACTERS} selectedId="2" onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Luke Skywalker' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Leia Organa' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onSelect with the character id when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<CharacterList characters={CHARACTERS} selectedId={null} onSelect={onSelect} />)

    await user.click(screen.getByRole('button', { name: 'Leia Organa' }))

    expect(onSelect).toHaveBeenCalledWith('2')
  })
})
