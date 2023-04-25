import Env from '@ioc:Adonis/Core/Env'

import axios from 'axios'
import { TrainStatus } from '../../../model/TrainStatus'
import Train from 'App/Models/Train'

export default class TrainStatusController {
  public async index({ request, response }, train?: Train) {
    const departureStation = request.param('departureStation') ?? train?.departureStation
    const trainCode = request.param('trainCode') ?? train?.trainCode
    const url =
      Env.get('BASE_URL') + `/andamentoTreno/${departureStation}/${trainCode}/${Date.now()}`

    const { data: data } = await axios.get(url)

    if (data === '') {
      response.status(404)
      response.send({ url, status: null })
      return { url, status: null }
    }

    const status = TrainStatus.fromJson(data)

    return {
      url,
      status,
    }
  }
}
