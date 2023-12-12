import { firebase } from '@react-native-firebase/firestore';
import moment from 'moment';

import { GameAny, StatusMatch } from '../../types/game';
import { formatDateTime } from '../utils';

export const gameConverter = {
  toFirestore: (game: GameAny) => {
    const updatedGame = gameConverter.fromFirestore(game) as GameAny;
    if (!updatedGame.date) return updatedGame;

    updatedGame.status = gameConverter.toFirestoreStatus(
      updatedGame?.status ?? null
    ) as any;
    // delete undefined fields
    Object.keys(updatedGame).forEach((key) => {
      if (updatedGame[key as keyof GameAny] === undefined) {
        delete updatedGame[key as keyof GameAny];
      }
    });

    return {
      ...updatedGame,
      date: firebase.firestore.Timestamp.fromDate(
        moment(updatedGame.date).add(2, 'h').toDate()
      )
    };
  },
  toFirestoreStatus: (status: StatusMatch | null) => {
    if (!status) return undefined;
    const startTimestamp = moment(status.startTimestamp)
      .utc()
      .format('YYYY/MM/DD HH:mm');
    const endTimestamp = moment(status.endTimestamp)
      .utc()
      .format('YYYY/MM/DD HH:mm');
    return {
      ...status,
      startTimestamp: firebase.firestore.Timestamp.fromDate(
        moment(startTimestamp).toDate()
      ),
      endTimestamp: firebase.firestore.Timestamp.fromDate(
        moment(endTimestamp).toDate()
      )
    };
  },
  fromFirestoreStatus: (status: any): StatusMatch | undefined => {
    if (!status) return undefined;
    return {
      ...status,
      startTimestamp: formatDateTime(status.startTimestamp, 'timestamp'),
      endTimestamp: formatDateTime(status.endTimestamp, 'timestamp')
    };
  },
  fromFirestore: (data: any): GameAny => {
    // const data = snapshot.data(options);
    return {
      id: data.id,
      date: formatDateTime(data.date),
      UTCdate: data.UTCdate,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      type: data.type,
      versus: data.versus,
      preparation: data.preparation,
      readerList: data.readerList,
      rpe: data.rpe,
      status: gameConverter.fromFirestoreStatus(data.status),
      benchmark: data.benchmark,
      recurringEventId: data.recurringEventId
    };
  }
};
