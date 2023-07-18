import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
import { TrainStatus } from '../../../model/TrainStatus'

export default class TrainStatusController {
  public async show({ request, response }) {
    const departureStation = request.param('departureStation')
    const trainCode = request.param('trainCode')
    const url =
      Env.get('BASE_URL') + `/andamentoTreno/${departureStation}/${trainCode}/${Date.now()}`

    const { data: data } = await axios.get(url)
    const status = TrainStatus.fromJson(data)

    response.send({
      url,
      status,
    })
  }
}
