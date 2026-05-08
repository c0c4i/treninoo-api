import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StationSyncController {
  /**
   * GET /stations/sync?hash=CLIENT_HASH
   *
   * If client hash matches server hash → { status: 'ok' }
   * If client hash is missing or mismatched → { status: 'updated', hash, data }
   */
  public async index({ request, response }: HttpContextContract) {
    try {
      const clientHash = request.input('hash')

      // Get the server-side hash from app_metadata
      const row = await Database.from('app_metadata')
        .where('key', 'stations_dump_hash')
        .select('value')
        .first()

      if (!row) {
        return response.status(503).send({
          error: 'Station data not yet available. Run the seeder first.',
        })
      }

      const serverHash = row.value

      // If client already has the latest data, return ok
      if (clientHash && clientHash === serverHash) {
        return response.ok({ status: 'ok' })
      }

      // Hash mismatch or no hash provided — return full dump
      const stations = await Database.from('stations')
        .whereNotNull('lat')
        .whereNotNull('lng')
        .select(
          'viaggiotreno_station_code as stationCode',
          'viaggiotreno_long_name as stationName',
          'lefrecce_station_code as lefrecceStationCode',
          'lat',
          'lng'
        )

      return response.ok({
        status: 'updated',
        hash: serverHash,
        data: stations,
      })
    } catch (error) {
      return response.status(500).send({
        error: error.message,
      })
    }
  }
}
