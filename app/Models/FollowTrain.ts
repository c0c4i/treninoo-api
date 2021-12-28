import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class FollowTrain extends BaseModel {
  @column({ isPrimary: true })
  public deviceToken: string

  @column()
  public trainCode: string

  @column()
  public departureStation: string

  @column()
  public stationCode: string

  @column()
  public followType: string

  @column()
  public arrivedNotification: boolean

  @column()
  public departedNotification: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
