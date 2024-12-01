import { Station } from '../model/Station'
import Database from '@ioc:Adonis/Lucid/Database'

export { findStationByName }

// Return Station object or undefined if not found
async function findStationByName(stationName: string): Promise<Station | undefined> {
  const result = await Database.from('stations')
    .select('viaggiotreno_station_code')
    .where('lefrecce_name', stationName)

  if (result.length === 0) return undefined

  return new Station(result[0].viaggiotreno_station_code, stationName)
}
