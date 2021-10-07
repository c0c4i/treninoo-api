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

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.get('/departurestation/:id', async ({ request, response }) => {
  const id = request.param('id')
  const url = Env.get('BASE_URL') + `/cercaNumeroTrenoTrenoAutocomplete/${id}`

  const { data: data } = await axios.get(url)

  const lines = data.split('\n')
  lines.splice(lines.length - 1, 1)

  const stations: Station[] = []
  lines.forEach((line) => {
    stations.push(Station.fromDeparture(line))
  })

  response.send({
    url: url,
    total: stations.length,
    stations: stations,
  })
})

import { MAP_PRIORITY } from '../utils/priorities'

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

Route.get('/details/:departureStation/:trainCode', async ({ request, response }) => {
  const departureStation = request.param('departureStation')
  const trainCode = request.param('trainCode')
  const url = Env.get('BASE_URL') + `/andamentoTreno/${departureStation}/${trainCode}/${Date.now()}`

  const { data: data } = await axios.get(url)

  const status = TrainStatus.fromJson(data)

  response.send({
    url,
    status,
  })
})
