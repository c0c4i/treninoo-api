import axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'
import { Station } from '../model/Station'

export { getDepartureStations }

async function getDepartureStations(trainCode: string): Promise<Station[]> {
  try {
    const url = Env.get('BASE_URL') + `/cercaNumeroTrenoTrenoAutocomplete/${trainCode}`

    const { data: data } = await axios.get(url)

    const lines = data.split('\n')
    lines.splice(lines.length - 1, 1)

    const stations: Station[] = []
    lines.forEach((line) => {
      stations.push(Station.fromDeparture(line))
    })

    return stations
  } catch (error) {
    console.error(`Error fetching departure stations for train code ${trainCode}:`, error)
    return []
  }
}
