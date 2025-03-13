// import axios from 'axios'
// import * as cheerio from 'cheerio'
// import { Station } from '../../../model/Station'
// import { StationTrain } from '../../../model/StationTrain'
// import { MAP_LOGO } from '../../../utils/logos'

// export default class RfiStationController {
//   public async autocomplete({ request, response }) {
//     const word = request.param('word')
//     const url = `https://iechub.rfi.it/ArriviPartenze/en/ArrivalsDepartures/Home`

//     const { data: data } = await axios.get(url)

//     // Load the HTML content into cheerio
//     const $ = cheerio.load(data)

//     // Extract the data from the select element
//     const selectElement = $('select#ElencoLocalita')
//     const options = selectElement.find('option')

//     // Define list of stations object
//     const stations: Station[] = []

//     // Iterate over the options and extract the values and text
//     options.each((_, element) => {
//       const value = $(element).val()?.toString() ?? ''
//       const text = $(element).text()

//       // Add the station to the list if the value or text contains the word
//       if (
//         value.toLowerCase().includes(word.toLowerCase()) ||
//         text.toLowerCase().includes(word.toLowerCase())
//       )
//         stations.push(new Station(value, text))
//     })

//     stations.sort((station1: Station, station2: Station) => station1.priority - station2.priority)

//     response.send({
//       url: url,
//       total: stations.length,
//       stations: stations,
//     })
//   }

//   public async status({ request, response }) {
//     const stationCode = request.param('stationCode')
//     const type = request.param('type')

//     if (type !== 'arrivals' && type !== 'departures') {
//       response.status(400).send({
//         error: 'The param `type` must be `arrivals` or `departures`',
//       })
//       return
//     }

//     const arrivals = type === 'arrivals'
//     const url = `https://iechub.rfi.it/ArriviPartenze/en/ArrivalsDepartures/Monitor?placeId=${stationCode}&arrivals=${arrivals}`

//     const { data: data } = await axios.get(url)

//     // Load the HTML content into cheerio
//     const $ = cheerio.load(data)

//     // Define list of stations object
//     const trains: StationTrain[] = []

//     // Extract data from the table rows
//     $('tbody#bodyTabId tr').each((_, element) => {
//       const brandImg = $(element).find('td#RVettore img')
//       const brand = brandImg.attr('alt')?.trim() // Extract brand information

//       const trainCode = $(element).find('td#RTreno').text().trim()
//       const destination = $(element).find('td#RStazione div').text().trim()
//       const time = $(element).find('td#ROrario').text().trim()
//       const delay = $(element).find('td#RRitardo').text().trim()
//       const platform = $(element).find('td#RBinario div').text().trim()

//       // Get category from logo
//       const categoryImage = $(element).find('td#RCategoria img').attr('src')
//       const category = MAP_LOGO.get(categoryImage ?? '')

//       const train = new StationTrain({
//         trainCode,
//         category,
//         departureCode: undefined,
//         stationName: destination,
//         time,
//         delay,
//         plannedPlatform: platform,
//         actualPlatform: platform,
//         isCancelled: false, // or appropriate value
//         warning: '', // or appropriate value
//       })

//       train.brand = brand

//       if (train.category === undefined) {
//         console.log(trainCode, train.category)
//       }

//       // Add the station to the list
//       trains.push(train)
//     })

//     response.send({
//       url: url,
//       total: trains.length,
//       trains,
//     })
//   }
// }
