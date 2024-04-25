import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
// import { TrainStatus } from '../../../model/TrainStatus'
import { TrainStatus } from '../../../model/TrainStatus'

export default class ItalosController {
  public async details({ request, response }) {
    const trainCode = request.param('trainCode')

    const url = Env.get('ITALO_BASE_URL') + `/RicercaTrenoService`

    try {
      // ?&TrainNumber=1233
      const { data: data } = await axios.get(url, { params: { TrainNumber: trainCode } })

      // If the train is not found, send 404 response
      // Or fermate field is an empty array
      if (data['IsEmpty']) {
        return response.status(404).send({
          url: url,
          status: null,
        })
      }

      const status = TrainStatus.fromItaloJson(data)

      response.send({
        url: url,
        status,
      })
    } catch (error) {
      console.log(error)
      response.status(500).send({
        url: url,
      })
    }
  }
}
