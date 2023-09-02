import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stations'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('priority').alter().defaultTo(5).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
