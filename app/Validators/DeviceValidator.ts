import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DeviceValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    device_uid: schema.string(),
    fcm_token: schema.string(),
    platform: schema.enum(['android', 'ios'] as const),
    app_version: schema.string(),
  })

  public messages: CustomMessages = {
    'device_uid.required': 'Device UID is required',
    'fcm_token.required': 'FCM token is required',
    'platform.required': 'Platform is required',
    'platform.enum': 'Platform must be either android or ios',
    'app_version.required': 'App version is required',
  }
}
