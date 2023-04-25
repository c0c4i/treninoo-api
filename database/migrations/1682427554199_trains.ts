import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Trains extends BaseSchema {
  protected tableName = 'trains'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('train_code')
      table.string('departure_station')
      table.primary(['train_code', 'departure_station'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
