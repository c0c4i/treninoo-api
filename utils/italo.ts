import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

export { checkItaloTrainCode }

async function checkItaloTrainCode(trainCode: string): Promise<boolean> {
  const url = Env.get('ITALO_BASE_URL') + `/RicercaTrenoService`

  return await axios
    .get(url, { params: { TrainNumber: trainCode } })
    .then((response) => !response.data.IsEmpty)
    .catch((_) => false)
}
