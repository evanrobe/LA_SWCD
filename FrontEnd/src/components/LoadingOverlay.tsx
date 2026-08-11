// Full-screen spinner shown by GlobalLoadingBoundary while the app is busy.
import styles from './LoadingOverlay.module.css'

/** A full-screen "Loading…" spinner with an accessible status role. */
function LoadingOverlay() {
  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>Loading…</span>
    </div>
  )
}

export default LoadingOverlay
