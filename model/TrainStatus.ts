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
      delay: json.ritardo,
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
}

export { TrainStatus }
