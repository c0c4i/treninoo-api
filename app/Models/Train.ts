import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Train extends BaseModel {
  @column({ isPrimary: true })
  public trainCode: number

  @column({ isPrimary: true })
  public departureStation: string
}
