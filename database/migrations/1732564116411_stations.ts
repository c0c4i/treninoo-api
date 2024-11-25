import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stations'

  public async up() {
    // Add new columns: viaggiotreno_region(int), viaggiotreno_long_name(string), viaggiotreno_short_name(string), lefrecce_station_code(string)
    this.schema.table(this.tableName, (table) => {
      table.integer('viaggiotreno_region')
      table.string('viaggiotreno_long_name')
      table.string('viaggiotreno_short_name')
      table.string('lefrecce_station_code')
    })
  }

  public async down() {
    // Drop columns: viaggiotreno_region(int), viaggiotreno_long_name(string), viaggiotreno_short_name(string), lefrecce_station_code(string)
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('viaggiotreno_region')
      table.dropColumn('viaggiotreno_long_name')
      table.dropColumn('viaggiotreno_short_name')
      table.dropColumn('lefrecce_station_code')
    })
  }
}
