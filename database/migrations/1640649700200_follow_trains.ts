import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FollowTrains extends BaseSchema {
  protected tableName = 'follow_trains'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('device_token')
      table.string('train_code')
      table.string('departure_station')
      table.string('station_code')
      table.string('follow_type')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.primary(['device_token', 'train_code', 'departure_station'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
