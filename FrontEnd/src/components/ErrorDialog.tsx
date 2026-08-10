import { clearGlobalError } from '../errorReporting/globalErrorStore'
import { useGlobalError } from '../errorReporting/useGlobalError'
import styles from './ErrorDialog.module.css'

function ErrorDialog() {
  const hasError = useGlobalError()

  if (!hasError) {
    return null
  }

  function handleReload() {
    clearGlobalError()
    window.location.reload()
  }

  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="error-dialog-title">
        <h2 id="error-dialog-title">Something went wrong</h2>
        <p>An unexpected error occurred. Please reload the page to continue.</p>
        <button type="button" onClick={handleReload}>
          OK
        </button>
      </div>
    </div>
  )
}

export default ErrorDialog
