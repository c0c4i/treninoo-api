import axios from 'axios'
import { Station } from '../../../model/Station'
import Database from '@ioc:Adonis/Lucid/Database'

export default class LeFrecceStationController {
  public async autocomplete({ request, response }) {
    const id = request.param('word')
    const multistation = request.qs().multistation === 'true'
    const url = `https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=${id}&limit=100`

    const { data: data } = await axios.get(url)

    const stations: Station[] = []
    for (const station of data) {
      if (station.multistation && !multistation) continue
      const s = Station.fromLeFrecce(station)

      // Get priority from database
      const result = await Database.from('stations')
        .select('priority')
        .where('lefrecce_station_code', s.stationCode)

      if (result.length > 0) {
        s.priority = result[0].priority
      } else {
        // Try with generated code
        const stationCode = `S${s.stationCode.toString().slice(-5)}`
        const result = await Database.from('stations')
          .select('priority')
          .where('viaggiotreno_station_code', stationCode)
        if (result.length > 0) s.priority = result[0].priority
      }

      stations.push(s)
    }

    // Sort by priority
    stations.sort((station1: Station, station2: Station) => station1.priority - station2.priority)

    response.send({
      url: url,
      total: stations.length,
      stations: stations,
    })
  }
}
