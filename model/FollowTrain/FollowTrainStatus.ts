import { FollowTrainStop } from './FollowTrainStop'

class FollowTrainStatus {
  currentStation: string
  stops: FollowTrainStop[]

  constructor(currentStation: string, stops: FollowTrainStop[]) {
    ;(this.currentStation = currentStation), (this.stops = stops)
  }

  static fromJson(json: any) {
    const currentStation = json.stazioneUltimoRilevamento
    const stops: FollowTrainStop[] = []
    json.fermate.forEach((stop) => {
      stops.push(FollowTrainStop.fromJson(stop))
    })
    return new FollowTrainStatus(currentStation, stops)
  }

  private containCurrentStation(): boolean {
    return this.stops.some((stop) => stop.stationName == this.currentStation)
  }

  // Restituisce la stazione precedente alla `targetStation`
  private stationBeforeTarget(targetStation: string): FollowTrainStop {
    let targetStationIndex: number = this.stops.findIndex(
      (stop) => stop.stationCode == targetStation
    )

    return this.stops[targetStationIndex - 1]
  }

  // Quando arriva? Quando il nome della stazione o il campo `actualArrivalTime` sono presenti!
  isArrivedBeforeTargetStation(targetStation: string): boolean {
    let beforeTargetStation: FollowTrainStop = this.stationBeforeTarget(targetStation)
    return this.containCurrentStation() || beforeTargetStation.actualArrivalTime != null
  }

  // Quando è partito? Quando il campo `actualDepartureTime` è presente!
  isDepartedBeforeTargetStation(targetStation: string): boolean {
    let beforeTargetStation: FollowTrainStop = this.stationBeforeTarget(targetStation)
    return beforeTargetStation.actualDepartureTime != null
  }
}

export { FollowTrainStatus }
