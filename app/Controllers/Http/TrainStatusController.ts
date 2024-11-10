import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'
import { TrainStatus } from '../../../model/TrainStatus'
import { Stop } from '../../../model/Stop'

export default class TrainStatusController {
  public async show({ request, response }) {
    const departureStation = request.param('departureStation')
    const trainCode = request.param('trainCode')
    const departureDate = request.param('departureDate') || Date.now()

    const urlStatus =
      Env.get('BASE_URL') + `/andamentoTreno/${departureStation}/${trainCode}/${departureDate}`

    const urlStops =
      Env.get('BASE_URL') + `/tratteCanvas/${departureStation}/${trainCode}/${departureDate}`

    try {
      const { data: data } = await axios.get(urlStatus)

      // If the train is not found, send 404 response
      // Or fermate field is an empty array
      if (data === '' || data.fermate.length === 0) {
        return response.status(404).send({
          url: urlStatus,
          status: null,
        })
      }

      const { data: dataStops } = await axios.get(urlStops)

      if (dataStops === '') {
        return response.status(404).send({
          url: urlStops,
          status: null,
        })
      }

      const status = TrainStatus.fromJson(data)

      // If departureStation != status.departureStation.stationCode
      // Force stationCode to be the param value
      if (departureStation !== status.departureStation.stationCode) {
        status.departureStation.stationCode = departureStation
      }

      const stops = dataStops.map((stop) => Stop.fromJson(stop, status.delay))

      // Get current station index from stops array
      const currentStationIndex = stops.findIndex((stop) => stop.currentStation)

      // Set confirmed true for all stops before current station
      for (let i = 0; i < currentStationIndex; i++) {
        stops[i].confirmed = true
      }

      // Set confirmed to current station if lastDetectionStation is equal to current station or have an actualDepartureTime
      stops[currentStationIndex].confirmed =
        status.lastDetectionStation === stops[currentStationIndex].station.stationName ||
        stops[currentStationIndex].actualDepartureTime !== null

      status.stops = stops

      response.send({
        url: urlStatus,
        url2: urlStops,
        status,
      })
    } catch (error) {
      console.log(error)
      response.status(500).send({
        url: urlStatus,
        url2: urlStops,
      })
    }
  }
}
