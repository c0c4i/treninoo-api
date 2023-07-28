import { MAP_BRAND_CATEGORY } from '../utils/brands'
import { MAP_LOGO } from '../utils/logos'

class StationTrain {
  trainCode: string
  brand?: string
  category?: string
  destination?: string
  time: string
  delay: string
  platform: string
  departing: boolean

  constructor({ trainCode, category, destination, time, delay, platform, departing, brand }) {
    ;(this.trainCode = trainCode),
      (this.brand = brand),
      (this.category = this.getCategory(brand, category)),
      (this.destination = destination),
      (this.time = time),
      (this.delay = delay),
      (this.platform = platform),
      (this.departing = departing)
  }

  private getCategory(brand, category) {
    category = MAP_LOGO.get(category)
    if (category === 'AV') {
      return MAP_BRAND_CATEGORY.get(brand)
    }
    return category
  }
}

export { StationTrain }
