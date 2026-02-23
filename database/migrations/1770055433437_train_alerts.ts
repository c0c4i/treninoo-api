import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'train_alerts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('device_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('devices')
        .onDelete('CASCADE')
      table.string('train_code').notNullable()
      table.string('origin_station_code').notNullable()
      table.string('notify_station_code').notNullable()
      table.integer('days_of_week').notNullable()
      table.integer('notify_before_min').notNullable().defaultTo(5)
      table.time('origin_departure_time').nullable()
      table.boolean('enabled').notNullable().defaultTo(true)
      table.date('autocomplete_checked_date').nullable()
      table.timestamp('last_autocomplete_check_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())

      // Unique constraint to prevent duplicate alerts for the same device, train, origin station, notify station and departure time
      table.unique(['device_id', 'train_code', 'notify_station_code'], {
        indexName: 'unique_train_alert',
      })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
