import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import {
  realtimeService,
  type AttestationStatus,
  type RealtimeConnectionState,
  type RealtimeService,
  type StatusUpdate,
} from '../services/realtime'

type AttestationsState = {
  updates: StatusUpdate[]
  connectionState: RealtimeConnectionState
  error?: string
}

type AttestationsAction =
  | { type: 'STATUS_UPDATE'; update: StatusUpdate }
  | { type: 'CONNECTION_STATE'; state: RealtimeConnectionState; error?: Error }

export interface AttestationsContextValue {
  updates: StatusUpdate[]
  updatesByAttestation: Record<string, StatusUpdate[]>
  latestUpdate?: StatusUpdate
  connectionState: RealtimeConnectionState
  error?: string
}

const initialState: AttestationsState = {
  updates: [],
  connectionState: 'offline',
}

function reducer(state: AttestationsState, action: AttestationsAction): AttestationsState {
  switch (action.type) {
    case 'STATUS_UPDATE': {
      const existingIndex = state.updates.findIndex((update) => update.id === action.update.id)
      const updates = [...state.updates]
      if (existingIndex === -1) updates.push(action.update)
      else updates[existingIndex] = action.update
      return { ...state, updates }
    }
    case 'CONNECTION_STATE':
      return { ...state, connectionState: action.state, error: action.error?.message }
    default:
      return state
  }
}

const AttestationsContext = createContext<AttestationsContextValue | undefined>(undefined)

export function AttestationsProvider({
  children,
  service = realtimeService,
}: {
  children: ReactNode
  service?: RealtimeService
}) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(
    () =>
      service.subscribe(
        (update) => dispatch({ type: 'STATUS_UPDATE', update }),
        (connectionState, error) => dispatch({ type: 'CONNECTION_STATE', state: connectionState, error }),
      ),
    [service],
  )

  const value = useMemo(() => {
    const updatesByAttestation: Record<string, StatusUpdate[]> = {}
    state.updates.forEach((update) => {
      const attestationUpdates = updatesByAttestation[update.attestationId] ?? []
      attestationUpdates.push(update)
      updatesByAttestation[update.attestationId] = attestationUpdates
    })

    return {
      ...state,
      updatesByAttestation,
      latestUpdate: state.updates[state.updates.length - 1],
    }
  }, [state])

  return <AttestationsContext.Provider value={value}>{children}</AttestationsContext.Provider>
}

export function useAttestations() {
  const context = useContext(AttestationsContext)
  if (!context) {
    throw new Error('useAttestations must be used within an AttestationsProvider')
  }
  return context
}

export function getStatusStep(status: AttestationStatus, step?: number) {
  if (step !== undefined) return step
  switch (status) {
    case 'collecting':
      return 1
    case 'verifying':
      return 2
    case 'building_merkle_root':
      return 3
    case 'publishing':
      return 4
    case 'verified':
      return 4
    case 'failed':
    case 'canceled':
      return 1
    case 'pending':
      return 0
  }
}
