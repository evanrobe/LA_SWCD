import { useEffect, type ReactNode } from 'react'
import { useIsBusy } from '../hooks/useIsBusy'
import { takeElementFocusedBeforeBusy } from '../hooks/globalBusyStore'
import LoadingOverlay from './LoadingOverlay'

interface GlobalLoadingBoundaryProps {
  children: ReactNode
}

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
