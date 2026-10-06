import { SolutionTrain } from './SolutionTrain'
import type { SolutionDTO } from '../contracts/adapter'

class Solution {
  origin: string | undefined
  destination: string | undefined
  departureTime: string
  arrivalTime: string
  trains: SolutionTrain[]
  price?: number
  saleable: boolean

  constructor(
    origin: string | undefined,
    destination: string | undefined,
    departureTime: string,
    arrivalTime: string,
    trains: SolutionTrain[],
    price?: number,
    saleable: boolean = false
  ) {
    ;(this.origin = origin),
      (this.destination = destination),
      (this.departureTime = departureTime),
      (this.arrivalTime = arrivalTime),
      (this.trains = trains),
      (this.price = price),
      (this.saleable = saleable)
  }

  static fromAdapter(dto: SolutionDTO) {
    const trains = dto.trains.map((t) => SolutionTrain.fromAdapter(t))
    return new Solution(
      dto.origin,
      dto.destination,
      dto.departureTime,
      dto.arrivalTime,
      trains,
      dto.price,
      dto.saleable ?? false
    )
  }

  static fromLeFrecce(body: any) {
    body = body.solution
    // const origin = body.origin
    // const destination = body.destination
    const departureTime = body.departureTime.slice(0, -6)
    const arrivalTime = body.arrivalTime.slice(0, -6)
    const trains = body.nodes.map((train: any) => SolutionTrain.fromLeFrecce(train))
    const price = body.price ? body.price.amount : undefined
    return new Solution(undefined, undefined, departureTime, arrivalTime, trains, price)
  }
}

export { Solution }
