// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Statistic from 'App/Models/Statistic'
import Train from 'App/Models/Train'
import TrainStatusController from './TrainStatusController'

export default class GetStatisticsController {
  public async index({ request, response }) {
    const date = new Date()

    const controller = new TrainStatusController()

    for (const train of await Train.all()) {
      console.log({ trainCode: train.trainCode, departureStation: train.departureStation })
      try {
        const result = await controller.index({ request, response }, train)
        if (result.status === null) continue
        for (const stop of result.status.stops) {
          if (stop.actualDepartureTime === null && stop.actualArrivalTime === null) continue

          var arrivalDelay
          if (stop.actualArrivalTime !== null && stop.plannedArrivalTime !== null) {
            arrivalDelay = (stop.actualArrivalTime - stop.plannedArrivalTime) / 1000
          }

          var departureDelay
          if (stop.actualDepartureTime !== null && stop.plannedDepartureTime !== null) {
            departureDelay = (stop.actualDepartureTime - stop.plannedDepartureTime) / 1000
          }

          const statistic = new Statistic()
          try {
            await statistic
              .fill({
                date,
                trainCode: train.trainCode,
                departureStation: train.departureStation,
                stationCode: stop.stationCode,
                arrivalDelay,
                departureDelay,
              })
              .save()
          } catch (e) {
            console.log({ e })
          }
        }
      } catch (e) {
        console.log(e)
      }
    }

    response.send({ done: true })
  }
}
