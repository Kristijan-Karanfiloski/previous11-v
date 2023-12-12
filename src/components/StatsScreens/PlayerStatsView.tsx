import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RouteProp, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { DropdownFilterKeys, GameAny, GameType, Player } from '../../../types';
import { generateSessions } from '../../helpers/chartHelpers';
import { getFilterType } from '../../helpers/filterSliceHelper';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectComparisonFilter } from '../../redux/slices/filterSlice';
import { selectGameById } from '../../redux/slices/gamesSlice';
import { selectPlayerById } from '../../redux/slices/playersSlice';
import { selectTrackingEvent } from '../../redux/slices/trackingEventSlice';
import { useAppSelector } from '../../redux/store';
import { color } from '../../theme';
import { RootStackParamList } from '../../types';
import { deriveNewStats } from '../../utils/adapter';
import { EVENT_SUBSESSIONS, variables } from '../../utils/mixins';
import ToggleButton from '../Buttons/ToggleButton';
import Avatar from '../common/Avatar';
import OverlayLoader from '../common/OverlayLoader';
import { Icon } from '../icon/icon';
import IndicatorLayout from '../LiveGame/IndicatorLayout';
import LiveHeader from '../LiveGame/LiveHeader';
import LiveHeaderSessions from '../LiveGame/LiveHeaderSessions';
import ReportHeader from '../Report/ReportHeader';

import SinglePlayerRPEStats from './SinglePlayerRPEStats';
import SinglePlayerStats from './SinglePlayerStats';

const INDICATORS_PLAYER = [
  {
    number: 12,
    locked: false,
    label: 'PLAYER LOAD',
    isActive: true
  }
];

const PlayerStatsView = () => {
  const { params, name } = useRoute() as RouteProp<
    RootStackParamList,
    'PlayerLive' | 'PlayerReport'
  >;
  const activeEvent = useSelector(selectTrackingEvent);
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const { eventId, playerId } = params;
  const event = useAppSelector((state) =>
    selectGameById(state, eventId || '')
  ) as GameAny;
  const isLive = name === 'PlayerLive';

  const copyEvent = isLive ? activeEvent : event;

  const [activeSubSession, setActiveSubsession] = useState(
    EVENT_SUBSESSIONS.fullSession
  );
  const [currentViewMode, setCurrentViewMode] = React.useState<
    'physical_stats' | 'rpe'
  >('physical_stats');

  const handleActiveSubsession = (session: string) => {
    setActiveSubsession(session);
  };

  const player = useAppSelector((state) =>
    selectPlayerById(state, playerId)
  ) as Player;

  const filterType = useMemo(() => {
    return getFilterType(copyEvent);
  }, [event, event?.type]);

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, filterType)
  );

  const isDontCompare =
    comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE;

  const deriveData = useMemo(() => {
    return deriveNewStats({
      event: copyEvent,
      isMatch: copyEvent?.type === GameType.Match,
      explicitBestMatch: comparisonFilter.key === DropdownFilterKeys.BEST_MATCH,
      dontCompare: isDontCompare,
      currentPlayerId: playerId
    });
  }, [copyEvent, isDontCompare, comparisonFilter.key]);

  if (!player || !copyEvent) return <OverlayLoader isLoading />;

  const renderPlayerDuration = () => {
    const totalTimeMins = Math.ceil(
      moment
        .duration(
          event?.report?.stats?.players[player.id]?.fullSession?.duration || 0
        )
        .asMinutes()
    );
    return (
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 8,
          marginLeft: 10
        }}
      >
        <Icon icon="clock" containerStyle={{ marginRight: 3 }} />
        {totalTimeMins >= 1 && (
          <Text style={styles.substitutionMinute}>{totalTimeMins} min</Text>
        )}
      </View>
    );
  };

  const renderSubstitueInfo = () => {
    const subs = event?.preparation?.substitutions;

    if (subs && subs[playerId]) {
      const playerSubInfo = subs[playerId];
      return playerSubInfo.map((subData, index) => {
        const isSubbedIn = subData.subbed === 'in';
        const minuteOfSubstitution = Math.round(subData.time / 1000 / 60);
        if (
          subData?.drillName === 'preMatch' ||
          subData?.drillName === EVENT_SUBSESSIONS.halftime ||
          subData?.drillName === EVENT_SUBSESSIONS.intermission
        ) {
          return null;
        }
        return (
          <View key={`${index * 4}`} style={styles.substitutionMainContainer}>
            <Icon
              icon={isSubbedIn ? 'sub_in' : 'sub_out'}
              containerStyle={{ width: 24, height: 24 }}
            />
            <Text style={styles.substitutionMinute}>
              {`${minuteOfSubstitution}' `}
            </Text>
          </View>
        );
      });
    }

    return null;
  };

  const getPlayerPosition = () => {
    if (isHockey) {
      return variables.playerPositionsAbbrHockey[player.role as any];
    }
    return variables.playerPositionsAbbr[player.ppos];
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {!isLive ? <ReportHeader event={copyEvent} /> : <LiveHeader />}
        <LiveHeaderSessions
          sessions={generateSessions(copyEvent).sort((a, b) => {
            return a.startTime - b.startTime;
          })}
          activeSubSession={activeSubSession}
          handleActiveSubsession={handleActiveSubsession}
        />
        <View style={styles.headerContainer}>
          <View style={[styles.indicatorLayout, styles.avatarContainer]}>
            <Avatar style={styles.avatar} photoUrl={player.photoUrl} />

            <View style={styles.playerInfoContainer}>
              <Text numberOfLines={1} style={styles.playerName}>
                {player.name}
              </Text>
              <Text style={styles.playerPosition}>{getPlayerPosition()}</Text>
              <Icon icon="icon_connected" />
            </View>
            <View style={styles.substitutionBorder} />
            <View>
              {renderPlayerDuration()}
              <View style={styles.substitutionContainer}>
                {renderSubstitueInfo()}
              </View>
            </View>
          </View>
          <IndicatorLayout
            containerStyle={styles.smallerIndicatorLayout}
            indicators={INDICATORS_PLAYER.map((it) => {
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
      </View>
      <View style={styles.viewSwitch}>
        <ToggleButton
          onClick={() => setCurrentViewMode('physical_stats')}
          isActive={currentViewMode === 'physical_stats'}
          content="Physical Stats"
          position="left"
        />

        <ToggleButton
          onClick={() => setCurrentViewMode('rpe')}
          position="right"
          isActive={currentViewMode === 'rpe'}
          content="RPE"
        />
      </View>
      {currentViewMode === 'physical_stats'
        ? (
        <SinglePlayerStats
          event={copyEvent}
          playerId={playerId}
          activeSubSession={activeSubSession}
        />
          )
        : (
        <SinglePlayerRPEStats event={copyEvent} playerId={playerId} />
          )}
    </View>
  );
};

export default PlayerStatsView;

const styles = StyleSheet.create({
  avatar: {
    borderColor: 'transparent',
    borderRadius: 2,
    height: 85,
    marginRight: 15,
    width: 85
  },
  avatarContainer: {
    backgroundColor: color.palette.grey,
    borderRadius: 4,
    flexDirection: 'row',
    marginRight: '2%',
    overflow: 'hidden',
    paddingLeft: 12,
    paddingVertical: 12,
    width: '63%'
  },
  container: {
    backgroundColor: color.palette.black2,
    paddingHorizontal: 24
  },
  headerContainer: {
    flexDirection: 'row',
    height: 150
  },
  indicatorLayout: {
    borderColor: color.palette.grey,
    borderRadius: 2,
    borderWidth: 1,
    marginVertical: 20
  },
  playerInfoContainer: {
    marginTop: 3,
    width: '33%'
  },
  playerName: {
    color: color.palette.white,
    fontFamily: variables.mainFontBold,
    fontSize: 18,
    marginRight: 8,
    width: 80
  },
  playerPosition: {
    color: color.palette.lightBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 16
  },
  smallerIndicatorLayout: {
    borderColor: color.palette.grey,
    borderRadius: 2,
    borderWidth: 1,
    marginVertical: 20,
    width: '35%'
  },
  substitutionBorder: {
    borderColor: variables.textBlack,
    borderRadius: 10,
    borderWidth: 2,
    height: '100%'
  },
  substitutionContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: 50,
    marginLeft: 10,
    overflow: 'hidden',
    width: '70%'
  },
  substitutionMainContainer: {
    flexDirection: 'row',
    marginRight: 10
  },
  substitutionMinute: {
    color: color.palette.lightBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    marginLeft: 5
  },
  viewSwitch: {
    alignItems: 'center',
    backgroundColor: variables.backgroundColor,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 12,
    minWidth: 305
  }
});
