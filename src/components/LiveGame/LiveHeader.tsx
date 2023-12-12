import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { DrillsModalType, GameType } from '../../../types';
import { getFilterType } from '../../helpers/filterSliceHelper';
import { EventTopics, SocketContext } from '../../hooks/socketContext';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import {
  selectTrackingEvent,
  updateTrackingEvent
} from '../../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { palette } from '../../theme';
import {
  EVENT_SUBSESSIONS,
  MATCH_PERIODS,
  MATCH_PERIODS_HOCKEY,
  variables
} from '../../utils/mixins';
import ButtonNew from '../common/ButtonNew';
import DropdownFilter from '../common/DropdownFilter';
import Stopwatch from '../common/Stopwatch';

import LostConnectionModal from './LostConnectionModal';

const LiveHeader = () => {
  const dispatch = useAppDispatch();
  const { sendEvent, isReady, edgeConnected } = useContext(SocketContext);
  const activeEvent = useAppSelector(selectTrackingEvent);
  const activeClub = useAppSelector(selectActiveClub);
  const navigation = useNavigation();
  const isHockey = activeClub.gameType === 'hockey';
  const [btnPressWhenDisconnected, setBtnPressWhenDisconnected] =
    useState<boolean>(false);
  const [delay, setDelay] = useState<null | number>(null);

  const savedCallback = useRef<(() => void) | null>(null);

  const isDisconnected = useMemo(() => {
    return !isReady || !edgeConnected;
  }, [isReady, edgeConnected]);

  const getMarkPeriodIndex = () => {
    const drills = activeEvent?.report?.stats?.team?.drills || {};
    let isFirstIntermission = true;
    let lastDrill = Object.keys(drills)
      .filter((item) => {
        return drills[item].duration === 0;
      })
      .filter((item) => item !== EVENT_SUBSESSIONS.fullGame)[0];

    if (lastDrill && lastDrill.includes('_')) {
      const splitedDrillName = lastDrill.split('_');
      lastDrill = splitedDrillName[1];
      if (lastDrill === EVENT_SUBSESSIONS.intermission) {
        isFirstIntermission =
          +splitedDrillName[0] === 2 || +splitedDrillName[0] === 3;
      }
    }

    let indexNumber = 0;
    if (lastDrill) {
      if (isHockey) {
        indexNumber = MATCH_PERIODS_HOCKEY.findIndex(
          (item) => item.drillName === lastDrill
        );
        if (!isFirstIntermission) {
          indexNumber = indexNumber + 2;
        }
      } else {
        indexNumber = MATCH_PERIODS.findIndex(
          (item) => item.drillName === lastDrill
        );
      }
    }
    if (lastDrill === 'overtime' || indexNumber === -1) {
      return isHockey ? 6 : 4;
    }
    return indexNumber < 0 ? 0 : indexNumber + 1;
  };

  const [markPeriodIndex, setMarkPeriodIndex] = useState<number>(
    getMarkPeriodIndex()
  );
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);

  useEffect(() => {
    setMarkPeriodIndex(getMarkPeriodIndex());
    setButtonLoader(false);
  }, [activeEvent.report?.stats?.team?.drills]);

  const getDelay = () => {
    if (!activeEvent?.report || !activeEvent.report?.timeStamp) {
      return setDelay(null);
    }
    const reportTime = activeEvent.report?.timeStamp || 0;
    const diffTime = Math.round((Date.now() - reportTime) / 1000);

    if (diffTime > 29) return setDelay(diffTime);

    return setDelay(null);
  };

  useEffect(() => {
    savedCallback.current = getDelay;
  });

  const renderTimer = () => {
    return (
      <View style={styles.timerBox}>
        <Stopwatch customStyle={styles.stopwatch} />
      </View>
    );
  };

  const filterType = useMemo(() => {
    return getFilterType(activeEvent);
  }, [activeEvent, activeEvent?.type]);

  if (!activeEvent) return null;

  const onMarkPress = () => {
    if (isDisconnected) return setBtnPressWhenDisconnected(true);
    if (activeEvent?.type === GameType.Training) {
      return trainingMarkPress();
    }
    return matchMarkPress();
  };

  const trainingMarkPress = () => {
    if (!activeEvent.activeDrill) {
      return navigation.navigate('DrillsModal', {
        type: DrillsModalType.drills
      });
    }

    sendEvent(EventTopics.DRILL_END, {
      drillName: activeEvent.activeDrill
    });
    dispatch(updateTrackingEvent({ activeDrill: null }));
  };

  const matchMarkPress = () => {
    if (
      (isHockey &&
        MATCH_PERIODS_HOCKEY[markPeriodIndex].drillName === 'overtime') ||
      (!isHockey && MATCH_PERIODS[markPeriodIndex].drillName === 'overtime')
    ) {
      return navigation.navigate('DrillsModal', {
        type: DrillsModalType.extraTime
      });
    }
    sendEvent(EventTopics.DRILL_START, {
      drillName: isHockey
        ? MATCH_PERIODS_HOCKEY[markPeriodIndex].drillName
        : MATCH_PERIODS[markPeriodIndex].drillName
    });
    setButtonLoader(true);
  };

  const getMarkButtonText = () => {
    if (activeEvent?.type === GameType.Training) {
      if (activeEvent.activeDrill) return 'End Drill';
      return 'Mark Drill';
    }
    if (
      (isHockey &&
        MATCH_PERIODS_HOCKEY[markPeriodIndex].drillName === 'overtime') ||
      (!isHockey && MATCH_PERIODS[markPeriodIndex].drillName === 'overtime')
    ) {
      return 'Mark Extra';
    }
    return isHockey
      ? MATCH_PERIODS_HOCKEY[markPeriodIndex].title
      : MATCH_PERIODS[markPeriodIndex].title;
  };

  const endTrackingPress = () => {
    if (isDisconnected) return setBtnPressWhenDisconnected(true);
    return navigation.navigate('EndLiveEventModal');
  };

  return (
    <View style={styles.container}>
      <View style={styles.halfTimer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          {getMarkButtonText() !== MATCH_PERIODS[5].title && (
            <ButtonNew
              text={getMarkButtonText()}
              style={{
                borderColor: palette.realWhite,
                width: 152,
                marginRight: 12
              }}
              textStyle={{
                color: palette.realWhite
              }}
              onPress={onMarkPress}
              isLoading={buttonLoader}
              disabled={buttonLoader}
            />
          )}

          <ButtonNew
            text={'End Tracking'}
            mode="secondary"
            style={{
              borderColor: palette.realWhite,
              width: 132
            }}
            textStyle={{
              color: palette.realWhite
            }}
            onPress={endTrackingPress}
          />
        </View>

        <View style={styles.timerContainer}>
          <View>
            <Text style={styles.liveText}>LIVE</Text>
            {delay && <Text style={styles.delayText}>DELAY: {delay}</Text>}
          </View>
          {renderTimer()}
        </View>
      </View>

      <DropdownFilter filterType={filterType} />

      <LostConnectionModal
        activeEvent={activeEvent}
        btnPressWhenDisconnected={btnPressWhenDisconnected}
        handleBtnPressWhenDisconnected={() =>
          setBtnPressWhenDisconnected(false)
        }
      />
    </View>
  );
};

export default LiveHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 74,
    justifyContent: 'space-between'
  },
  delayText: {
    bottom: -13,
    color: variables.red,
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    position: 'absolute',
    width: '130%'
  },
  halfTimer: {
    alignItems: 'center',
    backgroundColor: palette.grey,
    borderRadius: 4,
    flexDirection: 'row',
    flex: 0.672,
    justifyContent: 'space-between',
    padding: 12
  },
  liveText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 20,
    marginRight: 8
  },
  stopwatch: {
    color: palette.realWhite,
    fontFamily: variables.mainFont,
    fontSize: 30
  },
  timerBox: {
    alignItems: 'center',
    backgroundColor: palette.black2,
    borderRadius: 4,
    marginLeft: 8,
    minWidth: 110,
    paddingHorizontal: 9,
    paddingVertical: 6
  },
  timerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
