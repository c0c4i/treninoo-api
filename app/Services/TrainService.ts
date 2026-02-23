import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
import { Station } from '../../model/Station'

export default class TrainService {
  public async getTodayDepartureDate(
    trainNumber: string,
    departureStation: string
  ): Promise<number | undefined> {
    const url = Env.get('BASE_URL') + `/cercaNumeroTrenoTrenoAutocomplete/${trainNumber}`

    const { data: data } = await axios.get(url)

    const lines = data.split('\n')
    lines.splice(lines.length - 1, 1)

    for (const line of lines) {
      const station = Station.fromDeparture(line)
      if (station.stationCode == departureStation) {
        return station.departureDate
      }
    }
  }
}
