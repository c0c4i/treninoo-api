import axios from 'axios'
import * as cheerio from 'cheerio'

export default class NewsController {
  public async index({ response }) {
    try {
      // Fetch the HTML content from the Trenitalia page
      const { data: html } = await axios.get(
        'https://www.trenitalia.com/it/informazioni/Infomobilita/notizie-infomobilita.html'
      )

      // Load the HTML into Cheerio
      const $ = cheerio.load(html)

      // Define the selector for the main news container
      const newsContainer = $('#accordionGenericInfomob')

      // Prepare the array to store news items
      const newsItems: { title: string; date: string | null; content: string }[] = []

      // Iterate over each <li> inside the container
      newsContainer.find('li').each((_, element) => {
        const title = $(element).find('a').first().text().trim() // Extract the title from the first <a> tag
        const dateText = $(element).find('div > div > div > h4').text().trim() // Extract the date
        const date = dateText ? dateText : null // Assign null if date is empty
        const content = $(element).find('div > div > div > div').html()?.trim() || '' // Extract the raw HTML content

        // Push the news item if title and content exist
        if (title && content) {
          newsItems.push({ title, date, content })
        }
      })

      // Return the scraped news items as JSON
      return response.json(newsItems)
    } catch (error) {
      console.error('Error fetching or parsing data:', error)
      return response.status(500).json({ message: 'Failed to fetch news' })
    }
  }
}
