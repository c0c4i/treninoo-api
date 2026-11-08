export interface StationDTO {
  stationCode: string
  stationName: string
  // ViaggiaTreno-style code; absent when the gateway has none. Optional for older adapter builds.
  viaggiatrenoCode?: string
}

export interface SolutionTrainDTO {
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  trainCode: string
  category?: string
  originStation?: StationDTO
  destinationStation?: StationDTO
}

export interface SolutionDTO {
  // Optional for older adapter builds.
  solutionId?: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  trains: SolutionTrainDTO[]
  price?: number
  // Whether the solution can be purchased. Optional for older adapter builds.
  saleable?: boolean
}

export interface PaginatedSolutionsDTO {
  solutions: SolutionDTO[]
  total: number
  offset: number
  limit: number
  hasMore: boolean
}
