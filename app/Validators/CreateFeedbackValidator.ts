import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateFeedbackValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    feedback: schema.string(),
  })

  public messages = {}
}
