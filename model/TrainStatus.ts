import { Stop } from './Stop'

class TrainStatus {
  trainType: string
  trainCode: string
  stops: Stop[]

  constructor(trainType: string, trainCode: string, stops: Stop[]) {
    ;(this.trainType = trainType), (this.trainCode = trainCode), (this.stops = stops)
  }

  static fromJson(json: any) {
    const trainType = json.categoria
    const trainCode = json.numeroTreno
    const stops: Stop[] = []
    for (const stop of json.fermate) {
      stops.push(Stop.fromJson(stop))
    }
    return new TrainStatus(trainType, trainCode, stops)
  }
}

export { TrainStatus }
