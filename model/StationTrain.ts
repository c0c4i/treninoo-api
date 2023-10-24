class StationTrain {
  trainCode: string
  departureCode?: string
  category?: string
  stationName?: string
  time: string
  plannedPlatform?: string
  actualPlatform?: string
  // TEMP FIX: delay renamed to ritardo to fix JSON parse in app
  ritardo: string
  brand?: string

  constructor({
    trainCode,
    departureCode,
    category,
    stationName,
    time,
    plannedPlatform,
    actualPlatform,
    delay,
  }) {
    this.trainCode = trainCode
    this.departureCode = departureCode
    this.category = category
    this.stationName = stationName
    this.time = time
    this.plannedPlatform = plannedPlatform
    this.actualPlatform = actualPlatform
    this.ritardo = delay
  }

  static fromJson(json: any): StationTrain {
    return new StationTrain({
      trainCode: json.numeroTreno.toString(), // ok
      departureCode: json.codOrigine,
      category: json.categoriaDescrizione,
      stationName: json.origine ?? json.destinazione,
      time: json.orarioArrivo ?? json.orarioPartenza,
      plannedPlatform:
        json.binarioProgrammatoArrivoDescrizione ?? json.binarioProgrammatoPartenzaDescrizione,
      actualPlatform:
        json.binarioEffettivoArrivoDescrizione ?? json.binarioEffettivoPartenzaDescrizione,
      delay: json.ritardo,
    })
  }
}

export { StationTrain }
