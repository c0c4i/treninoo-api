import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Statistic extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public date: Date

  @column()
  public trainCode: number

  @column()
  public departureStation: string

  @column()
  public stationCode: string

  @column()
  public arrivalDelay: number

  @column()
  public departureDelay: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
