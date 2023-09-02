import axios from 'axios'
import { StationTrain } from '../../../model/StationTrain'
import Env from '@ioc:Adonis/Core/Env'

export default class ViaggioTrenoStationController {
  public async status({ request, response }) {
    // Get last word from the URL
    const type = request.url().split('/').pop()

    // Set type for ViaggioTreno
    // If `type` == 'departure', then `type` == 'partenze'
    // If `type` == 'arrival', then `type` == 'arrivi'
    const typeViaggioTreno = type === 'departure' ? 'partenze' : 'arrivi'

    const id = request.param('id')
    let date = new Date()
    date.setSeconds(0)

    // Set timezone to Rome (GMT+2), but handle the hour changes
    date.setHours(date.getHours() + 2)

    let url = Env.get('BASE_URL') + `/${typeViaggioTreno}/${id}/${date.toUTCString()}`
    url += '+0200'
    url = encodeURI(url)
    const { data: data } = await axios.get(url)

    if (!Array.isArray(data)) return response.status(404).send({ error: 'Not found' })

    const trains: StationTrain[] = []

    for (const train of data) {
      trains.push(StationTrain.fromJson(train))
    }

    response.send({
      url: url,
      total: trains.length,
      trains,
    })
  }
}
