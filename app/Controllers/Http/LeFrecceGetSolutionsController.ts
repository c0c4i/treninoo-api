import GetSolutionValidator from 'App/Validators/GetSolutionValidator'
import axios from 'axios'
import { Solution } from '../../../model/Solution'

export default class LeFrecceGetSolutionsController {
  public async index({ request, response }) {
    const payload = await request.validate(GetSolutionValidator)

    const url = `https://www.lefrecce.it/Channels.Website.BFF.WEB/website/ticket/solutions`

    try {
      const { data: data } = await axios.post(url, {
        departureLocationId: payload.departureStation,
        arrivalLocationId: payload.arrivalStation,
        departureTime: payload.date.toString().slice(0, -6),
        adults: 1,
        children: 0,
        criteria: {
          frecceOnly: payload.onlyFrecce ?? false,
          regionalOnly: payload.onlyRegional ?? false,
          intercityOnly: payload.onlyIntercity ?? false,
          noChanges: false,
          order: 'DEPARTURE_DATE',
          offset: payload.offset ?? 0,
          limit: 10,
        },
        advancedSearchRequest: {
          bestFare: false,
          bikeFilter: false,
        },
      })

      const solutions: Solution[] = []

      for (const solution of data.solutions) {
        solutions.push(Solution.fromLeFrecce(solution))
      }

      response.send({
        total: solutions.length,
        solutions,
      })
    } catch (error) {
      if (error.response.status === 400) {
        return response.send({
          total: 0,
          solutions: [],
        })
      }

      response.status(500).send({
        message: 'Internal server error',
      })
    }
  }
}
