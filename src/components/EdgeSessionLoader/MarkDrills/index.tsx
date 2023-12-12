import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { DrillsModalType, GameType } from '../../../../types';
import { variables } from '../../../utils/mixins';
import ChartGrid from '../../charts/ChartGrid';
import ActivityGraph from '../../charts/chartTypes/ActivityGraph';
import { Icon } from '../../icon/icon';
import { MarkedDrill, MarkedPeriod } from '../SetupEdgeSession';

import DrillRow from './DrillRow';
import MatchDrillsModal from './MatchDrillsModal';

type Props = {
  sessionData: {
    activityGraph: any[];
    duration: number;
    startTimestamp: number;
    endTimestamp: number;
    players: any;
  };
  gameType: GameType;
  drills: MarkedDrill[];
  setDrills: React.Dispatch<React.SetStateAction<MarkedDrill[]>>;
  periods: MarkedPeriod[];
  setPeriods: React.Dispatch<React.SetStateAction<MarkedPeriod[]>>;
  fullSession: MarkedDrill;
  setFullSession: React.Dispatch<React.SetStateAction<MarkedDrill | null>>;
};

const MarkDrills = ({
  sessionData,
  gameType,
  drills,
  setDrills,
  periods,
  setPeriods,
  fullSession,
  setFullSession
}: Props) => {
  const navigation = useNavigation();
  const [startTimestamp, setStartTimestamp] = useState(
    fullSession.startTimestamp
  );
  const [endTimestamp, setEndTimeStamp] = useState(fullSession.endTimestamp);
  const [activityData, setActivityData] = useState(sessionData.activityGraph);
  const [showPeriodsModal, setShowPeriodsModal] = useState(false);

  const isMatch = gameType === GameType.Match;
  const duration = endTimestamp - startTimestamp;

  useEffect(() => {
    if (fullSession) {
      if (!fullSession.locked && fullSession.startTimestamp < startTimestamp) {
        setStartTimestamp(fullSession.startTimestamp);
      }
      if (!fullSession.locked && fullSession.endTimestamp > endTimestamp) {
        setEndTimeStamp(fullSession.endTimestamp);
      }

      if (fullSession.locked) {
        setStartTimestamp(fullSession.startTimestamp);
        setEndTimeStamp(fullSession.endTimestamp);
      }
    }
  }, [fullSession]);

  useEffect(() => {
    setActivityData(
      sessionData.activityGraph
        .map((item) => {
          // const { startTimestamp, endTimestamp } = fullSession;
          const msCutFromStart = startTimestamp - sessionData?.startTimestamp;
          const newTimeStamp = item.timestamp - msCutFromStart;
          return { ...item, timestamp: newTimeStamp };
        })
        .filter(
          (item) =>
            item.timestamp >= 0 &&
            item.timestamp <= endTimestamp - startTimestamp
        )
    );
  }, [startTimestamp, endTimestamp]);

  const verticalLines = Array(7)
    .fill(null)
    .map((_, index) => {
      let label = '';
      if (index === 0) {
        label = moment(startTimestamp).format('HH:mm');
      } else if (index === 6) {
        label = moment(startTimestamp + duration).format('HH:mm');
      } else {
        label = moment(startTimestamp + (duration / 6) * index).format('HH:mm');
      }
      return { value: index, label };
    });

  const onMarkDrill = (
    drillName: string,
    deletable = true,
    label = '',
    isPeriod = false
  ) => {
    setDrills((prevState) => {
      let id = 0;
      let startTime = fullSession.startTimestamp;

      const endTimestamp = fullSession.endTimestamp;
      const periodsAndDrills = [...periods, ...drills];
      if (periodsAndDrills.length) {
        const lastDrill = periodsAndDrills[periodsAndDrills.length - 1];
        id = lastDrill.id + 1;
        if (lastDrill.endTimestamp) {
          startTime = lastDrill.endTimestamp;
        }
      }

      return [
        ...prevState,
        {
          id,
          name: drillName,
          startTimestamp: startTime,
          endTimestamp,
          locked: false,
          deletable,
          label,
          isPeriod
        }
      ];
    });
  };

  const onAddNewPress = () => {
    if (isMatch) {
      return navigation.navigate('DrillsModal', {
        type: DrillsModalType.extraTime,
        onSubmit: onMarkDrill
      });
    }

    navigation.navigate('DrillsModal', {
      type: DrillsModalType.drills,
      onSubmit: onMarkDrill
    });
  };

  const onUpdateDrill = (drill: MarkedDrill) => {
    setDrills((prevState) =>
      prevState.map((item) => (item.id === drill.id ? drill : item))
    );
  };
  const onUpdatePeriod = (period: MarkedPeriod) => {
    setPeriods((prevState) =>
      prevState.map((item) => (item.id === period.id ? period : item))
    );
  };

  const onDeleteDrill = (id: number) =>
    setDrills((prevState) => prevState.filter((item) => item.id !== id));

  const enableMakeNewBtn = () => {
    if (!fullSession.locked) return false;
    const periodsAndDrills = [...periods, ...drills];
    if (periodsAndDrills.length) {
      const lastDrill = periodsAndDrills[periodsAndDrills.length - 1];
      const sessionEndTimestamp = startTimestamp + duration;
      const lastDrillEndTimestamp = lastDrill.endTimestamp;
      if (!lastDrillEndTimestamp) return false;
      const diffInMinutes =
        (sessionEndTimestamp - lastDrillEndTimestamp) / 1000 / 60;

      return diffInMinutes >= 1;
    }

    return true;
  };

  const renderDrill = (
    drill: MarkedDrill | MarkedPeriod,
    isFullSession = false
  ) => {
    if (
      (drill.locked && isFullSession) ||
      !drill.startTimestamp ||
      !drill.endTimestamp
    ) { return null; }

    const itemStart =
      drill.startTimestamp - (drill.startTimestamp % (1000 * 60));
    const itemEnd = drill.endTimestamp - (drill.endTimestamp % (1000 * 60));
    const itemDuration = itemEnd - itemStart;
    const eventStart = startTimestamp - (startTimestamp % (1000 * 60));
    const eventDuration = duration;
    const left = ((itemStart - eventStart) / eventDuration) * 100;
    const width = (itemDuration / eventDuration) * 100;

    return (
      <View
        key={drill.id}
        style={[
          styles.drillZone,
          {
            left: `${left}%`,
            width: `${width}%`
          },
          drill.locked ? styles.drillZoneLocked : null
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.drillZoneLabel,
            drill.locked && styles.drillZoneLabelLocked,
            isFullSession && { top: -25 }
          ]}
        >
          {drill.label || drill.name}
        </Text>
      </View>
    );
  };

  const renderDrills = () => {
    return drills.map((item) => renderDrill(item));
  };
  const renderPeriods = () => {
    return periods.map((item) => renderDrill(item));
  };

  const renderDrillRows = () => {
    return drills.map((item, i) => {
      let startMinimumDate = moment(fullSession.startTimestamp).toDate();
      const startMaximumDate = moment(item.endTimestamp)
        .subtract(1, 'minute')
        .toDate();

      const endMinimumDate = moment(item.startTimestamp)
        .add(1, 'minute')
        .toDate();
      let endMaximumDate = moment(fullSession.endTimestamp).toDate();

      const prevDrill = drills[i - 1];
      const nextDrill = drills[i + 1];

      if (prevDrill) {
        startMinimumDate = moment(prevDrill.endTimestamp).toDate();
      }
      if (nextDrill) {
        endMaximumDate = moment(nextDrill.startTimestamp)
          .subtract(1, 'minute')
          .toDate();
      }

      const startEndMinMaxDate = {
        start: {
          min: startMinimumDate,
          max: startMaximumDate
        },
        end: {
          min: endMinimumDate,
          max: endMaximumDate
        }
      };

      return (
        <DrillRow
          isMatch={isMatch}
          key={item.id}
          data={item}
          onUpdateDrill={onUpdateDrill}
          startEndMinMaxDate={startEndMinMaxDate}
          onDelete={onDeleteDrill}
        />
      );
    });
  };

  const renderPeriodRows = () => {
    return periods.map((period, i) => {
      /// start
      let startMinimumDate = moment(fullSession.startTimestamp).toDate();
      let startMaximumDate = moment(
        period.endTimestamp || fullSession.endTimestamp
      )
        .subtract(1, 'minute')
        .toDate();

      /// end
      const endMinimumDate = moment(
        period.startTimestamp || fullSession.startTimestamp
      )
        .add(1, 'minute')
        .toDate();

      let endMaximumDate = moment(fullSession.endTimestamp).toDate();

      const prevDrill = periods[i - 1];
      const nextDrill = periods[i + 1];

      if (prevDrill) {
        if (prevDrill.endTimestamp) {
          startMinimumDate = moment(prevDrill.endTimestamp).toDate();
        }
      }
      if (nextDrill) {
        if (nextDrill.startTimestamp) {
          startMaximumDate = moment(nextDrill.startTimestamp)
            .subtract(1, 'minute')
            .toDate();

          endMaximumDate = moment(nextDrill.startTimestamp).toDate();
        }
      }

      const disable =
        (fullSession.endTimestamp - startMinimumDate.valueOf()) / 1000 / 60 <
          1 ||
        (prevDrill && !prevDrill.endTimestamp);

      return (
        <DrillRow
          isMatch={isMatch}
          key={period.id}
          data={period}
          onUpdateDrill={onUpdatePeriod}
          startEndMinMaxDate={{
            start: {
              min: startMinimumDate,
              max: startMaximumDate
            },
            end: {
              min: endMinimumDate,
              max: endMaximumDate
            }
          }}
          onDelete={() => null}
          disable={disable}
        />
      );
    });
  };

  const getStartEndMinMaxTimeForFullSession = () => {
    let startMax = moment(fullSession.endTimestamp).subtract(1, 'minute');
    let endMin = moment(fullSession.startTimestamp).add(1, 'minute');

    const drillsAndPeriods = [...drills, ...periods];
    if (drillsAndPeriods.length) {
      const firstDrillStart = drillsAndPeriods[0].startTimestamp;
      const lastDrillEnd =
        drillsAndPeriods[drillsAndPeriods.length - 1].endTimestamp;
      if (firstDrillStart) {
        startMax = moment(firstDrillStart);
      }
      if (lastDrillEnd) {
        endMin = moment(lastDrillEnd);
      }
    }

    return {
      start: {
        min: moment(sessionData.startTimestamp).toDate(),
        max: startMax.toDate()
      },
      end: {
        min: endMin.toDate(),
        max: moment(sessionData.endTimestamp).toDate()
      }
    };
  };

  return (
    <View>
      {showPeriodsModal && (
        <MatchDrillsModal
          visible={showPeriodsModal}
          onCancel={() => setShowPeriodsModal(false)}
          onSubmit={onMarkDrill}
        />
      )}
      <View style={styles.chartExplanationContainer}>
        <Text style={styles.chartText}>Intensity zones</Text>
        <View style={styles.zoneWrapper}>
          <View style={{ ...styles.zone, backgroundColor: variables.red }} />
          <Text style={styles.chartLabel}>Explosive</Text>
        </View>
        <View style={styles.zoneWrapper}>
          <View
            style={{
              ...styles.zone,
              backgroundColor: variables.intensityZoneColors.veryHigh
            }}
          />
          <Text style={styles.chartLabel}>Very high</Text>
        </View>
        <View style={styles.zoneWrapper}>
          <View
            style={{
              ...styles.zone,
              backgroundColor: variables.intensityZoneColors.high
            }}
          />
          <Text style={styles.chartLabel}>High</Text>
        </View>
      </View>
      <Text style={styles.chartTextSecondary}>INTENSITY</Text>

      <ChartGrid
        customVerticalLines
        hasBottomLegend
        hasYAxisValues
        hasHorizontalLines
        verticalLines={verticalLines}
      >
        <ActivityGraph
          isTeamStats
          isMatch={false}
          data={activityData}
          matchDuration={(duration || 1) / 1000 / 60}
          drills={[]}
        />
        {renderDrill(fullSession, true)}
        {renderPeriods()}
        {renderDrills()}
      </ChartGrid>

      <View style={{ marginTop: 50 }}>
        <View style={styles.drillsContainer}>
          <>
            <DrillRow
              isMatch={isMatch}
              startEndMinMaxDate={getStartEndMinMaxTimeForFullSession()}
              onUpdateDrill={setFullSession}
              data={fullSession}
              onDelete={() => null}
            />
            {isMatch && renderPeriodRows()}
            {renderDrillRows()}
          </>
        </View>
        <View style={styles.buttonsWrapperWrapper}>
          <Pressable
            disabled={!enableMakeNewBtn()}
            onPress={onAddNewPress}
            style={styles.markNewBtn}
          >
            <Text
              style={[
                styles.markNewBtnText,
                !enableMakeNewBtn() && { color: variables.lightGrey }
              ]}
            >
              {isMatch ? 'Mark Extra Time' : 'Mark New'}
            </Text>
            <Icon
              style={StyleSheet.flatten([
                styles.markNewBtnIcon,
                !enableMakeNewBtn() && { color: variables.lightGrey }
              ])}
              icon="plus_wider"
            />
          </Pressable>

          {/* {isMatch && (
            <Pressable
              disabled={!enableMakeNewBtn()}
              onPress={() =>
                navigation.navigate('DrillsModal', {
                  type: DrillsModalType.extraTime,
                  onSubmit: onMarkDrill
                })
              }
              style={styles.markNewBtn}
            >
              <Text
                style={[
                  styles.markNewBtnText,
                  !enableMakeNewBtn() && { color: variables.lightGrey }
                ]}
              >
                Mark extra time
              </Text>
              <Icon
                style={StyleSheet.flatten([
                  styles.markNewBtnIcon,
                  !enableMakeNewBtn() && { color: variables.lightGrey }
                ])}
                icon="plus_wider"
              />
            </Pressable>
          )} */}
        </View>
      </View>
    </View>
  );
};

export default MarkDrills;

const styles = StyleSheet.create({
  buttonsWrapperWrapper: { flexDirection: 'row', marginTop: 20 },
  chartExplanationContainer: { flexDirection: 'row' },
  chartLabel: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 10
  },
  chartText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    marginRight: 15,
    textTransform: 'uppercase'
  },
  chartTextSecondary: {
    color: variables.chartLightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 'auto',
    textTransform: 'uppercase'
  },
  drillZone: {
    backgroundColor: 'rgba(48, 127, 226, 0.05)',
    borderColor: '#6A6DCD',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    height: '100%',
    position: 'absolute',
    top: 0
  },
  drillZoneLabel: {
    color: '#6A6DCD',
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    position: 'absolute',
    top: -15
  },
  drillZoneLabelLocked: {
    color: variables.red
  },
  drillZoneLocked: {
    backgroundColor: 'rgba(255, 237, 237, 0.4)',
    borderColor: variables.red
  },

  drillsContainer: { marginBottom: 10 },
  markNewBtn: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: variables.white,
    borderRadius: 8,
    flexDirection: 'row',
    height: 32,
    marginBottom: 10,
    marginRight: 40,
    paddingHorizontal: 14
  },
  markNewBtnIcon: {
    color: variables.grey,
    height: 20
  },
  markNewBtnText: {
    color: variables.grey,
    fontFamily: variables.mainFont,
    marginRight: 10
  },
  zone: { borderRadius: 3, height: 3, marginRight: 6, width: 12 },
  zoneWrapper: { alignItems: 'center', flexDirection: 'row', marginRight: 14 }
});
