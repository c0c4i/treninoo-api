import axios from 'axios'
import { Station } from '../../../model/Station'
import Database from '@ioc:Adonis/Lucid/Database'
import TrenitaliaAdapterService from 'App/Services/TrenitaliaAdapterService'

export default class LeFrecceStationController {
  private adapterService = new TrenitaliaAdapterService()

  public async autocomplete({ request, response }) {
    const word = request.param('word')
    const multistation = request.qs().multistation === 'true'

    try {
      let stations: Station[]

      if (this.adapterService.isEnabled()) {
        const dtos = await this.adapterService.autocomplete(word, multistation)
        stations = dtos.map((dto) => Station.fromAdapter(dto))
      } else {
        const url = `https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=${word}&limit=100`
        const { data } = await axios.get(url)
        stations = (data as any[])
          .filter((s) => !s.multistation || multistation)
          .map((s) => Station.fromLeFrecce(s))
      }

      const rows = await Database.from('stations')
        .select('lefrecce_station_code', 'priority')
        .whereIn(
          'lefrecce_station_code',
          stations.map((s) => s.stationCode)
        )
      const priorities = new Map(rows.map((r) => [r.lefrecce_station_code, r.priority]))
      for (const station of stations) {
        // LeFrecce ids are numbers at runtime, the column is a string
        const priority = priorities.get(String(station.stationCode))
        if (priority !== undefined) station.priority = priority
      }

      stations.sort((a, b) => a.priority - b.priority)

      return response.send({
        total: stations.length,
        stations,
      })
    } catch (error) {
      // Never forward error.message: it can contain the adapter's address
      console.error(error)

      return response.status(500).send({
        message: 'Internal server error',
      })
    }
  }
}
