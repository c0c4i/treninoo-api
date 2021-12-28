import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

enum FollowType {
  ARRIVAL = 'arrival',
  DEPARTURE = 'departure',
}

export default class NewFollowTrainValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    deviceToken: schema.string(),
    trainCode: schema.string(),
    departureStation: schema.string(),
    stationCode: schema.string(),
    followType: schema.enum(Object.values(FollowType)),
  })

  public messages = {}
}
