import { timeToMilliseconds } from '../utils/time'
import { Station } from './Station'
import { Stop } from './Stop'

class TrainStatus {
  trainType: string
  trainCode: string
  lastDetectionTime: string
  lastDetectionStation: string
  departureStation: Station
  arrivalStationName: string
  delay: number
  firstDepartureTime: string
  stops: Stop[]

  // Costructor with Object.assign
  constructor(json: any) {
    Object.assign(this, json)
  }

  static fromJson(json: any) {
    return new TrainStatus({
      trainType: this._parseCategory(json.compNumeroTreno),
      trainCode: json.numeroTreno,
      lastDetectionTime: json.oraUltimoRilevamento,
      lastDetectionStation: json.stazioneUltimoRilevamento,
      delay: json.ritardo ?? 0,
      departureStation: new Station(json.idOrigine, json.origine),
      arrivalStationName: json.destinazione,
      firstDepartureTime: json.compOrarioPartenzaZero,
    })
  }

  private static _parseCategory(category: string) {
    category = category.trim()
    const categories = category.split(' ')
    if (categories.length == 1) return category
    if (categories.length == 2) return categories[0]
    categories.pop()
    return categories.join(' ')
  }

  static fromItaloJson(json: any) {
    const lastStation =
      json.TrainSchedule.StazioniNonFerme.length > 0
        ? json.TrainSchedule.StazioniNonFerme[json.TrainSchedule.StazioniNonFerme.length - 1]
        : json.TrainSchedule.StazioniFerme[json.TrainSchedule.StazioniFerme.length - 1]

    const delay = json.TrainSchedule.Distruption.DelayAmount ?? 0

    const stops: Stop[] = []
    const currentStationCode = json.TrainSchedule.Distruption.LocationCode

    // Add first stop from TrainSchedule.StazionePartenza
    const firstStation: Stop = Stop.fromItaloJson(
      json.TrainSchedule.StazionePartenza,
      delay,
      currentStationCode
    )

    if (json.TrainSchedule.StazioniFerme.length > 0) {
      firstStation.confirmed = true
    }

    stops.push(firstStation)

    // Add passed stops from TrainSchedule.StazioniFerme
    for (const stop of json.TrainSchedule.StazioniFerme) {
      const s = Stop.fromItaloJson(stop, delay, currentStationCode)
      s.confirmed = s.actualDepartureTime !== undefined
      stops.push(s)
    }

    // Add last stop from TrainSchedule.StazioniNonFerme
    for (const stop of json.TrainSchedule.StazioniNonFerme) {
      const s = Stop.fromItaloJson(stop, delay, currentStationCode)
      stops.push(s)
    }

    return new TrainStatus({
      trainType: 'Italo',
      trainCode: json.TrainSchedule.TrainNumber,
      lastDetectionTime: timeToMilliseconds(json.LastUpdate),
      delay: parseInt(delay) ?? 0,
      departureStation: new Station(
        'italo',
        json.TrainSchedule.StazionePartenza.LocationDescription
      ),
      arrivalStationName: lastStation.LocationDescription,
      firstDepartureTime: json.TrainSchedule.DepartureDate,
      stops,
    })
  }
}

export { TrainStatus }
