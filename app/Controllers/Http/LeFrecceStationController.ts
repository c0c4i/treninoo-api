import axios from 'axios'
import { Station } from '../../../model/Station'

export default class LeFrecceStationController {
  public async autocomplete({ request, response }) {
    const id = request.param('word')
    const url = `https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=${id}&limit=20`

    const { data: data } = await axios.get(url)

    const stations: Station[] = []
    for (const station of data) {
      if (station.multistation) continue
      stations.push(Station.fromLeFrecce(station))
    }

    response.send({
      url: url,
      total: stations.length,
      stations: stations,
    })
  }
}
