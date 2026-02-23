// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from '@ioc:Adonis/Lucid/Database'
import DeviceValidator from 'App/Validators/DeviceValidator'

export default class DevicesController {
  public async register({ request, response }) {
    const payload = await request.validate(DeviceValidator)

    try {
      await Database.rawQuery(
        `
        INSERT INTO devices (device_uid, fcm_token, platform, app_version, updated_at)
        VALUES (?, ?, ?, ?, NOW())
        ON CONFLICT (device_uid) DO UPDATE SET
          fcm_token = EXCLUDED.fcm_token,
          platform = EXCLUDED.platform,
          app_version = EXCLUDED.app_version,
          updated_at = NOW()
      `,
        [payload.device_uid, payload.fcm_token, payload.platform, payload.app_version]
      )
    } catch (error) {
      return response.status(500).send({
        success: false,
        error: error.message,
      })
    }

    response.status(201).send({
      success: true,
      message: 'Device registered successfully',
    })
  }
}
