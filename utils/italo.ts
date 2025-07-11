import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import Redis from '@ioc:Adonis/Addons/Redis'

export { checkItaloTrainCode }

async function checkItaloTrainCode(trainCode: string): Promise<boolean> {
  try {
    const url = Env.get('ITALO_BASE_URL') + `/RicercaTrenoService`

    const response = await axios.get(url, { params: { TrainNumber: trainCode } })

    if (!response.data.IsEmpty) return true

    // Check if there is cache for this train
    const cached = await Redis.get(`italo:train:${trainCode}`)

    return !!cached
  } catch (error) {
    console.error(`Error checking Italo train code ${trainCode}:`, error)
    return false
  }
}
