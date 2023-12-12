import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';
import _ from 'lodash';
import moment from 'moment';

import { GameAny, GameReport, Player } from '../../types';
import { Config, Tag } from '../../types/config';
import {
  clubFirestoreProps,
  userConverter,
  userProfileFirestoreProps
} from '../converters';
import { authFirestoreProps } from '../converters/auth';
import { gameConverter } from '../converters/game';
import { utils } from '../utils/mixins';

const LOG_PREFIX = '[FIREBASE_SERVICE] ';

export const checkPendingWrites = async (
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
) => {
  return team.get().then((documentSnapshot) => {
    console.log('Pending writes:', documentSnapshot.metadata.hasPendingWrites);

    return documentSnapshot.metadata.hasPendingWrites;
  });
};

export const loginUser = async (email: string, password: string) => {
  return auth()
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      return getUserInfo(res.user.uid);
    })
    .catch((err) => {
      return err.nativeErrorMessage;
    });
};

export const getUserInfo = async (
  userId: string
): Promise<authFirestoreProps | null | undefined> => {
  return firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('User Info', doc.data(), userId);
        return { id: userId, ...doc.data() } as authFirestoreProps;
      }
      return null;
    })
    .catch(() => null);
};

export const getUserProfile = async (
  uid: string,
  clubName: string
): Promise<userProfileFirestoreProps | null | undefined> => {
  return firestore()
    .collection('customer')
    .doc(clubName)
    .collection('users')
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return userConverter.fromFirestore(doc);
      }
      return null;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};

export const updateUserProfile = async (
  uid: string,
  clubName: string,
  data: any
) => {
  return firestore()
    .collection('customer')
    .doc(clubName)
    .collection('users')
    .doc(uid)
    .set(data, { merge: true });
};

export async function getClub(customerName: string) {
  return firestore().collection(customerName);
}

export const updateClub = async (
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  data: Partial<clubFirestoreProps>
) => {
  console.log(LOG_PREFIX, 'updating club', data);
  return team.set(data, { merge: true });
};

export const updatePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const user = auth().currentUser;
  if (!user || !user.email) return null;
  return auth()
    .signInWithEmailAndPassword(user.email, oldPassword)
    .then((authData) => {
      return authData.user.updatePassword(newPassword);
    })
    .catch((error) => {
      console.log(error);
      return 'Wrong password';
    });
};

// export async function getTeam(club, val) {
//   return await club.doc(val);
// }

// export async function getTeams(club) {
//   const teams = [];
//   await club
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.docs.forEach((doc) => {
//         teams.push({ id: doc.id, data: doc.data(), doc: doc });
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   console.log('teams', teams.length, teams);
//   return teams;
// }

async function getCollectionOfTeam(
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  collectionName: string
) {
  // await firestore().disableNetwork();
  const games = await team.collection(collectionName).get();
  const results: any[] = [];
  games.forEach(function (doc) {
    const game = doc.data();

    if (!game.date) {
      console.warn(LOG_PREFIX, doc.id, 'has no date');

      return;
    }
    // filter exceptional events which date is not correct
    if (
      _.isDate(game.date) ||
      game.date.toDate ||
      moment(game.UTCdate, 'YYYY/MM/DD HH:mm', true).isValid()
    ) {
      return results.push({
        ...game,
        id: doc.id
      });
    }
  });

  return results.filter((item) => item.date);
}

// export async function getCoaches(team) {
//   return await getCollectionOfTeam(team, 'coaches');
// }

export async function getGames(
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
) {
  return await getCollectionOfTeam(team, 'games');
}

export async function getPlayers(
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
) {
  return team.collection('players').get();

  // .then((data) => {
  //   const _players: any = [];
  //   data.forEach((player) => {
  //     _players.push({
  //       ...player.data()
  //     });
  //   });

  //   return _players;
  // });
}

export const uploadPhoto = async (
  type: 'user' | 'team' | 'player' | 'coach',
  id: string,
  uri: string
) => {
  // const uploadUri = uri; // Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  // const reference = storage().ref(`/${type}/${id}`);

  // await reference.putFile(uploadUri).then(function (snapshot) {
  //   console.log('Uploaded a blob or file!', uri);
  // });

  // return await reference.getDownloadURL();

  const resizedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 600 } }], // Change the width as needed, height will be adjusted to maintain aspect ratio
    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  const blob = (await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', resizedImage.uri, true);
    xhr.send(null);
  })) as any;

  const fileRef = storage().ref(`/${type}/${id}`);
  const result = await fileRef.put(blob as Blob);
  const downloadUrl = await fileRef.getDownloadURL();
  const key = utils.encodeBase64(downloadUrl);
  await AsyncStorage.setItem(`images/${key}`, resizedImage.base64 || '');

  // We're done with the blob, close and release it
  blob.close();
  console.log('result', result);

  return downloadUrl;
};

export async function getConfigData(
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
) {
  const configSnap = await team.collection('config').get();

  if (!configSnap.docs || configSnap.docs.length === 0) {
    return null;
  }
  const config: Config | any = {};
  configSnap.docs.forEach((item) => {
    config[item.id] = item.data().tags;
  });

  return config;
}

export function updatePlayer(
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  player: Player
) {
  return team.collection('players').doc(player.id).set(player, { merge: true });
}

export function addPlayer(
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  player: Player
) {
  const newPlayer = team.collection('players').doc();

  newPlayer.set({ ...player, id: newPlayer.id });

  return newPlayer;
}

export function getGamesRef(
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>
) {
  return team.collection('games');
}

export function createGame(
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  event: GameAny
) {
  const newEvent = gameConverter.toFirestore(event);

  // check if there already exists a event with same date
  // const events = await store.team
  //   .collection('games')
  //   .where('date', '==', firestore.Timestamp.fromDate(event.date))
  //   .get();

  const game = team.collection('games').doc();
  game.set({ ...newEvent, id: game.id });

  return game;
}

export const updateGame = (
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  event: GameAny
) => {
  const newEvent = gameConverter.toFirestore(event);
  console.log('[FIRESTORE Update Game]', newEvent);
  return team.collection('games').doc(event.id).set(newEvent, { merge: true });
};

export const batchUpdateGames = (
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  events: GameAny[]
) => {
  const batch = firestore().batch();

  events.forEach((event) => {
    const newEvent = gameConverter.toFirestore(event);
    const gameRef = team.collection('games').doc(event.id);
    batch.set(gameRef, newEvent, { merge: true });
  });

  return batch.commit();
};

// batch create games
export const batchCreateGames = (
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  events: GameAny[]
) => {
  const batch = firestore().batch();
  const createdEvents: GameAny[] = [];
  events.forEach((event) => {
    const newEvent = gameConverter.toFirestore(event);
    const gameRef = team.collection('games').doc();
    batch.set(gameRef, { ...newEvent, id: gameRef.id });
    createdEvents.push({
      ...gameConverter.fromFirestore(newEvent),
      id: gameRef.id
    });
  });

  batch.commit();
  return createdEvents;
};

export const uploadReportData = (
  gameRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  report: GameReport,
  replace = false
) => {
  // make sure the data is not null
  if (report?.stats) {
    // TODO: split the report data to smaller package
    // https://firebase.google.com/docs/firestore/quotas#writes_and_transactions
    const reportRef = gameRef.collection('report');

    // Split the stats to smaller transaction to avoid quota limit
    const statsNew = report.stats ?? { team: {}, players: {} };
    reportRef.doc('stats').set(
      {
        team: statsNew.team
      },
      { merge: !replace }
    );
    const playerIds = Object.keys(statsNew.players);

    for (let i = 0; i < playerIds.length; i++) {
      const player = statsNew.players[playerIds[i]];
      reportRef.doc('stats').set(
        {
          players: {
            [playerIds[i]]: player
          }
        },
        { merge: !replace }
      );
    }
  }
};

export const getGameReport = (
  clubRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  gameId: string
) => {
  return clubRef
    .collection('games')
    .doc(gameId)
    .collection('report')
    .doc('stats')
    .get();
};

export const deleteGame = (
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  event: GameAny
) => {
  const gameRef = team.collection('games').doc(event.id);

  // delete report collection under gameRef if exists
  gameRef
    .collection('report')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
  gameRef.delete();
};

// batch delete games
export const batchDeleteGames = (
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  events: GameAny[]
) => {
  const batch = firestore().batch();

  events.forEach((event) => {
    const gameRef = team.collection('games').doc(event.id);
    batch.delete(gameRef);
  });

  return batch.commit();
};

export const getAdminClubs = async () => {
  const customerInfo = await firestore().collection('customer').get();

  return customerInfo.docs.map((doc: { id: any }) => doc.id);
};

export const updateConfigTags = (
  team: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  newTags: Tag
) => {
  console.log('[FIRESTORE Update Config Tags]', newTags);
  return team
    .collection('config')
    .doc('tags')
    .set({ tags: newTags }, { merge: true });
};
