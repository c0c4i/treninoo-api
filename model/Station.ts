class Station {
  stationCode: string
  stationName: string
  departureDate?: number
  priority: number = 5

  constructor(stationCode: string, stationName: string, departureDate?: number) {
    ;(this.stationCode = stationCode),
      (this.stationName = stationName),
      (this.departureDate = departureDate)
  }

  static fromDeparture(line: string) {
    const stationCode = line.split('|')[1].split('-')[1]
    const stationName = line.split('|')[0].split(' - ')[1]
    const departureDate = Number(line.split('-').pop())
    return new Station(stationCode, stationName, departureDate)
  }

  static fromAutocomplete(line: string) {
    const stationCode = line.split('|')[1]
    const stationName = line.split('|')[0]
    return new Station(stationCode, stationName)
  }

  static fromLeFrecce(body) {
    const stationCode = body.id
    const stationName = body.displayName
    return new Station(stationCode, stationName)
  }

  static fromSolutions(body) {
    const stationCode = body.stationCode
    const stationName = body.stationName
    return new Station(stationCode, stationName)
  }

  static fromRedisJson(json: any) {
    return new Station(json.stationCode, json.stationName, json.departureDate)
  }
}

export { Station }
