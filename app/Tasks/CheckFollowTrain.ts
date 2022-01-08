import { BaseTask } from 'adonis5-scheduler/build'
import Env from '@ioc:Adonis/Core/Env'
import FollowTrain from 'App/Models/FollowTrain'
import { FollowTrainStatus } from '../../model/FollowTrain/FollowTrainStatus'
import FCM from '@ioc:Adonis/Addons/FCM'

const axios = require('axios')

export default class CheckFollowTrain extends BaseTask {
  public static get schedule() {
    return '0/10 * * * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    const response = await FCM.send(
      {
        notification: {
          title: 'Il tuo treno sta arrivando!',
          body: 'Il tuo treno è arrivato nella stazione precedente alla tua.',
        },
      },
      'cTk12GVZTqO1jRvt46uz4n:APA91bHux0sL0XqaRtaKBngk_GRNstrJs82wa82n_-Ggqywfij1o002j3TmX4mvQ9N23ryAEVn1VJ7YnYAlmm56VuwgeqJchuRbEsYjMf56LI4PVbdw7oSe7TNFO7o4B760Se39yG5BB'
    )

    console.log(response)

    return

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
        const response = await FCM.send(
          {
            notification: {
              title: 'Il tuo treno sta arrivando!',
              body: 'Il tuo treno è arrivato nella stazione precedente alla tua.',
            },
          },
          followTrain.deviceToken
        )
        console.log(response)
      }

      // Se deve ancora inviare la notifica di partenza controlla!
      if (
        !followTrain.departedNotification &&
        followTrainStatus.isDepartedBeforeTargetStation(followTrain.stationCode)
      ) {
        // Invio la notifica!
        const response = await FCM.send(
          {
            notification: {
              title: 'Il tuo treno sta arrivando!',
              body: 'Il tuo treno è partito dalla stazione precedente e sta arrivando',
            },
          },
          followTrain.deviceToken
        )
        console.log(response)
      }

      console.log('Checked FollowTrain!\n')
    })
  }
}
