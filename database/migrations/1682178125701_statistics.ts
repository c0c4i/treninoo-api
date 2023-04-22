import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Statistics extends BaseSchema {
  protected tableName = 'statistics'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.date('date').index()
      table.integer('train_code').index()
      table.string('departure_station').index()
      table.string('station_code').index()
      table.integer('arrival_delay')
      table.integer('departure_delay')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.unique(['date', 'train_code', 'departure_station', 'station_code'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
