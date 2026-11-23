import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AttestationProgress from './AttestationProgress'
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

describe('AttestationProgress', () => {
  it('shows progress from a realtime status update', () => {
    const { service, emit } = createService()
    render(
      <AttestationsProvider service={service}>
        <AttestationProgress />
      </AttestationsProvider>,
    )

    act(() => {
      emit({ id: 'event-2', attestationId: 'att-1', status: 'verifying', step: 2 })
    })

    expect(screen.getByText('Step 2 of 4')).toBeInTheDocument()
    expect(screen.getAllByText('Verifying the connected revenue sources.')).toHaveLength(2)
    expect(screen.getByText('In progress')).toBeInTheDocument()
  })
})
