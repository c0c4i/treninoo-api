class Strike {
  id: string
  startDate: string
  endDate: string
  description: string
  mode: string
  category: string
  where: string

  constructor({ id, startDate, endDate, description, mode, category, where }) {
    this.id = id
    this.startDate = startDate
    this.endDate = endDate
    this.description = description
    this.mode = mode
    this.category = category
    this.where = where
  }

  static fromFeed(body) {
    return new Strike({
      id: 1,
      startDate: body['data_inizio'],
      endDate: body['data_fine'],
      description: body.description,
      mode: body['modalità'],
      category: body['categoria_interessata'],
      where: body['provincia'],
    })
  }
}

export { Strike }
