import { Station } from './Station'
import { SolutionTrainDTO } from '../contracts/adapter'

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

  static fromLeFrecce(body: any) {
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

  static fromAdapter(dto: SolutionTrainDTO) {
    const originStation = dto.originStation ? Station.fromAdapter(dto.originStation) : undefined
    const destinationStation = dto.destinationStation
      ? Station.fromAdapter(dto.destinationStation)
      : undefined

    return new SolutionTrain(
      dto.origin,
      dto.destination,
      dto.departureTime,
      dto.arrivalTime,
      dto.trainCode,
      dto.category ?? '',
      originStation,
      destinationStation
    )
  }
}

export { SolutionTrain }
