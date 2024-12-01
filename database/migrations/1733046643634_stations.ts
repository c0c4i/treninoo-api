import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stations'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('italo_station_code').unique()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('italo_station_code')
    })
  }
}
