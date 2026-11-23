import { useAttestations } from '../state/attestations'

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function StatusTimeline({ attestationId }: { attestationId?: string }) {
  const { updates, updatesByAttestation, connectionState, error } = useAttestations()
  const visibleUpdates = attestationId ? updatesByAttestation[attestationId] ?? [] : updates

  return (
    <section
      aria-label="Attestation status timeline"
      style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}
    >
      <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Status timeline</h2>
      <p role="status" style={{ margin: '0.75rem 0 0', color: 'var(--muted)' }}>
        Realtime updates: {connectionState}
      </p>
      {error ? (
        <p role="alert" style={{ margin: '0.5rem 0 0', color: 'var(--danger)' }}>
          {error}
        </p>
      ) : null}
      {visibleUpdates.length === 0 ? (
        <p style={{ margin: '0.5rem 0 0', color: 'var(--muted)' }}>No status updates received yet.</p>
      ) : (
        <ol style={{ margin: '1rem 0 0', paddingLeft: '1.25rem', display: 'grid', gap: '0.8rem' }}>
          {[...visibleUpdates].reverse().map((update) => (
            <li key={update.id}>
              <strong>{formatStatus(update.status)}</strong>
              <span style={{ color: 'var(--muted)' }}> · {update.attestationId}</span>
              {update.timestamp ? (
                <time dateTime={update.timestamp} style={{ display: 'block', color: 'var(--muted)', fontSize: '0.9rem' }}>
                  {new Date(update.timestamp).toLocaleString()}
                </time>
              ) : null}
              {update.message ? <p style={{ margin: '0.35rem 0 0', color: 'var(--muted)' }}>{update.message}</p> : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
