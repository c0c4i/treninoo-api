import GetSolutionValidator from 'App/Validators/GetSolutionValidator'
import axios from 'axios'
import { Solution } from '../../../model/Solution'
import { Station } from '../../../model/Station'
import { findStationByName } from '../../../utils/station'

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

      const stationsMap = new Map<string, Station>()
      for (const solution of data.solutions) {
        for (const node of solution.solution.nodes) {
          if (!stationsMap.has(node.origin)) {
            const origin = await findStationByName(node.origin)
            if (origin) stationsMap.set(node.origin, origin!)
          }

          if (!stationsMap.has(node.destination)) {
            const destination = await findStationByName(node.destination)
            if (destination) stationsMap.set(node.destination, destination!)
          }

          node.originStation = stationsMap.get(node.origin)
          node.destinationStation = stationsMap.get(node.destination)
        }

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
