import axios from 'axios'
import { Station } from '../../../model/Station'
import Database from '@ioc:Adonis/Lucid/Database'

export default class LeFrecceStationController {
  public async autocomplete({ request, response }) {
    const id = request.param('word')
    const url = `https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=${id}&limit=20`

    const { data: data } = await axios.get(url)

    const stations: Station[] = []
    for (const station of data) {
      if (station.multistation) continue
      const s = Station.fromLeFrecce(station)

      // Get stationCode from last 5 letters of s.stationCode
      const stationCode = `S${s.stationCode.toString().slice(-5)}`

      // Get priority from database
      const result = await Database.from('stations')
        .select('priority')
        .where('viaggiotreno_station_code', stationCode.toString())

      if (result.length > 0) {
        s.priority = result[0].priority
      }

      stations.sort((station1: Station, station2: Station) => station1.priority - station2.priority)

      stations.push(s)
    }

    response.send({
      url: url,
      total: stations.length,
      stations: stations,
    })
  }
}
