import axios from 'axios'
import { MAP_PRIORITY } from '../utils/priorities'
import { Station } from '../model/Station'

console.log(MAP_PRIORITY.size)

mapViaggioTrenoToLeFrecce()

// For every station, I need to make API call to controller /lefrecce/autocomplete
async function mapViaggioTrenoToLeFrecce() {
  for (const [station, _] of MAP_PRIORITY) {
    const url = `https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=${station}&limit=10`
    const { data: data } = await axios.get(url)
    const stations = data.map((station: string) => Station.fromLeFrecce(station))
    console.log(stations.length)
  }
}
