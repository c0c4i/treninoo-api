import axios from 'axios'
import { StationTrain } from '../../../model/StationTrain'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database'

export default class ViaggioTrenoStationController {
  public async status({ request, response, lefrecceStationCode }) {
    // Get last word from the URL
    const type = request.url().split('/').pop()

    // Set type for ViaggioTreno
    // If `type` == 'departure', then `type` == 'partenze'
    // If `type` == 'arrival', then `type` == 'arrivi'
    const typeViaggioTreno = type === 'departure' ? 'partenze' : 'arrivi'

    const id = lefrecceStationCode ?? request.param('id')
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

  public async dump() {
    return await Database.from('stations').select('*')
  }

  public async statusLeFrecce({ request, response }) {
    const id = request.param('id')

    // Get viaggiotreno station code from database
    const station = await Database.from('stations')
      .select('viaggiotreno_station_code')
      .where('lefrecce_station_code', id)
      .first()

    const stationCode = station?.viaggiotreno_station_code ?? 'S' + id.slice(-5)

    return this.status({ request, response, lefrecceStationCode: stationCode })
  }
}
