class SolutionTrain {
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  trainCode: string
  category?: string

  constructor(
    origin: string,
    destination: string,
    departureTime: string,
    arrivalTime: string,
    trainCode: string,
    category: string
  ) {
    ;(this.origin = origin),
      (this.destination = destination),
      (this.departureTime = departureTime),
      (this.arrivalTime = arrivalTime),
      (this.trainCode = trainCode),
      (this.category = category)
  }

  static fromLeFrecce(body) {
    const origin = body.origin
    const destination = body.destination
    const departureTime = body.departureTime.slice(0, -6)
    const arrivalTime = body.arrivalTime.slice(0, -6)
    const trainCode = body.train.name
    const category = body.train.acronym
    return new SolutionTrain(origin, destination, departureTime, arrivalTime, trainCode, category)
  }
}

export { SolutionTrain }
