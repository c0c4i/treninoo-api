import { timeToMilliseconds } from '../utils/time'
import { getStatus, Status } from '../model/enum/Status'
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
  isCached: boolean = false

  // Costructor with Object.assign
  constructor(json: any) {
    Object.assign(this, json)
  }

  static fromJson(json: any) {
    const status = getStatus(json.provvedimento, json.tipoTreno)

    return new TrainStatus({
      trainType: this._parseCategory(json.compNumeroTreno),
      trainCode: json.numeroTreno,
      lastDetectionTime: json.oraUltimoRilevamento,
      lastDetectionStation: json.stazioneUltimoRilevamento,
      delay: json.ritardo ?? 0,
      departureStation: new Station(json.idOrigine, json.origine),
      arrivalStationName: json.destinazione,
      firstDepartureTime: json.compOrarioPartenzaZero,
      status,
      warning: status === Status.PARTIALLY_SUPPRESSED ? json.subTitle : null,
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
      if (stop.RfiLocationCode === null) continue
      const s = Stop.fromItaloJson(stop, delay, currentStationCode)
      s.confirmed = s.actualDepartureTime !== undefined
      stops.push(s)
    }

    // Add last stop from TrainSchedule.StazioniNonFerme
    for (const stop of json.TrainSchedule.StazioniNonFerme) {
      if (stop.RfiLocationCode === null) continue
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

  static fromItaloScheduleJson(json: any) {
    const stops: Stop[] = []

    for (const stop of json.Stations) {
      if (stop.RfiLocationCode === null) continue
      const s = Stop.fromItaloScheduleJson(stop)
      stops.push(s)
    }

    return new TrainStatus({
      trainType: 'Italo',
      trainCode: json.TrainNumber,
      departureStation: new Station('italo', json.DepartureStationDescription),
      arrivalStationName: json.ArrivalStationDescription,
      firstDepartureTime: json.DepartureDate,
      lastDetectionStation: '--',
      delay: 0,
      stops,
    })
  }

  static fromRedisJson(json: any) {
    const stops: Stop[] = []
    for (const stop of json.stops) {
      stops.push(new Stop(stop))
    }

    return new TrainStatus({
      trainType: json.trainType,
      trainCode: json.trainCode,
      lastDetectionTime: json.lastDetectionTime,
      lastDetectionStation: json.lastDetectionStation,
      departureStation: Station.fromRedisJson(json.departureStation),
      arrivalStationName: json.arrivalStationName,
      delay: json.delay,
      firstDepartureTime: json.firstDepartureTime,
      stops,
      isCached: true,
    })
  }
}

export { TrainStatus }
