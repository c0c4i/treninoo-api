class SolutionTrain {
  origin: string
  destination: string
  departureTime: Date
  arrivalTime: Date
  trainCode: string

  constructor(
    origin: string,
    destination: string,
    departureTime: Date,
    arrivalTime: Date,
    trainCode: string
  ) {
    ;(this.origin = origin),
      (this.destination = destination),
      (this.departureTime = departureTime),
      (this.arrivalTime = arrivalTime),
      (this.trainCode = trainCode)
  }

  static fromLeFrecce(body) {
    const origin = body.origin
    const destination = body.destination
    const departureTime = new Date(body.departureTime)
    const arrivalTime = new Date(body.arrivalTime)
    const trainCode = body.train.description
    return new SolutionTrain(origin, destination, departureTime, arrivalTime, trainCode)
  }
}

export { SolutionTrain }
