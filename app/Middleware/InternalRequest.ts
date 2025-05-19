import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class InternalRequest {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    if (request.header('x-private-key') !== process.env.PRIVATE_KEY) {
      return response.status(401).send({
        message: 'Hey! What are you looking for? This is a private API :)',
      })
    }

    await next()
  }
}
