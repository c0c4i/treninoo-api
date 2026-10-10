import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Redis from '@ioc:Adonis/Addons/Redis'
import Logger from '@ioc:Adonis/Core/Logger'

export { checkItaloTrainCode }

async function checkItaloTrainCode(trainCode: string): Promise<boolean> {
  const start = Date.now()
  try {
    const url = Env.get('ITALO_BASE_URL') + `/RicercaTrenoService`

    // Italo answers in ~0.2-1.6s; without a cap a degraded gateway stalls every train search
    const response = await axios.get(url, { params: { TrainNumber: trainCode }, timeout: 2000 })
    Logger.info({ status: response.status, ms: Date.now() - start, trainCode }, 'italo upstream')

    if (!response.data.IsEmpty) return true

    // Check if there is cache for this train
    const cached = await Redis.get(`italo:train:${trainCode}`)

    return !!cached
  } catch (error) {
    Logger.error({ ms: Date.now() - start, trainCode, err: error.message }, 'italo upstream failed')
    return false
  }
}
