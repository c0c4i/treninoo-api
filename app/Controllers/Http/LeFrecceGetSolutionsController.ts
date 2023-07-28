import GetSolutionValidator from 'App/Validators/GetSolutionValidator'
import axios from 'axios'
import { Solution } from '../../../model/Solution'

export default class LeFrecceGetSolutionsController {
  public async index({ request, response }) {
    const payload = await request.validate(GetSolutionValidator)
    payload.date = new Date(payload.date)

    // Add timrzone offset
    payload.date.setHours(payload.date.getHours() + 2)

    const url = `https://www.lefrecce.it/Channels.Website.BFF.WEB/website/ticket/solutions`

    const { data: data } = await axios.post(url, {
      departureLocationId: payload.departureStation,
      arrivalLocationId: payload.arrivalStation,
      departureTime: payload.date.toISOString(),
      adults: 1,
      children: 0,
      criteria: {
        frecceOnly: false,
        regionalOnly: false,
        intercityOnly: false,
        noChanges: false,
        order: 'DEPARTURE_DATE',
        offset: 0,
        limit: 20,
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
  }
}
