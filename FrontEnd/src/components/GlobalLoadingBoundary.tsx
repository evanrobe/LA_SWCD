import type { ReactNode } from 'react'
import { useIsBusy } from '../hooks/useIsBusy'
import LoadingOverlay from './LoadingOverlay'

interface GlobalLoadingBoundaryProps {
  children: ReactNode
}

function GlobalLoadingBoundary({ children }: GlobalLoadingBoundaryProps) {
  const isBusy = useIsBusy()

  return (
    <>
      {isBusy && <LoadingOverlay />}
      <div inert={isBusy}>{children}</div>
    </>
  )
}

export default GlobalLoadingBoundary
