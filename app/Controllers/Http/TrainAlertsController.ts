// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import TrainAlertValidator from 'App/Validators/TrainAlertValidator'
import Bitmap from '../../../utils/bitmap'
import Database from '@ioc:Adonis/Lucid/Database'
import TrainService from 'App/Services/TrainService'

export default class TrainAlertsController {
  private trainService = new TrainService()

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
            BETWEEN NOW() AND NOW() + INTERVAL '2 hours'
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

    if (trainToRun.rows.length === 0) {
      console.log('[TrainAlertsController] [prepareRun] No train to run')
      return null
    }

    // Fetch train details from external API to get the stations and departure times
    const departureDate = await this.trainService.getTodayDepartureDate(
      trainToRun.rows[0].train_code,
      trainToRun.rows[0].origin_station_code
    )

    if (!departureDate) {
      console.log('[TrainAlertsController] [prepareRun] No departure date found')
      return null
    }

    try {
      // 1. Create train run entry to lock the train alert for today
      await Database.rawQuery(
        `
        UPDATE train_alerts
        SET
          autocomplete_checked_date = CURRENT_DATE,
          last_autocomplete_check_at = NOW()
        WHERE
          train_code = ?
          AND origin_station_code = ?;
      `,
        [trainToRun.rows[0].train_code, trainToRun.rows[0].origin_station_code]
      )

      // 2. Create train_runs for ALL alerts
      await Database.rawQuery(
        `
        INSERT INTO train_runs (train_alert_id, departure_date, created_at)
        SELECT
          ta.id,
          ?,
          NOW()
        FROM train_alerts ta
        WHERE
          ta.train_code = ?
          AND ta.origin_station_code = ?
          AND ta.enabled = true
          AND (ta.days_of_week & (1 << ((EXTRACT(DOW FROM CURRENT_DATE)::int + 6) % 7))) > 0
          AND NOT EXISTS (
            SELECT 1
            FROM train_runs tr
            WHERE tr.train_alert_id = ta.id
              AND tr.departure_date = ?
          );
      `,
        [
          new Date(departureDate),
          trainToRun.rows[0].train_code,
          trainToRun.rows[0].origin_station_code,
          new Date(departureDate),
        ]
      )

      return {
        train_code: trainToRun.rows[0].train_code,
        origin_station_code: trainToRun.rows[0].origin_station_code,
        departure_date: new Date(departureDate),
        alerts_count: trainToRun.rows[0].alerts_count,
      }
    } catch (error) {
      // Catch error for unique constraint violation (duplicate train run)
      if (error.code === '23505') {
        console.log(
          '[TrainAlertsController] [prepareRun] Train run already exists for this train alert and departure date'
        )
        return null
      }

      console.error('[TrainAlertsController] [prepareRun] Error creating train run:', error.message)
      return null
    }
  }

  public async sendNotifications() {
    // This method will be called by a scheduled task to send notifications for the train alerts that are due
    // It will check for any train alerts that are due and send notifications to the respective devices
    // Implementation will be added in the future
  }
}
