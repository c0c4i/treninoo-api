import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('viaggiotreno_station_code').notNullable().index().primary()
      table.string('priority')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
