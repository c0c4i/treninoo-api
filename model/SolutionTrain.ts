import { Station } from './Station'

class SolutionTrain {
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  trainCode: string
  category?: string
  originStation?: Station
  destinationStation?: Station

  constructor(
    origin: string,
    destination: string,
    departureTime: string,
    arrivalTime: string,
    trainCode: string,
    category: string,
    originStation?: Station,
    destinationStation?: Station
  ) {
    ;(this.origin = origin),
      (this.destination = destination),
      (this.departureTime = departureTime),
      (this.arrivalTime = arrivalTime),
      (this.trainCode = trainCode),
      (this.category = category),
      (this.originStation = originStation),
      (this.destinationStation = destinationStation)
  }

  static fromLeFrecce(body) {
    const origin = body.origin
    const destination = body.destination
    const departureTime = body.departureTime.slice(0, -6)
    const arrivalTime = body.arrivalTime.slice(0, -6)
    const trainCode = body.train.name
    const category = body.train.acronym

    let originStation
    if (body.originStation !== undefined) {
      originStation = Station.fromSolutions(body.originStation)
    }

    let destinationStation
    if (body.destinationStation !== undefined) {
      destinationStation = Station.fromSolutions(body.destinationStation)
    }

    return new SolutionTrain(
      origin,
      destination,
      departureTime,
      arrivalTime,
      trainCode,
      category,
      originStation,
      destinationStation
    )
  }
}

export { SolutionTrain }
