import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import LoadingOverlay from './LoadingOverlay'

interface GlobalLoadingBoundaryProps {
  children: ReactNode
}

function GlobalLoadingBoundary({ children }: GlobalLoadingBoundaryProps) {
  const fetchingCount = useIsFetching()
  const mutatingCount = useIsMutating()
  const isBusy = fetchingCount > 0 || mutatingCount > 0

  return (
    <>
      {isBusy && <LoadingOverlay />}
      <div inert={isBusy}>{children}</div>
    </>
  )
}

export default GlobalLoadingBoundary
