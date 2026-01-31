import { SolutionTrain } from './SolutionTrain'

class Solution {
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  trains: SolutionTrain[]
  price?: number

  constructor(
    origin: string,
    destination: string,
    departureTime: string,
    arrivalTime: string,
    trains: SolutionTrain[],
    price?: number
  ) {
    ;(this.origin = origin),
      (this.destination = destination),
      (this.departureTime = departureTime),
      (this.arrivalTime = arrivalTime),
      (this.trains = trains),
      (this.price = price)
  }

  static fromLeFrecce(body) {
    body = body.solution
    const origin = body.origin
    const destination = body.destination
    const departureTime = body.departureTime.slice(0, -6)
    const arrivalTime = body.arrivalTime.slice(0, -6)
    const trains = body.nodes.map((train) => SolutionTrain.fromLeFrecce(train))
    const price = body.price ? body.price.amount : undefined
    return new Solution(origin, destination, departureTime, arrivalTime, trains, price)
  }

  static fromItalo(departureStation, arrivalStation, body) {
    if (body.Segments.length === 0) return null
    if (body.Segments.length > 1) {
      console.warn(
        '[Italo] Multiple segments found in Italo solution, only the first one will be processed.'
      )
    }

    const rawTrain = body.Segments[0]

    const trainCode = rawTrain.TrainNumber

    const departureDate = new Date(parseInt(rawTrain.STD.match(/\/Date\((\d+)(?:[+-]\d+)?\)\//)[1]))
    const arrivalDate = new Date(parseInt(rawTrain.STA.match(/\/Date\((\d+)(?:[+-]\d+)?\)\//)[1]))

    return new Solution(
      departureStation,
      arrivalStation,
      departureDate.toISOString(),
      arrivalDate.toISOString(),
      [
        new SolutionTrain(
          departureStation,
          arrivalStation,
          departureDate.toISOString(),
          arrivalDate.toISOString(),
          trainCode,
          'Italo'
        ),
      ]
    )
  }
}

export { Solution }
