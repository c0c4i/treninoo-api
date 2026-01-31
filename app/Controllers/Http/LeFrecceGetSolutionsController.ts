import GetSolutionValidator from 'App/Validators/GetSolutionValidator'
import axios from 'axios'
import { Solution } from '../../../model/Solution'
import { Station } from '../../../model/Station'
import { findStationByName } from '../../../utils/station'
import Database from '@ioc:Adonis/Lucid/Database'

export default class LeFrecceGetSolutionsController {
  public async index({ request, response }) {
    const payload = await request.validate(GetSolutionValidator)

    try {
      // Get two statios from database to check if they are Italo stations
      const departureStation = await Database.from('stations')
        .select('italo_station_code', 'lefrecce_name')
        .where('lefrecce_station_code', payload.departureStation)
        .first()

      const arrivalStation = await Database.from('stations')
        .select('italo_station_code', 'lefrecce_name')
        .where('lefrecce_station_code', payload.arrivalStation)
        .first()

      if (
        !departureStation ||
        !arrivalStation ||
        !departureStation.italo_station_code ||
        !arrivalStation.italo_station_code
      ) {
        throw new Error('One of the stations is not an Italo station')
      }

      const loginUrl = `https://big.ntvspa.it/BIG/v7/Rest/SessionManager.svc/Login`
      const loginPayload = JSON.stringify({
        Login: {
          Username: 'WWW_Anonymous',
          Password: 'F3hoM!n0$!ZE',
          Domain: 'WWW',
        },
        SourceSystem: 1,
      })

      const loginResponse = await axios.post(loginUrl, loginPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(loginPayload),
        },
      })

      let sessionToken = loginResponse.data['Signature']

      if (!sessionToken) {
        return response.status(500).send({
          message: 'Internal server error',
        })
      }

      const italoSolutionsUrl = `https://big.ntvspa.it/BIG/v7/Rest/BookingManager.svc/GetAvailableTrains`
      const start_time = Math.floor(new Date(payload.date).getTime())
      const end_time = start_time + 12 * 60 * 60 * 1000
      const italoPayload = JSON.stringify({
        Signature: sessionToken,
        SourceSystem: 2,
        GetAvailableTrains: {
          DepartureStation: departureStation.italo_station_code,
          ArrivalStation: arrivalStation.italo_station_code,
          IntervalStartDateTime: `/Date(${start_time}+0000)/`,
          IntervalEndDateTime: `/Date(${end_time}+0000)/`,
          AdultNumber: 1,
          ChildNumber: 0,
          InfantNumber: 0,
          SeniorNumber: 0,
          OverrideIntervalTimeRestriction: true,
          CurrencyCode: 'EUR',
          IsGuest: true,
          RoundTrip: false,
        },
      })

      const italoResponse = await axios
        .post(italoSolutionsUrl, italoPayload, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(italoPayload),
          },
        })
        .then((response) => {
          console.log(response.data)
          if (
            response.data &&
            response.data.JourneyDateMarkets &&
            response.data.JourneyDateMarkets.length > 0
          ) {
            return response.data.JourneyDateMarkets[0]
          }

          return null
        })

      if (italoResponse.Journeys === null || italoResponse.Journeys.length === 0) {
        console.log('No Italo trains found for the given criteria.')
        return null
      }

      const italoSolutions: Solution[] = []
      for (const s of italoResponse.Journeys) {
        const solution = Solution.fromItalo(
          departureStation.lefrecce_name,
          arrivalStation.lefrecce_name,
          s
        )
        if (solution === null) continue
        italoSolutions.push(solution!)
      }

      return response.send({
        total: italoSolutions.length,
        solutions: italoSolutions,
      })
    } catch (error) {
      console.error('Login failed', error)
    }

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
          noChanges: payload.noChanges ?? false,
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
