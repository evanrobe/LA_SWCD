// Blocks interaction with its children and shows a spinner while any service action is in flight.
import { useEffect, type ReactNode } from 'react'
import { useIsBusy } from '../hooks/useIsBusy'
import { takeElementFocusedBeforeBusy } from '../hooks/globalBusyStore'
import LoadingOverlay from './LoadingOverlay'

interface GlobalLoadingBoundaryProps {
  children: ReactNode
}

/** Shows a loading overlay and inertly disables `children` whenever the global busy count is nonzero. */
function GlobalLoadingBoundary({ children }: GlobalLoadingBoundaryProps) {
  const isBusy = useIsBusy()

  useEffect(() => {
    if (!isBusy) {
      takeElementFocusedBeforeBusy()?.focus()
    }
  }, [isBusy])

  return (
    <>
      {isBusy && <LoadingOverlay />}
      <div inert={isBusy}>{children}</div>
    </>
  )
}

export default GlobalLoadingBoundary
