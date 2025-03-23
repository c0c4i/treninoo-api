import { timeToMilliseconds } from '../utils/time'
import { Station } from './Station'

class Stop {
  station: Station

  plannedDepartureTime?: number
  predictedDepartureTime?: number
  actualDepartureTime?: number

  plannedArrivalTime?: number
  predictedArrivalTime?: number
  actualArrivalTime?: number

  plannedDepartureRail: string
  actualDepartureRail: string

  plannedArrivalRail: string
  actualArrivalRail: string

  currentStation: boolean

  confirmed: boolean = false

  constructor(json: any) {
    Object.assign(this, json)
  }

  static fromJson(json: any, delay: number) {
    const suppressed = json.fermata.actualFermataType === 3

    if (suppressed) {
      return new Stop({
        station: new Station(json.id, json.stazione),
        plannedDepartureTime: null,
        predictedDepartureTime: null,
        actualDepartureTime: null,
        plannedArrivalTime: null,
        predictedArrivalTime: null,
        actualArrivalTime: null,
        plannedDepartureRail: null,
        actualDepartureRail: null,
        plannedArrivalRail: null,
        actualArrivalRail: null,
        currentStation: false,
        suppressed: suppressed,
      })
    }

    const plannedDepartureTime = json.fermata.partenza_teorica
    const plannedArrivalTime = json.fermata.arrivo_teorico

    const predictedDepartureTime = this._predictTime(plannedDepartureTime, delay, true)
    const predictedArrivalTime = this._predictTime(plannedArrivalTime, delay)

    return new Stop({
      station: new Station(json.id, json.stazione),
      plannedDepartureTime,
      predictedDepartureTime,
      actualDepartureTime: json.fermata.partenzaReale,
      plannedArrivalTime,
      predictedArrivalTime,
      actualArrivalTime: json.fermata.arrivoReale,
      plannedDepartureRail: json.fermata.binarioProgrammatoPartenzaDescrizione,
      actualDepartureRail: json.fermata.binarioEffettivoPartenzaDescrizione,
      plannedArrivalRail: json.fermata.binarioProgrammatoArrivoDescrizione,
      actualArrivalRail: json.fermata.binarioEffettivoArrivoDescrizione,
      currentStation: json.stazioneCorrente ?? false,
      suppressed: json.fermata.actualFermataType === 3,
    })
  }

  private static _predictTime(time: number, delay: number, ignoreDelay = false) {
    if (time === null) return null
    // Ignore delay if the train is not late
    if (delay <= 0 && ignoreDelay) delay = 0
    return time + delay * 60 * 1000
  }

  static fromItaloJson(json: any, delay: number, currentStation: string) {
    const plannedDepartureTime = timeToMilliseconds(json.EstimatedDepartureTime)
    const plannedArrivalTime = timeToMilliseconds(json.EstimatedArrivalTime)

    const predictedDepartureTime = this._predictTime(plannedDepartureTime!, delay, true)
    const predictedArrivalTime = this._predictTime(plannedArrivalTime!, delay)

    const platform = json.ActualArrivalPlatform

    return new Stop({
      station: new Station(json.RfiLocationCode, json.LocationDescription),
      plannedDepartureTime,
      predictedDepartureTime,
      actualDepartureTime: timeToMilliseconds(json.ActualDepartureTime),
      plannedArrivalTime,
      predictedArrivalTime,
      actualArrivalTime: timeToMilliseconds(json.ActualArrivalTime),
      plannedDepartureRail: platform,
      actualDepartureRail: platform,
      plannedArrivalRail: platform,
      actualArrivalRail: platform,
      confirmed: json.LocationCode === currentStation,
      currentStation: json.LocationCode === currentStation,
    })
  }

  static fromItaloScheduleJson(json: any) {
    const plannedDepartureTime = timeToMilliseconds(json.EstimatedDepartureTime)
    const plannedArrivalTime = timeToMilliseconds(json.EstimatedArrivalTime)

    return new Stop({
      station: new Station(json.RfiLocationCode, json.LocationDescription),
      plannedDepartureTime,
      plannedArrivalTime,
      currentStation: false,
    })
  }
}

export { Stop }
