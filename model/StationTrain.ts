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
  isCancelled: boolean
  warning?: string

  constructor({
    trainCode,
    departureCode,
    category,
    stationName,
    time,
    plannedPlatform,
    actualPlatform,
    delay,
    isCancelled,
    warning,
  }) {
    this.trainCode = trainCode
    this.departureCode = departureCode
    this.category = category
    this.stationName = stationName
    this.time = time
    this.plannedPlatform = plannedPlatform
    this.actualPlatform = actualPlatform
    this.ritardo = delay
    this.isCancelled = isCancelled ?? false
    this.warning = warning
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
      isCancelled: json.provvedimento === 1,
      warning: json.subTitle,
    })
  }
}

export { StationTrain }
