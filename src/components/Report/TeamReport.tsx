import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { DropdownFilterKeys, GameAny, GameType } from '../../../types';
import { generateSessions } from '../../helpers/chartHelpers';
import { getFilterType } from '../../helpers/filterSliceHelper';
import { selectAuth } from '../../redux/slices/authSlice';
import { selectComparisonFilter } from '../../redux/slices/filterSlice';
import {
  selectGameById,
  updateGameAction
} from '../../redux/slices/gamesSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { color } from '../../theme';
import { RootStackParamList } from '../../types';
import { deriveNewStats } from '../../utils/adapter';
import { EVENT_SUBSESSIONS } from '../../utils/mixins';
import IndicatorLayout from '../LiveGame/IndicatorLayout';
import LiveHeaderSessions from '../LiveGame/LiveHeaderSessions';
import PhysicalStats from '../StatsScreens/PhysicalStats';

import ReportHeader from './ReportHeader';

const INDICATORS_TEAM = [
  {
    number: 12,
    locked: false,
    label: 'PLAYER LOAD',
    isActive: true,
    badge: 'Team'
  },
  {
    number: 84,
    locked: true,
    label: 'TECHNICAL',
    isActive: false
  }
  // {
  //   number: 0,
  //   locked: true,
  //   label: 'GAME PACE',
  //   isActive: false
  // }
];

const TeamReport = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const route = useRoute() as RouteProp<RootStackParamList, 'TeamReport'>;
  const { eventId } = route.params;
  const event = useAppSelector((state) =>
    selectGameById(state, eventId)
  ) as GameAny;

  const [activeSubSession, setActiveSubsession] = useState(
    EVENT_SUBSESSIONS.fullSession
  );
  const handleActiveSubsession = (session: string) => {
    setActiveSubsession(session);
  };

  useEffect(() => {
    addUserToReaderList();
  }, []);

  const addUserToReaderList = () => {
    const readerList = [...(event?.readerList || [])];
    const userId = auth.id;

    if (event && userId && !readerList.includes(userId)) {
      const updatedEvent = {
        ...event,
        readerList: [...readerList, userId]
      };

      dispatch(updateGameAction(updatedEvent));
    }
  };

  const filterType = useMemo(() => {
    return getFilterType(event);
  }, [event, event?.type]);

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, filterType)
  );

  const isDontCompare =
    comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE;

  const deriveData = useMemo(() => {
    return deriveNewStats({
      event,
      isMatch: event?.type === GameType.Match,
      explicitBestMatch: comparisonFilter.key === DropdownFilterKeys.BEST_MATCH,
      dontCompare: isDontCompare,
      activeSubSession
    });
  }, [event, isDontCompare, comparisonFilter.key, activeSubSession]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <ReportHeader event={event} />
        <LiveHeaderSessions
          sessions={generateSessions(event).sort((a, b) => {
            return a.startTime - b.startTime;
          })}
          activeSubSession={activeSubSession}
          handleActiveSubsession={handleActiveSubsession}
        />
        <IndicatorLayout
          containerStyle={styles.indicatorLayout}
          indicators={INDICATORS_TEAM.map((it) => {
            return {
              ...it,
              number: isDontCompare
                ? Math.round(deriveData?.teamLoad) === 0
                  ? '00'
                  : Math.round(deriveData?.teamLoad)
                : Math.round(deriveData.percentageLoad),
              filterType
            };
          })}
        />
      </View>
      <PhysicalStats event={event} activeSubSession={activeSubSession} />
    </View>
  );
};

export default TeamReport;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.palette.black2,
    paddingHorizontal: 24
  },
  indicatorLayout: {
    borderColor: color.palette.grey,
    borderRadius: 2,
    borderWidth: 1,
    marginVertical: 20
  }
});
