import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
import { Station } from '../../../model/Station'
import { checkItaloTrainCode } from '../../../utils/italo'

export default class DepartureStationController {
  public async find({ request, response }) {
    const id = request.param('id')
    const url = Env.get('BASE_URL') + `/cercaNumeroTrenoTrenoAutocomplete/${id}`

    const { data: data } = await axios.get(url)

    const lines = data.split('\n')
    lines.splice(lines.length - 1, 1)

    const stations: Station[] = []
    lines.forEach((line) => {
      stations.push(Station.fromDeparture(line))
    })

    const italo_train_number = stations.length === 0 ? await checkItaloTrainCode(id) : false

    response.send({
      url: url,
      total: stations.length,
      italo_train_number,
      stations: stations,
    })
  }
}
