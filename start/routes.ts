/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

const axios = require('axios')

import Route from '@ioc:Adonis/Core/Route'
import { TrainStatus } from '../model/TrainStatus'
import { Station } from '../model/Station'
import Env from '@ioc:Adonis/Core/Env'
import NewFollowTrainValidator from 'App/Validators/NewFollowTrainValidator'
import FollowTrain from 'App/Models/FollowTrain'
import Train from 'App/Models/Train'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/departurestation/:id', 'DepartureStationsController.index')

Route.get('/autocomplete/:word', async ({ request, response }) => {
  const id = request.param('word')
  const url = Env.get('BASE_URL') + `/autocompletaStazione/${id}`

  const { data: data } = await axios.get(url)

  const lines = data.split('\n')
  response.send(lines)
  lines.splice(lines.length - 1, 1)

  const stations: Station[] = []
  lines.forEach((line) => {
    stations.push(Station.fromAutocomplete(line))
  })

  stations.sort((station1: Station, station2: Station) => station1.priority - station2.priority)

  response.send({
    url: url,
    total: stations.length,
    stations: stations,
  })
})

Route.get('/details/:departureStation/:trainCode', 'TrainStatusController.index')

Route.post('/followtrain', async ({ request, response }) => {
  const payload = await request.validate(NewFollowTrainValidator)

  const followTrain = new FollowTrain()
  await followTrain.fill({ ...payload }).save()

  response.send({
    success: true,
    payload,
  })
})

Route.delete(
  '/followtrain/:deviceToken/:trainCode/:departureStation',
  async ({ params, response }) => {
    const followTrain = new FollowTrain().fill({ ...params })
    await followTrain.delete()

    response.send({
      success: true,
    })
  }
)

Route.get(
  '/followtrain/:deviceToken/:trainCode/:departureStation',
  async ({ params, response }) => {
    const followTrain = new FollowTrain().fill({ ...params })
    var finded = await FollowTrain.query()
      .where('trainCode', followTrain.trainCode)
      .where('departureStation', followTrain.departureStation)
      .where('deviceToken', followTrain.deviceToken)
      .first()

    response.send({
      success: finded !== null,
      payload: finded,
    })
  }
)

Route.get('/followtrain/:departureStation/:trainCode', async ({ params, response }) => {
  const departureStation = params.departureStation
  const trainCode = params.trainCode
  const url = Env.get('BASE_URL') + `/andamentoTreno/${departureStation}/${trainCode}/${Date.now()}`

  const { data: data } = await axios.get(url)

  const stops = TrainStatus.fromJson(data).stops

  let lastDeparture: number = 0
  stops.forEach((stop, index) => {
    if (stop.actualDepartureTime !== null) lastDeparture = index + 1
  })

  let stations: Station[] = []
  if (lastDeparture < stops.length - 1) {
    for (let i = lastDeparture + 1; i < stops.length; i++) {
      let station: Station = new Station(stops[i].stationCode, stops[i].stationName)
      stations.push(station)
    }
  }

  response.send({
    url,
    stations,
  })
})

Route.get('/yes', async ({ response }) => {
  response.send({
    okay: 'lesgo',
  })
})

// Route.get('/trains', async ({ request, response }) => {
//   const someController = new DepartureStationsController()

//   for (let i = 40000; i < 100000; i++) {
//     const result = await someController.index({ request }, i)
//     console.log({ tainCode: i, found: result.total })
//     for (let j = 0; j < result.total; j++) {
//       const element = result.stations[j]

//       const train = new Train()
//       try {
//         await train
//           .fill({
//             trainCode: i,
//             departureStation: element.stationCode,
//           })
//           .save()
//       } catch (e) {
//         console.log({ tainCode: i, found: result.total, error: true, e })
//       }
//     }
//   }

//   response.send({ ok: 'lesgooo' })
// })

Route.get('/statistics', 'GetStatisticsController.index')
