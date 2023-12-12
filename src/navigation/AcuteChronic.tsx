import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { GameAny } from '../../types';
import AcuteChronicRow from '../components/AcuteChronicRow';
import Card from '../components/common/Card';
import { Icon } from '../components/icon/icon';
import WeeklyLoadHeader from '../components/WeeklyLoad/Header/WeeklyLoadHeader';
import {
  selectAllFinishedGamesByType,
  selectGamesWithinDateRange
} from '../redux/slices/gamesSlice';
import { selectAllPlayers } from '../redux/slices/playersSlice';
import store, { useAppSelector } from '../redux/store';
import { ACUTE_CHRONIC_OPTIONS, utils, variables } from '../utils/mixins';

const windowWidth = Dimensions.get('window').width;

const CHART_WIDTH =
  windowWidth -
  (ACUTE_CHRONIC_OPTIONS.CARD_PADDING +
    ACUTE_CHRONIC_OPTIONS.CONTAINER_PADDING) *
    2 -
  ACUTE_CHRONIC_OPTIONS.RATIO_WIDTH;
const CELL_WIDTH = CHART_WIDTH / ACUTE_CHRONIC_OPTIONS.NUM_ITEMS;
const listItems = Array.from({ length: ACUTE_CHRONIC_OPTIONS.NUM_ITEMS });

const FORMAT_DAY_MONTH = 'DD/MM';
const FORMAT_WEEK = 'YYYY/MM/DD';

export type PlayerLoadData = {
  totalLoad: number;
  accessCount: number;
};

type AcuteChronicProps = {
  playerId?: string;
  date?: string;
};

const AcuteChronic = ({ playerId, date }: AcuteChronicProps) => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState(moment());
  const [acuteDates, setAcuteDates] = useState<string[]>([]);
  const [firstFinishedEventDate, setFirstFinishedEventDate] =
    useState<string>('');

  const allPlayers = useAppSelector(selectAllPlayers);
  const games = useAppSelector((state) => selectAllFinishedGamesByType(state));

  useEffect(() => {
    const dates = games.map((game) => game.date);

    setFirstFinishedEventDate(
      games.find((game) => game.status?.isFinal)?.date || ''
    );

    if (date) {
      setCurrentDate(moment(date));
    } else {
      const currentFoundDate = utils.findClosestDateToToday(dates);
      if (currentFoundDate) {
        setCurrentDate(moment(currentFoundDate));
      }
    }
    // set only unique dates
    setAcuteDates(Array.from(new Set(dates)));
  }, []);

  const dateNavDisabled = useMemo(() => {
    const indexOfDate = acuteDates.indexOf(currentDate.format(FORMAT_WEEK));
    return {
      prev: indexOfDate === 0,
      next: indexOfDate === acuteDates.length - 1
    };
  }, [currentDate, acuteDates]);

  const calculatePlayersLoad = (
    gamesList: GameAny[]
  ): Record<string, PlayerLoadData> => {
    return gamesList.reduce(
      (acc: Record<string, PlayerLoadData>, game: GameAny) => {
        (Object.keys(game.report?.stats.players || {}) as string[]).forEach(
          (playerId: string) => {
            // Check if playerId exists in acc, if not initialize it
            if (!acc[playerId]) {
              acc[playerId] = { totalLoad: 0, accessCount: 0 };
            }

            // Update totalLoad and increment accessCount
            acc[playerId].totalLoad +=
              game.report?.stats.players[playerId].fullSession.playerLoad
                .total || 0;
            acc[playerId].accessCount += 1;
          }
        );

        return acc;
      },
      {} as Record<string, PlayerLoadData>
    );
  };

  const playersLoad = useMemo(() => {
    const acuteGames = selectGamesWithinDateRange(
      store.getState(),
      moment(currentDate).subtract(7, 'days').format(FORMAT_WEEK),
      moment(currentDate).format(FORMAT_WEEK)
    );
    const chronicGames = selectGamesWithinDateRange(
      store.getState(),
      moment(currentDate).subtract(28, 'days').format(FORMAT_WEEK),
      moment(currentDate).format(FORMAT_WEEK)
    );
    const acutePlayerLoad = calculatePlayersLoad(acuteGames);
    const chronicPlayerLoad = calculatePlayersLoad(chronicGames);

    return {
      acutePlayerLoad,
      chronicPlayerLoad,
      totalLoad: Object.keys(acutePlayerLoad).reduce((acc, playerId) => {
        return acc + acutePlayerLoad[playerId].totalLoad;
      }, 0),
      totalTime: acuteGames.reduce((acc, game) => {
        return acc + (game.report?.stats?.team?.fullSession?.duration || 0);
      }, 0)
    };
  }, [currentDate, acuteDates, games]);

  const handleDayChange = useCallback(
    (isNextDay: boolean) => {
      setCurrentDate((prev) => {
        const dayFromArrIndex = isNextDay
          ? acuteDates.indexOf(prev.format(FORMAT_WEEK)) + 1
          : acuteDates.indexOf(prev.format(FORMAT_WEEK)) - 1;

        return moment(acuteDates[dayFromArrIndex]);
      });
    },
    [acuteDates]
  );

  const formattedStartDate = currentDate.format(FORMAT_DAY_MONTH);

  const renderHeader = () => {
    return (
      <Card style={styles.headerCard}>
        <View style={styles.dateEditorContainer}>
          <Pressable
            onPress={() => !dateNavDisabled.prev && handleDayChange(false)}
            style={styles.buttonPadding}
          >
            <Icon
              icon="arrow_left_weekly_load"
              style={{
                color: dateNavDisabled.prev
                  ? variables.lightGrey
                  : variables.red
              }}
            />
          </Pressable>
          <View>
            <Text style={styles.dateEditorMainDate}>{formattedStartDate}</Text>
          </View>
          <Pressable
            onPress={() => !dateNavDisabled.next && handleDayChange(true)}
            style={styles.buttonPadding}
          >
            <Icon
              icon="arrow_right_weekly_load"
              style={
                dateNavDisabled.next
                  ? { fill: variables.lightGrey }
                  : { fill: variables.red }
              }
            />
          </Pressable>
        </View>
      </Card>
    );
  };

  const renderCardHeader = () => {
    return (
      <View style={styles.cardHeader}>
        <View>
          <View style={styles.legendContainer}>
            <View
              style={[
                styles.legendBar,
                {
                  backgroundColor: variables.textBlack
                }
              ]}
            />
            <Text style={styles.legendSubText}>
              Acute : Chronic Workload Ratio
            </Text>
          </View>
          <View style={styles.legendContainer}>
            <View
              style={[
                styles.legendBar,
                {
                  backgroundColor: variables.gradientGreen
                }
              ]}
            />
            <Text style={styles.legendSubText}>
              Optimal Acute : Chronic Workload Ratio (0.75 - 1.25)
            </Text>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.legendSubText}>
            <Text style={styles.legendText}>Acute : </Text>Chronic
          </Text>

          <Text style={styles.legendSubText}>
            <Text style={styles.legendText}>(7 days avg.) </Text>(28 days avg.)
          </Text>
        </View>
      </View>
    );
  };

  const renderSinglePlayerHeader = () => {
    return (
      <View style={styles.singlePlayerHeaderContainer}>
        <Text style={styles.singlePlayerHeaderText}>
          Acute : chronic player load
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AcuteExplanationModal')}
        >
          <Icon icon="info_icon" style={styles.infoIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPlayersHeader = () => {
    return (
      <TouchableOpacity
        style={styles.infoContainer}
        onPress={() => navigation.navigate('AcuteExplanationModal')}
      >
        <Icon icon="info_icon" style={styles.infoIcon} />
      </TouchableOpacity>
    );
  };

  const dayDifference = moment(currentDate).diff(
    moment(firstFinishedEventDate),
    'days'
  );
  const acuteDivider = dayDifference > 7 ? 7 : dayDifference;
  const chronicDivider = dayDifference > 28 ? 28 : dayDifference;

  const renderSinglePlayerAcuteRow = () => {
    if (!playerId || !playersLoad.acutePlayerLoad[playerId]) {
      return null;
    }
    return (
      <AcuteChronicRow
        key={playerId}
        currentLoad={
          (playersLoad.acutePlayerLoad[playerId].totalLoad || 1) / acuteDivider
        }
        prevLoad={
          (playersLoad.chronicPlayerLoad[playerId].totalLoad || 1) /
          chronicDivider
        }
        player={allPlayers.find((p) => p.id === playerId)!}
      />
    );
  };

  const renderPlayersAcuteRows = () => {
    return Object.keys(playersLoad.acutePlayerLoad).map((playerId) => {
      return (
        <AcuteChronicRow
          key={playerId}
          currentLoad={
            (playersLoad.acutePlayerLoad[playerId].totalLoad || 1) /
            (acuteDivider || 1)
          }
          prevLoad={
            (playersLoad.chronicPlayerLoad[playerId].totalLoad || 1) /
            (chronicDivider || 1)
          }
          player={allPlayers.find((p) => p.id === playerId)!}
        />
      );
    });
  };

  return (
    <View style={[styles.container, playerId ? { marginBottom: 25 } : {}]}>
      {!playerId && <WeeklyLoadHeader title="Acute : Chronic Player Load" />}
      <View style={[styles.contentContainer, playerId ? { padding: 10 } : {}]}>
        {!playerId && renderHeader()}
        <Card
          style={StyleSheet.flatten([
            styles.cardStyle,
            playerId ? { borderRadius: 0 } : {}
          ])}
        >
          {playerId ? renderSinglePlayerHeader() : renderPlayersHeader()}

          {renderCardHeader()}
          <View style={styles.chartLabels}>
            {listItems.map((_, i) => (
              <Text
                key={i}
                style={[
                  styles.chartLabel,
                  {
                    position: 'absolute',
                    left: i * (CELL_WIDTH + 2)
                  }
                ]}
              >
                {i === 0 ? 0 : (i * 0.1).toFixed(2)}
              </Text>
            ))}
          </View>
          <ScrollView>
            {playerId ? renderSinglePlayerAcuteRow() : renderPlayersAcuteRows()}
          </ScrollView>
        </Card>
      </View>
    </View>
  );
};

export default AcuteChronic;

const styles = StyleSheet.create({
  buttonPadding: {
    padding: 7
  },
  cardHeader: {
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between'
  },
  cardStyle: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: ACUTE_CHRONIC_OPTIONS.CARD_PADDING,
    paddingVertical: 34
  },
  chartLabel: {
    color: variables.chartLightGrey,
    fontSize: 10
  },
  chartLabels: {
    flexDirection: 'row',
    marginBottom: 15,
    marginLeft: -5
  },
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    padding: ACUTE_CHRONIC_OPTIONS.CONTAINER_PADDING
  },
  dateEditorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: 150
  },
  dateEditorMainDate: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 20,
    textAlign: 'center'
  },
  headerCard: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
    paddingHorizontal: 50,
    paddingVertical: 15
  },
  infoContainer: { position: 'absolute', right: 20, top: 20 },
  infoIcon: {
    color: variables.lighterGrey,
    fill: 'currentColor',
    marginLeft: 10
  },
  legendBar: {
    borderRadius: 20,
    height: 3,
    marginRight: 5,
    width: 12
  },
  legendContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  legendSubText: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  legendText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 12
  },
  singlePlayerHeaderContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  singlePlayerHeaderText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 14,
    textTransform: 'uppercase'
  }
});
