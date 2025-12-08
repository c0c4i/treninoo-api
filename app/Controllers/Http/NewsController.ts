import axios from 'axios'
import * as cheerio from 'cheerio'
import { Strike } from '../../../model/Strike'
import { parseStringPromise } from 'xml2js'

export default class NewsController {
  public async index({ response }) {
    try {
      // Fetch "Notizie Infomobilità" news from the official website
      const newsInfomobilita = await this.fetchNews(
        'http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/infomobilitaRSS/false'
      )

      // Fetch "Modifiche Programmate" news from the official website
      const newsModificheProgrammate = await this.fetchNews(
        'http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno/infomobilitaRSS/true'
      )

      // Fetch strikes from the official RSS feed
      let strikes: Strike[] = []
      try {
        strikes = await this.fetchStrikes()
      } catch (error) {
        console.error('Error fetching strikes:', error)
      }

      return response.json({ newsInfomobilita, newsModificheProgrammate, strikes })
    } catch (error) {
      console.error('Error fetching or parsing data:', error)
      return response.status(500).json({ message: 'Failed to fetch news' })
    }
  }

  private async fetchNews(url: string) {
    const { data: html } = await axios.get(url)
    const $ = cheerio.load(html)
    const newsContainer = $('#accordionGenericInfomob')
    const newsItems: { title: string; date: string | null; content: string }[] = []

    newsContainer.find('li').each((_, element) => {
      const title = $(element).find('a').first().text().trim()
      const dateText = $(element).find('div > div > div > h4').text().trim()
      let date = dateText ? dateText : null
      const content = $(element).find('div > div > div > div').html()?.trim() || ''

      if (date) {
        const dateParts = date.split('.')
        const formattedDate = new Date(
          parseInt(dateParts[2], 10),
          parseInt(dateParts[1], 10) - 1,
          parseInt(dateParts[0], 10)
        ).toISOString()
        date = formattedDate
      }

      if (title && content) {
        newsItems.push({ title, date, content })
      }
    })

    return newsItems
  }

  private async fetchStrikes(): Promise<Strike[]> {
    const response = await axios.get('https://scioperi.mit.gov.it/mit2/public/scioperi/rss')
    const xml = response.data

    const parsed = await parseStringPromise(xml, {
      trim: true,
      explicitArray: false,
      mergeAttrs: true,
    })

    const items = parsed.rss.channel.item
    const strikes: Strike[] = []

    for (const item of Array.isArray(items) ? items : [items]) {
      const title = item.title
      const description = item.description
      const pubDate = new Date(item.pubDate).toISOString().slice(0, 10)

      const data = {
        pub_date: pubDate,
      }

      // Extract from title
      title.split(' - ').forEach((part) => {
        const [key, ...rest] = part.split(':')
        const value = rest.join(':').trim()
        if (key && value) {
          const k = key.toLowerCase().replace(/\s+/g, '_')
          data[k] = value
        }
      })

      // Extract from description (HTML with <br/>)
      const descParts = description
        .replace('<![CDATA[', '')
        .replace(']]>', '')
        .split(/<br\s*\/?>/i)

      for (const part of descParts) {
        const [key, ...rest] = part.split(':')
        const value = rest.join(':').trim()
        if (key && value) {
          const k = key.toLowerCase().replace(/\s+/g, '_')
          data[k] = value
        }
      }

      if (data['settore'] != 'Ferroviario') {
        if (data['modalità'].search(new RegExp('ferroviario', 'i')) == -1) {
          continue
        }
      }

      const strike = Strike.fromFeed(data)

      strikes.push(strike)
    }

    return strikes
  }
}
