import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'app_metadata'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('key').primary()
      table.text('value').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.defer(async (db) => {
      const crypto = await import('crypto')

      const stations = await db.from('stations')
        .whereNotNull('lat')
        .whereNotNull('lng')
        .select(
          'viaggiotreno_station_code as stationCode',
          'viaggiotreno_long_name as stationName',
          'lat',
          'lng'
        )

      const dumpJson = JSON.stringify(stations)
      const hash = crypto.createHash('sha256').update(dumpJson).digest('hex')

      await db.rawQuery(
        `INSERT INTO app_metadata (key, value, created_at, updated_at) VALUES (?, ?, NOW(), NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        ['stations_dump_hash', hash]
      )

      console.log(`Stored stations_dump_hash: ${hash}`)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
