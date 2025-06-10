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
}

export { Solution }
