import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TrainAlertValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    device_uid: schema.string(),
    train_code: schema.string(),
    origin_station_code: schema.string(),
    origin_departure_time: schema.string({}, [rules.regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/)]),
    notify_station_code: schema.string(),
    days_of_week: schema.array([rules.minLength(1)]).members(schema.number([rules.range(1, 7)])),
    notify_before_min: schema.number(),
  })

  public messages: CustomMessages = {
    'device_uid.required': 'Device UID is required',
    'train_code.required': 'Train code is required',
    'origin_station_code.required': 'Origin station is required',
    'origin_departure_time.required': 'Origin departure time is required',
    'origin_departure_time.regex': 'Invalid time format. Expected HH:mm (24-hour format)',
    'notify_station_code.required': 'Notify station is required',
    'days_of_week.required': 'At least one day of week is required',
    'days_of_week.minLength': 'At least one day of week is required',
    'days_of_week.members.range': 'Days of week must be between 1 (Monday) and 7 (Sunday)',
    'notify_before_min.required': 'Notification time before departure is required',
  }
}
