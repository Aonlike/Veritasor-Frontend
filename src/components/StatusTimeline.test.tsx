import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import StatusTimeline from './StatusTimeline'
import { AttestationsProvider } from '../state/attestations'
import type { RealtimeService, StatusUpdate } from '../services/realtime'

function createService() {
  let onUpdate: ((update: StatusUpdate) => void) | undefined
  const service: RealtimeService = {
    subscribe(updateListener) {
      onUpdate = updateListener
      return () => {
        onUpdate = undefined
      }
    },
  }
  return { service, emit: (update: StatusUpdate) => onUpdate?.(update) }
}

describe('StatusTimeline', () => {
  it('adds incoming status updates to the timeline', () => {
    const { service, emit } = createService()
    render(
      <AttestationsProvider service={service}>
        <StatusTimeline />
      </AttestationsProvider>,
    )

    act(() => {
      emit({
        id: 'event-3',
        attestationId: 'att-2',
        status: 'building_merkle_root',
        message: 'Proof is being assembled.',
        timestamp: '2026-11-23T06:00:00Z',
      })
    })

    expect(screen.getByText('Building Merkle Root')).toBeInTheDocument()
    expect(screen.getByText(/att-2/)).toBeInTheDocument()
    expect(screen.getByText('Proof is being assembled.')).toBeInTheDocument()
  })
})
