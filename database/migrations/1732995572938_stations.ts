import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'stations'

  public async up() {
    // Add new columns: lefrecce_name(string)
    this.schema.table(this.tableName, (table) => {
      table.string('lefrecce_name')
    })
  }

  public async down() {
    // Drop columns: lefrecce_name(string)
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('lefrecce_name')
    })
  }
}
