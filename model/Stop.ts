class Stop {
  stationCode: string
  stationName: string

  plannedDepartureTime: number
  actualDepartureTime: number

  plannedArrivalTime: number
  actualArrivalTime: number

  plannedDepartureRail: string
  actualDepartureRail: string

  plannedArrivalRail: string
  actualArrivalRail: string

  delay: string

  constructor(
    stationCode: string,
    stationName: string,
    plannedDepartureTime: number,
    actualDepartureTime: number,
    plannedArrivalTime: number,
    actualArrivalTime: number,
    plannedDepartureRail: string,
    actualDepartureRail: string,
    plannedArrivalRail: string,
    actualArrivalRail: string,
    delay: string
  ) {
    ;(this.stationCode = stationCode),
      (this.stationName = stationName),
      (this.plannedDepartureTime = plannedDepartureTime),
      (this.actualDepartureTime = actualDepartureTime),
      (this.plannedArrivalTime = plannedArrivalTime),
      (this.actualArrivalTime = actualArrivalTime),
      (this.plannedDepartureRail = plannedDepartureRail),
      (this.actualDepartureRail = actualDepartureRail),
      (this.plannedArrivalRail = plannedArrivalRail),
      (this.actualArrivalRail = actualArrivalRail),
      (this.delay = delay)
  }

  static fromJson(json: any) {
    const stationCode = json.id
    const stationName = json.stazione

    const plannedDepartureTime = json.partenza_teorica
    const actualDepartureTime = json.partenzaReale

    const plannedArrivalTime = json.arrivo_teorico
    const actualArrivalTime = json.arrivoReale

    const plannedDepartureRail = json.binarioProgrammatoPartenzaDescrizione
    const actualDepartureRail = json.binarioEffettivoPartenzaDescrizione

    const plannedArrivalRail = json.binarioProgrammatoArrivoDescrizione
    const actualArrivalRail = json.binarioEffettivoArrivoDescrizione

    const delay = json.ritardo

    return new Stop(
      stationCode,
      stationName,
      plannedDepartureTime,
      actualDepartureTime,
      plannedArrivalTime,
      actualArrivalTime,
      plannedDepartureRail,
      actualDepartureRail,
      plannedArrivalRail,
      actualArrivalRail,
      delay
    )
  }
}

export { Stop }
