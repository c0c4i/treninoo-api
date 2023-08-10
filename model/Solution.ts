import { SolutionTrain } from './SolutionTrain'

class Solution {
  origin: string
  destination: string
  departureTime: Date
  arrivalTime: Date
  trains: SolutionTrain[]

  constructor(
    origin: string,
    destination: string,
    departureTime: Date,
    arrivalTime: Date,
    trains: SolutionTrain[]
  ) {
    ;(this.origin = origin),
      (this.destination = destination),
      (this.departureTime = departureTime),
      (this.arrivalTime = arrivalTime),
      (this.trains = trains)
  }

  static fromLeFrecce(body) {
    body = body.solution
    const origin = body.origin
    const destination = body.destination
    const departureTime = new Date(body.departureTime)
    const arrivalTime = new Date(body.arrivalTime)
    const trains = body.nodes.map((train) => SolutionTrain.fromLeFrecce(train))
    return new Solution(origin, destination, departureTime, arrivalTime, trains)
  }
}

export { Solution }
