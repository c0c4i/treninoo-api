import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'notification_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('train_alert_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('train_alerts')
        .onDelete('CASCADE')
      table
        .integer('device_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('devices')
        .onDelete('CASCADE')
      table.date('send_date').notNullable()
      table.timestamp('sent_at', { useTz: true }).nullable()
      table.time('scheduled_arrival').nullable()
      table.integer('delay_minutes').nullable()
      table.json('payload_json').nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
