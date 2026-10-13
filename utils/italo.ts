import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Redis from '@ioc:Adonis/Addons/Redis'
import Logger from '@ioc:Adonis/Core/Logger'

export { checkItaloTrainCode, fetchItaloTrain }

// Hard cap so a hung connection is eventually freed; well above any real Italo latency
const ITALO_MAX_MS = 30000

/**
 * Fetch RicercaTrenoService, giving up on the caller's side after `timeoutMs`.
 * The HTTP request itself keeps running in the background so its real duration
 * is always logged, even when the caller has already moved on.
 */
async function fetchItaloTrain(trainCode: string, timeoutMs: number): Promise<any> {
  const url = Env.get('ITALO_BASE_URL') + `/RicercaTrenoService`
  const start = Date.now()

  const request = axios
    .get(url, { params: { TrainNumber: trainCode }, timeout: ITALO_MAX_MS })
    .then((response) => {
      const ms = Date.now() - start
      Logger.info({ ms, timedOut: ms > timeoutMs, trainCode }, 'italo upstream')
      return response.data
    })
    .catch((error) => {
      const ms = Date.now() - start
      Logger.error(
        { ms, timedOut: ms > timeoutMs, trainCode, err: error.message },
        'italo upstream failed'
      )
      throw error
    })

  let timer: NodeJS.Timeout | undefined
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`italo timeout after ${timeoutMs}ms`)), timeoutMs)
  })

  try {
    return await Promise.race([request, deadline])
  } finally {
    clearTimeout(timer)
  }
}

async function checkItaloTrainCode(trainCode: string): Promise<boolean> {
  try {
    // Runs on every train search: keep the cap tight so a degraded Italo doesn't stall Trenitalia users
    const data = await fetchItaloTrain(trainCode, 3000)

    if (!data.IsEmpty) return true

    // Check if there is cache for this train
    const cached = await Redis.get(`italo:train:${trainCode}`)

    return !!cached
  } catch {
    return false
  }
}
