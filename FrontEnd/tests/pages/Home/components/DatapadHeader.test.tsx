import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import DatapadHeader from '../../../../src/pages/Home/components/DatapadHeader'

function ControlledDatapadHeader() {
  const [searchTerm, setSearchTerm] = useState('')
  return <DatapadHeader searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
}

describe('DatapadHeader', () => {
  it('renders the search box with the given value', () => {
    render(<DatapadHeader searchTerm="luke" onSearchTermChange={vi.fn()} />)

    expect(screen.getByRole('searchbox', { name: 'Search characters' })).toHaveValue('luke')
  })

  it('accumulates typed characters when wired to real state', async () => {
    const user = userEvent.setup()
    render(<ControlledDatapadHeader />)

    await user.type(screen.getByRole('searchbox', { name: 'Search characters' }), 'leia')

    expect(screen.getByRole('searchbox', { name: 'Search characters' })).toHaveValue('leia')
  })
})
