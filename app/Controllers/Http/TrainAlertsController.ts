// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import TrainAlertValidator from 'App/Validators/TrainAlertValidator'
import Bitmap from '../../../utils/bitmap'
import Database from '@ioc:Adonis/Lucid/Database'

export default class TrainAlertsController {
  public async create({ request, response }) {
    const payload = await request.validate(TrainAlertValidator)

    try {
      const device = await Database.query()
        .from('devices')
        .where('device_uid', payload.device_uid)
        .first()

      if (!device) {
        return response.status(404).send({
          success: false,
          error: 'Device not registered',
        })
      }

      await Database.rawQuery(
        `
        INSERT INTO train_alerts (device_id, train_code, origin_station_code, notify_station_code, origin_departure_time, days_of_week, notify_before_min)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [
          device.id,
          payload.train_code,
          payload.origin_station_code,
          payload.notify_station_code,
          payload.origin_departure_time,
          Bitmap.fromArray(payload.days_of_week),
          payload.notify_before_min,
        ]
      )
    } catch (error) {
      // Catch error for unique constraint violation (duplicate alert)
      if (error.code === '23505') {
        return response.status(400).send({
          success: false,
          error: 'Train alert already exists for this device, train and notify station',
        })
      }

      return response.status(500).send({
        success: false,
        error: error.message,
      })
    }

    response.status(201).send({
      success: true,
      message: 'Train alert created successfully',
    })
  }

  // This method will be called by a scheduled task to prepare the train alerts that start next and need to be notified today
  public async prepareRun() {
    // Get train to prepare for notification
    const trainToRunQuery = `
      SELECT
        ta.train_code,
        ta.origin_station_code,
        COUNT(*) AS alerts_count
      FROM train_alerts ta
      LEFT JOIN train_runs tr
        ON tr.train_alert_id = ta.id
        AND tr.departure_date = CURRENT_DATE
      WHERE
        ta.enabled = true
        AND (ta.days_of_week & (1 << ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7))) > 0
        AND tr.train_alert_id IS NULL
        AND (
          ta.autocomplete_checked_date IS NULL
          OR ta.autocomplete_checked_date < CURRENT_DATE
        )
        AND (
          ta.origin_departure_time IS NULL
          OR (
            (CURRENT_DATE + ta.origin_departure_time)
            BETWEEN NOW() AND NOW() + INTERVAL '1 hours'
          )
        )
      GROUP BY
        ta.train_code,
        ta.origin_station_code
      ORDER BY
        MIN(ta.origin_departure_time) ASC NULLS LAST
      LIMIT 1;
    `

    const trainToRun = await Database.rawQuery(trainToRunQuery)

    return trainToRun.rows

    if (trainToRun.rows.length === 0) return

    return trainToRun.rows[0]
  }

  public async sendNotifications() {
    // This method will be called by a scheduled task to send notifications for the train alerts that are due
    // It will check for any train alerts that are due and send notifications to the respective devices
    // Implementation will be added in the future
  }
}
