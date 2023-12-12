import messaging from '@react-native-firebase/messaging';

const LOG_PREFIX = '[FCM] ';

async function registerAppWithFCM() {
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
}

async function requestPermission() {
  const authStatus = await messaging().hasPermission();
  //   const fcmToken = await messaging().getToken();
  //   console.log('fcmToken', fcmToken);
  if (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    console.log(LOG_PREFIX + 'User has granted messaging permissions before!');
    return true;
  }

  const granted = await messaging().requestPermission({
    alert: true,
    announcement: false,
    badge: true,
    carPlay: true,
    provisional: false,
    sound: true
  });

  if (granted) {
    const fcmToken = await messaging().getToken();
    console.log(LOG_PREFIX + 'User granted messaging permissions!', fcmToken);
  } else {
    console.log(LOG_PREFIX + 'User declined messaging permissions :(');
  }

  return granted;
}

function subcribeNotification(
  handler: (remoteMessage: any, bool: boolean) => void
) {
  const msgInstance = messaging();

  msgInstance.onNotificationOpenedApp((remoteMessage) => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification
    );

    handler && handler(remoteMessage, true);
  });

  // Check whether an initial notification is available
  msgInstance.getInitialNotification().then((remoteMessage) => {
    console.log('getInitialNotification', remoteMessage);
    if (remoteMessage) {
      console.log(
        LOG_PREFIX + 'Notification caused app to open from quit state:',
        remoteMessage.notification
      );
      handler && handler(remoteMessage, true);
    }
  });

  // notification
  msgInstance.setBackgroundMessageHandler(async (remoteMessage) => {
    console.log(
      LOG_PREFIX + 'Message handled in the background!',
      remoteMessage
    );
  });

  msgInstance.onMessage(async (remoteMessage) => {
    console.log(
      LOG_PREFIX + 'A new FCM message arrived!',
      JSON.stringify(remoteMessage)
    );
    handler && handler(remoteMessage, false);
  });

  return msgInstance;
}

export async function startFcm(
  topic: string,
  handler: (message: any, isRemote: any) => void
) {
  await registerAppWithFCM();
  const granted = await requestPermission();

  if (granted) {
    if (topic) {
      messaging()
        .subscribeToTopic(topic)
        .then(() => {
          console.log(LOG_PREFIX + 'Subscribed to topic: ' + topic);
        });
    }
  }

  return granted ? subcribeNotification(handler) : () => null;
}

export function stopFcm(topic: string) {
  return messaging()
    .unsubscribeFromTopic(topic)
    .then(() => {
      console.log(LOG_PREFIX + 'Unsubscribed to topic: ' + topic);
    });
}
