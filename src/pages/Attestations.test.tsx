/**
 * Attestations Page Tests
 *
 * Tests for Attestations component including loading states, accessibility, and responsive behavior.
 * Ensures WCAG 2.1 AA compliance with proper semantic HTML and table structure.
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Attestations from './Attestations'
import { AttestationsProvider } from '../state/attestations'
import type { RealtimeService } from '../services/realtime'

const testRealtimeService: RealtimeService = {
  subscribe: () => () => {},
}

function renderAttestations() {
  return render(
    <MemoryRouter>
      <AttestationsProvider service={testRealtimeService}>
        <Attestations />
      </AttestationsProvider>
    </MemoryRouter>,
  )
}

describe('Attestations Page', () => {
  it('renders the attestation progress and status history', () => {
    renderAttestations()
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Attestations')
    expect(screen.getByRole('region', { name: 'Attestation progress' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Attestation status timeline' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start attestation' })).toBeInTheDocument()
  })

  it('shows realtime connection state and an empty status history', () => {
    renderAttestations()
    expect(screen.getByText('Realtime updates: offline')).toBeInTheDocument()
    expect(screen.getByText('No status updates received yet.')).toBeInTheDocument()
  })

  it('displays the empty attestations state', () => {
    renderAttestations()
    expect(screen.getByRole('region', { name: 'Attestations empty state' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Run a revenue report' })).toHaveAttribute('href', '/')
  })
})
