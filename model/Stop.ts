import { Station } from './Station'

class Stop {
  station: Station

  plannedDepartureTime: number
  predictedDepartureTime: number
  actualDepartureTime: number

  plannedArrivalTime: number
  predictedArrivalTime: number
  actualArrivalTime: number

  plannedDepartureRail: string
  actualDepartureRail: string

  plannedArrivalRail: string
  actualArrivalRail: string

  currentStation: boolean
  delay: string

  confirmed: boolean = false

  constructor(json: any) {
    Object.assign(this, json)
  }

  static fromJson(json: any) {
    const delay = json.ritardo

    const plannedDepartureTime = json.fermata.partenza_teorica
    const plannedArrivalTime = json.fermata.arrivo_teorico

    const predictedDepartureTime = this._predictTime(plannedDepartureTime, delay)
    const predictedArrivalTime = this._predictTime(plannedArrivalTime, delay)

    return new Stop({
      station: new Station(json.id, json.stazione),
      plannedDepartureTime: json.fermata.partenza_teorica,
      predictedDepartureTime,
      actualDepartureTime: json.fermata.partenzaReale,
      plannedArrivalTime: json.fermata.arrivo_teorico,
      predictedArrivalTime,
      actualArrivalTime: json.fermata.arrivoReale,
      plannedDepartureRail: json.fermata.binarioProgrammatoPartenzaDescrizione,
      actualDepartureRail: json.fermata.binarioEffettivoPartenzaDescrizione,
      plannedArrivalRail: json.fermata.binarioProgrammatoArrivoDescrizione,
      actualArrivalRail: json.fermata.binarioEffettivoArrivoDescrizione,
      currentStation: json.stazioneCorrente ?? false,
      delay: json.ritardo,
    })
  }

  private static _predictTime(time: number, delay: string) {
    return time + Number(delay) * 60 * 1000
  }
}

export { Stop }
