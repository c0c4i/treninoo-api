enum Status {
  REGULAR = 'REGULAR',
  SUPPRESSED = 'SUPPRESSED',
  PARTIALLY_SUPPRESSED = 'PARTIALLY_SUPPRESSED',
  DEVIATED = 'DEVIATED',
}

// Method 1: Receive provvedimento and tipoTreno as arguments
function getStatus(provvedimento: number, tipoTreno: string): Status {
  if (provvedimento === 0 && tipoTreno === 'PG') return Status.REGULAR
  if (provvedimento === 1 && tipoTreno === 'ST') return Status.SUPPRESSED
  if (provvedimento === 1 || provvedimento === 2)
    if (tipoTreno === 'PP' || tipoTreno === 'SI' || tipoTreno === 'SF')
      return Status.PARTIALLY_SUPPRESSED
  if (provvedimento === 3 && tipoTreno === 'DV') return Status.DEVIATED
  return Status.REGULAR
}

export { Status, getStatus }
