export default class Bitmap {
  public static toArray(bitmap: number): number[] {
    const days: number[] = []

    for (let day = 1; day <= 7; day += 1) {
      if ((bitmap & (1 << (day - 1))) !== 0) {
        days.push(day)
      }
    }

    return days
  }

  public static fromArray(days: number[]): number {
    return days.reduce((accumulator, day) => accumulator | (1 << (day - 1)), 0)
  }
}
