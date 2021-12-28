import { BaseTask } from 'adonis5-scheduler/build'
import Env from '@ioc:Adonis/Core/Env'
import FollowTrain from 'App/Models/FollowTrain'
import { FollowTrainStatus } from '../../model/FollowTrain/FollowTrainStatus'

const axios = require('axios')

export default class CheckFollowTrain extends BaseTask {
  public static get schedule() {
    return '0/30 * * * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    console.log('Checking FollowTrain!')

    const followTrains = await FollowTrain.all()
    followTrains.map(async (followTrain) => {
      const url =
        Env.get('BASE_URL') +
        `/andamentoTreno/${followTrain.departureStation}/${followTrain.trainCode}/${Date.now()}`
      const { data: data } = await axios.get(url)

      const followTrainStatus = FollowTrainStatus.fromJson(data)

      // Se deve ancora inviare la notifica di arrivo controlla!
      if (
        !followTrain.arrivedNotification &&
        followTrainStatus.isArrivedBeforeTargetStation(followTrain.stationCode)
      ) {
        // Invio la notifica!
      }

      // Se deve ancora inviare la notifica di partenza controlla!
      if (
        !followTrain.departedNotification &&
        followTrainStatus.isDepartedBeforeTargetStation(followTrain.stationCode)
      ) {
        // Invio la notifica!
      }

      console.log('Checked FollowTrain!\n')
    })
  }
}
