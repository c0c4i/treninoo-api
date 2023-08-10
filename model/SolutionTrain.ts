class SolutionTrain {
  origin: string
  destination: string
  departureTime: Date
  arrivalTime: Date
  trainCode: string
  category?: string

  constructor(
    origin: string,
    destination: string,
    departureTime: Date,
    arrivalTime: Date,
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
    const departureTime = new Date(body.departureTime)
    const arrivalTime = new Date(body.arrivalTime)
    const trainCode = body.train.description
    const category = body.train.acronym
    return new SolutionTrain(origin, destination, departureTime, arrivalTime, trainCode, category)
  }
}

export { SolutionTrain }
