import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'

export default class EmailController {
  public async receive({ request, response }) {
    const body = request.body()

    await Mail.sendLater((message) => {
      message
        .from(Env.get('MAIL_FROM'), 'Treninoo')
        .to(Env.get('MAIL_TO'))
        .subject('Hai un nuovo messaggio!')
        .text(`From: ${body.from}\nTo: ${body.to}\nSubject: ${body.subject}\nText: ${body.text}`)
    })

    response.send({ success: true })
  }
}
