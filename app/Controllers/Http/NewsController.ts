import axios from 'axios'
import * as cheerio from 'cheerio'

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

      return response.json({ newsInfomobilita, newsModificheProgrammate })
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
}
