import Env from '@ioc:Adonis/Core/Env'
import { vtGet, VT_TTL } from 'App/Services/ViaggiaTrenoClient'
import { Station } from '../../../model/Station'

export default class StationController {
  public async autocomplete({ request, response }) {
    const id = request.param('word')
    const url = Env.get('BASE_URL') + `/autocompletaStazione/${id}`

    const data = await vtGet(url, VT_TTL.static)

    const lines = data.split('\n')
    response.send(lines)
    lines.splice(lines.length - 1, 1)

    const stations: Station[] = []
    lines.forEach((line) => {
      stations.push(Station.fromAutocomplete(line))
    })

    stations.sort((station1: Station, station2: Station) => station1.priority - station2.priority)

    response.send({
      url: url,
      total: stations.length,
      stations: stations,
    })
  }
}
