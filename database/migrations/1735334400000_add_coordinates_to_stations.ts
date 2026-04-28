import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stations'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.decimal('lat', 8, 6).nullable()
      table.decimal('lng', 8, 6).nullable()
    })

    this.defer(async (db) => {
      const fs = await import('fs')
      const path = await import('path')
      
      const csvPath = path.resolve(__dirname, '../../assets/data/stations_coordinates.csv')
      if (!fs.existsSync(csvPath)) return

      const csvData = fs.readFileSync(csvPath, 'utf-8').trim().split('\n')
      csvData.shift() // remove header

      let updated = 0
      for (const line of csvData) {
        if (!line.trim()) continue
        const [stationCode, stationName, latStr, lngStr] = line.split('\t')
        if (!stationCode || !latStr || !lngStr || !stationName) continue

        const lat = parseFloat(latStr)
        const lng = parseFloat(lngStr)

        const res = await db.from(this.tableName)
          .where('viaggiotreno_station_code', stationCode)
          .update({ lat, lng, viaggiotreno_long_name: stationName })
        
        if (res > 0) updated++
      }
      console.log(`Updated ${updated} stations with coordinates from CSV`)
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('lat')
      table.dropColumn('lng')
    })
  }
}
