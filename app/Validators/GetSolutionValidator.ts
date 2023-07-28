import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GetSolutionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    departureStation: schema.string(),
    arrivalStation: schema.string(),
    date: schema.date({
      format: 'yyyy-MM-dd HH:mm',
    }),
  })

  public messages: CustomMessages = {}
}
