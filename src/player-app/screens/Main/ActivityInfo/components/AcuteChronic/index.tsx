import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import moment from 'moment';

import { GameAny, GameType } from '../../../../../../../types';
import { selectAuth } from '../../../../../../redux/slices/authSlice';
import { selectFinishedGamesByPlayer } from '../../../../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../../../../redux/store';
import { acuteChronicPlayerApp } from '../../../../../../utils/adapter';

import AcuteChronicChart from './AcuteChronicChart';
import AcuteChronicFooter from './AcuteChronicFooter';
import AcuteChronicHeader from './AcuteChronicHeader';

const FORMAT_WEEK = 'YYYY/MM/DD';

interface Props {
  game?: GameAny;
}

const AcuteChronicPlayerApp = ({ game }: Props) => {
  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const games = useAppSelector((state) =>
    selectFinishedGamesByPlayer(state, playerId).filter(
      (game) => game.type === GameType.Training
    )
  );
  const [currentDate, setCurrentDate] = useState(moment());
  const [acuteDates, setAcuteDates] = useState<string[]>([]);

  useEffect(() => {
    if (game) {
      setCurrentDate(moment(game.date));
    }
    const dates = games.map((game) => game.date);

    setAcuteDates(Array.from(new Set(dates)));
  }, [game]);

  const calculationLoad = useMemo(() => {
    const date = game ? currentDate : false;
    const data = acuteChronicPlayerApp(playerId, acuteDates, date, games);
    if (!game) {
      const arrLength = data.length;
      return data.slice(arrLength - 11, arrLength);
    }
    return data;
  }, [playerId, acuteDates, currentDate, games]);

  const indexOfToday = calculationLoad.findIndex(
    (item: { date: moment.MomentInput }) =>
      moment(item.date, FORMAT_WEEK).format(FORMAT_WEEK) ===
      moment(currentDate, FORMAT_WEEK).format(FORMAT_WEEK)
  );

  return (
    <View>
      <AcuteChronicHeader
        acuteChronicRatio={
          calculationLoad[indexOfToday]?.acuteChronicRatio || null
        }
        acuteLoad={calculationLoad[indexOfToday]?.acuteLoad || null}
        chronicLoad={calculationLoad[indexOfToday]?.chronicLoad || null}
      />
      <AcuteChronicChart
        currentDate={currentDate}
        calculationLoad={calculationLoad}
      />
      <AcuteChronicFooter gameDate={currentDate.format(FORMAT_WEEK)} />
    </View>
  );
};

export default AcuteChronicPlayerApp;
