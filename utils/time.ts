export { timeToMilliseconds }


function timeToMilliseconds(time: string) {
  const [hours, minutes] = time.split(':')

  const date = new Date()
  date.setHours(parseInt(hours))
  date.setMinutes(parseInt(minutes))
  date.setSeconds(0)
  date.setMilliseconds(0)

  return date.getTime()
}
