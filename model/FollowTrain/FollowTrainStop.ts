class FollowTrainStop {
  stationCode: string
  stationName: string

  actualDepartureTime: number
  actualArrivalTime: number

  constructor(
    stationCode: string,
    stationName: string,
    actualDepartureTime: number,
    actualArrivalTime: number
  ) {
    ;(this.stationCode = stationCode),
      (this.stationName = stationName),
      (this.actualDepartureTime = actualDepartureTime),
      (this.actualArrivalTime = actualArrivalTime)
  }

  static fromJson(json: any) {
    const stationCode = json.id
    const stationName = json.stazione

    const actualDepartureTime = json.partenzaReale
    const actualArrivalTime = json.arrivoReale

    return new FollowTrainStop(stationCode, stationName, actualDepartureTime, actualArrivalTime)
  }

  isTrainArrived(): boolean {
    return this.actualArrivalTime != null
  }

  isTrainDeparted(): boolean {
    return this.actualDepartureTime != null
  }
}

export { FollowTrainStop }
