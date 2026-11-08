import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'
import axios from 'axios'
import type { StationDTO, PaginatedSolutionsDTO } from '../../contracts/adapter'

// Backstop above the adapter's own limits: a solutions request can chain three
// SOAP calls of up to 15s each (search, catalogs, searchBase).
const ADAPTER_TIMEOUT_MS = 45000

export interface GetSolutionsParams {
  departureStation: string
  arrivalStation: string
  date: string
  onlyFrecce?: boolean
  onlyRegional?: boolean
  onlyIntercity?: boolean
  noChanges?: boolean
  offset?: number
  limit?: number
}

export default class TrenitaliaAdapterService {
  private baseUrl: string | undefined

  constructor() {
    this.baseUrl = Env.get('ADAPTER_URL')
  }

  public isEnabled(): boolean {
    return !!this.baseUrl
  }

  public async autocomplete(word: string, multistation = false): Promise<StationDTO[]> {
    return this.get<StationDTO[]>('/stations/autocomplete', { q: word, multistation })
  }

  public async getSolutions(params: GetSolutionsParams): Promise<PaginatedSolutionsDTO> {
    return this.get<PaginatedSolutionsDTO>('/solutions', params)
  }

  private async get<T>(path: string, params: object): Promise<T> {
    const start = Date.now()
    try {
      const { data } = await axios.get<T>(`${this.baseUrl}${path}`, {
        params,
        timeout: ADAPTER_TIMEOUT_MS,
      })
      return data
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        // Path only: the adapter's address must not reach the logs
        Logger.warn({ path, ms: Date.now() - start }, 'adapter timed out')
      }
      throw error
    }
  }
}
