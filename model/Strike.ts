class Strike {
  startDate: string
  endDate: string
  description: string
  category: string
  where: string

  constructor({ startDate, endDate, description, category, where }) {
    this.startDate = startDate
    this.endDate = endDate
    this.description = description
    this.category = category
    this.where = where
  }

  static fromFeed(body) {
    return new Strike({
      startDate: body['data_inizio'].split('/').reverse().join('-'),
      endDate: body['data_fine'].split('/').reverse().join('-'),
      category: body['categoria_interessata'],
      description: body['modalità'],
      where: body['rilevanza'] === 'Nazionale' ? body['rilevanza'] : body['regione'],
    })
  }
}

export { Strike }
