// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import { Station } from '../../../model/Station'

const axios = require('axios')

export default class DepartureStationsController {
  public async index({ request }, trainCode?: number) {
    const id = request.param('id') ?? trainCode
    const url = Env.get('BASE_URL') + `/cercaNumeroTrenoTrenoAutocomplete/${id}`

    const { data: data } = await axios.get(url)

    const lines = data.split('\n')
    lines.splice(lines.length - 1, 1)

    let stations: Station[] = []
    for (const line of lines) {
      stations.push(Station.fromDeparture(line))
    }

    stations = stations.filter(
      (item, index, self) => index === self.findIndex((obj) => obj.stationCode === item.stationCode)
    )

    return {
      url: url,
      total: stations.length,
      stations: stations,
    }
  }
}
