import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

enum FollowType {
  ARRIVAL = 'arrival',
  DEPARTURE = 'departure',
}

export default class DeleteFollowTrainValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    deviceToken: schema.string(),
    trainCode: schema.string(),
    departureStation: schema.string(),
  })

  public messages = {}
}
