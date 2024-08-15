import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
// import { TrainStatus } from '../../../model/TrainStatus'
import { TrainStatus } from '../../../model/TrainStatus'

export default class ItalosController {
  public async details({ request, response }) {
    const trainCode = request.param('trainCode')

    const url = Env.get('ITALO_BASE_URL') + `/RicercaTrenoService`

    try {
      // ?&TrainNumber=1233
      const { data: data } = await axios.get(url, { params: { TrainNumber: trainCode } })

      // If the train is not found, send 404 response
      // Or fermate field is an empty array
      if (data['IsEmpty']) {
        return response.status(404).send({
          url: url,
          status: null,
        })
      }

      const status = TrainStatus.fromItaloJson(data)

      // Remove arrival time from first stop
      status.stops[0].plannedArrivalTime = undefined
      status.stops[0].predictedArrivalTime = undefined
      status.stops[0].actualArrivalTime = undefined

      // Remove departure time from last stop
      status.stops[status.stops.length - 1].plannedDepartureTime = undefined
      status.stops[status.stops.length - 1].predictedDepartureTime = undefined
      status.stops[status.stops.length - 1].actualDepartureTime = undefined

      // Remove actual arrival time from stops not confirmed
      for (const stop of status.stops) {
        if (!stop.confirmed) stop.actualArrivalTime = undefined
      }

      response.send({
        url: url,
        status,
      })
    } catch (error) {
      console.log(error)
      response.status(500).send({
        url: url,
      })
    }
  }
}
