import CreateFeedbackValidator from 'App/Validators/CreateFeedbackValidator'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class FeedbacksController {
  public async create({ request, response }) {
    const payload = await request.validate(CreateFeedbackValidator)
    await Mail.sendLater((message) => {
      message
        .from(Env.get('MAIL_FROM'), 'Treninoo')
        .to(Env.get('MAIL_TO'))
        .subject('Hai un nuovo feedback!')
        .text(payload.feedback)
    })

    response.send({ success: true })
  }
}
