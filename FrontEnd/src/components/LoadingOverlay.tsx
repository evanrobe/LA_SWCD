import styles from './LoadingOverlay.module.css'

function LoadingOverlay() {
  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span>Loading…</span>
    </div>
  )
}

export default LoadingOverlay
