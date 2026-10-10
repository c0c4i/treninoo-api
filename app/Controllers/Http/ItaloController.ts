import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
// import { TrainStatus } from '../../../model/TrainStatus'
import { TrainStatus } from '../../../model/TrainStatus'
import Redis from '@ioc:Adonis/Addons/Redis'
import Logger from '@ioc:Adonis/Core/Logger'

export default class ItalosController {
  public async details({ request, response }) {
    const trainCode = request.param('trainCode')

    const url = Env.get('ITALO_BASE_URL') + `/RicercaTrenoService`
    const start = Date.now()

    try {
      // ?&TrainNumber=1233
      const { data: data } = await axios.get(url, {
        params: { TrainNumber: trainCode },
        timeout: 2000,
      })
      Logger.info({ ms: Date.now() - start, trainCode }, 'italo upstream')

      // If the train is not found, send 404 response
      // Or fermate field is an empty array
      if (data['IsEmpty']) {
        // Check if there is cache for this train
        const cached = await Redis.get(`italo:train:${trainCode}`)

        if (!cached) {
          return response.status(404).send({
            url: url,
            status: null,
          })
        }

        const status = TrainStatus.fromRedisJson(JSON.parse(cached))
        return response.send({
          url: url,
          status,
        })
      }

      const status = TrainStatus.fromItaloJson(data)

      // Remove actual arrival time from stops not confirmed
      for (const stop of status.stops) {
        if (!stop.confirmed) stop.actualArrivalTime = undefined
      }

      response.send({
        url: url,
        status,
      })
    } catch (error) {
      Logger.error(
        { ms: Date.now() - start, trainCode, err: error.message },
        'italo upstream failed'
      )
      response.status(500).send({
        url: url,
      })
    }
  }

  // Method to cache moving Italo trains
  public async refreshCurrentTrains({ response }) {
    // Get current moving trains
    const url = Env.get('ITALO_BASE_URL') + `/TreniInCircolazioneService`
    const { data } = await axios.get(url)

    // If there are no trains moving, skip the cache refresh
    if (data['IsEmpty']) return response.status(204).send()

    for (const train of data['TrainSchedules']) {
      try {
        const status = TrainStatus.fromItaloScheduleJson(train)
        await Redis.set(
          `italo:train:${status.trainCode}`,
          JSON.stringify(status),
          'EX',
          60 * 60 * 24 * 7 // 1 week
        )
      } catch (error) {
        console.log(error)
        continue
      }
    }

    response.send({
      url: url,
      success: true,
    })
  }
}
