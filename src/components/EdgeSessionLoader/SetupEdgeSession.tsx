import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';

import {
  BenchmarkData,
  EventGender,
  GameAny,
  GameType,
  GenderType,
  Player,
  StatsDataNew
} from '../../../types';
import API from '../../helpers/api';
import API_ENDPOINTS from '../../helpers/api_endpoints';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectConfig } from '../../redux/slices/configSlice';
import {
  createGameAction,
  deleteGameAction,
  updateGameAction
} from '../../redux/slices/gamesSlice';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { LoadEdgeSessionsStackParamList } from '../../types';
import {
  formatDateTime,
  getTagsFromMacIds,
  replaceMacIds,
  waitFor
} from '../../utils';
import { utils, variables } from '../../utils/mixins';
import ButtonNew from '../common/ButtonNew';
import Card from '../common/Card';
import DatasetRequestedModal from '../Report/DatasetRequestedModal';

import CancelModal from './CancelModal';
import MarkDrills from './MarkDrills';
import SessionPicker from './SessionPicker';
import SessionPlayerItem from './SessionPlayerItem';

export type MarkedDrill = {
  id: number;
  name: string;
  startTimestamp: number;
  endTimestamp: number;
  locked: boolean;
  deletable: boolean;
  label?: string;
};

export type MarkedPeriod = {
  id: number;
  name: string;
  startTimestamp: number | undefined;
  endTimestamp: number | undefined;
  locked: boolean;
  deletable: boolean;
  label?: string;
};

type PlayerItemSessionData = {
  item: {
    tagId: string;
    duration: number;
    endTimestamp: number;
    load: number;
    load_accum: number;
    startTimestamp: number;
  };
  index: number;
};

type SessionPlayerItemType = Omit<PlayerItemSessionData['item'], 'tagId'>;

type SessionDataType = {
  activityGraph: {
    value: number;
    timestamp: number;
  }[];
  players: Record<string, SessionPlayerItemType>;
  duration: number;
  startTimestamp: number;
  endTimestamp: number;
};

type EventPickerStateType = {
  eventDate: Date;
  trainingCategory: string | number;
  whereIsPlaying: string;
  opponentName: string;
  matchResult: {
    home: string;
    away: string;
  };
};

const headerData = [
  {
    text: 'Tag',
    flex: 0.12
  },
  {
    text: 'Player',
    flex: 0.4
  },
  {
    text: 'Load',
    flex: 0.1
  },
  {
    text: 'Include',
    flex: 0.13
  }
];

const footballPeriods = [
  { name: 'preMatch', label: 'Pre Match' },
  { name: 'firstHalf', label: '1st Half' },
  { name: 'secondHalf', label: '2nd Half' }
];
const hockeyPeriods = [
  { name: 'preMatch', label: 'Pre Match' },
  { name: 'firstPeriod', label: '1st Period' },
  { name: 'secondPeriod', label: '2nd Period' },
  { name: 'thirdPeriod', label: '3rd Period' }
];

const initializePeriods = (periods: { name: string; label: string }[]) => {
  return periods.map((period, index) => {
    return {
      id: index,
      name: period.name,
      startTimestamp: undefined,
      endTimestamp: undefined,
      locked: false,
      deletable: false,
      label: period.label
    } as MarkedPeriod;
  });
};

const SetupEdgeSession = () => {
  const abortController = useRef(false);
  const navigation: any = useNavigation();
  const route = useRoute() as RouteProp<
    LoadEdgeSessionsStackParamList,
    'SetupEdgeSession'
  >;
  const { sessionId, eventType: incomingType, date, event } = route.params;
  const dispatch = useAppDispatch();
  const [sessionData, setSessionData] = useState<SessionDataType | null>(null);
  const activeClub = useAppSelector(selectActiveClub);
  const allPlayers = useAppSelector(selectAllPlayers);
  const config = useAppSelector(selectConfig);
  const isHockey = activeClub.gameType === 'hockey';
  const [drills, setDrills] = useState<MarkedDrill[]>([]);
  const [periods, setPeriods] = useState<MarkedPeriod[]>(
    incomingType === GameType.Match
      ? initializePeriods(isHockey ? hockeyPeriods : footballPeriods)
      : []
  );

  const [fullSession, setFullSession] = useState<MarkedDrill | null>(null);
  const [preGameEvent, setPreGameEvent] = useState<GameAny | null>(null);
  // Session picker state

  const [eventPickerState, setEventPickerState] =
    useState<EventPickerStateType>({
      eventDate: date ? moment(date, 'DD/MM/YYYY').toDate() : new Date(), // Initial value for eventDate
      trainingCategory: 'no_category', // Initial value for trainingCategory
      whereIsPlaying: 'Home', // Initial value for whereIsPlaying
      opponentName: '', // Initial value for opponentName
      matchResult: {
        home: '0',
        away: '0'
      }
    });
  // End session picker state

  const [playersSectionExpanded, setplayersSectionExpanded] = useState(true);
  const [drillsSectionExpanded, setDrillsSectionExpanded] = useState(true);
  const [fetchingReport, setFetchingReport] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  // End animation state
  const [includedPlayers, setIncludedPlayers] = useState<
    Record<
      string,
      {
        id: string;
        included: boolean;
      }
    >
  >({});

  useEffect(() => {
    if (event) {
      const trainingCategory = event.benchmark ? event.benchmark.indicator : '';
      const whereIsPlaying = event.location;
      const opponentName = event.versus || '';

      setEventPickerState((prevState) => ({
        ...prevState,
        whereIsPlaying,
        opponentName,
        trainingCategory
      }));
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      axios
        .get(API_ENDPOINTS.EDGE_SESSION_METADATA(sessionId))
        .then((res) => {
          if (res.data && res.data.data) {
            setSessionData(res.data.data);
            setFullSession({
              startTimestamp: res.data.data.startTimestamp,
              endTimestamp: res.data.data.endTimestamp,
              id: 0,
              name: 'fullSession',
              locked: false,
              deletable: false,
              label: 'Full Session'
            });
          }
        })
        .catch(() => setSessionData(null));
    }
  }, [sessionId]);

  const tagData = useMemo(() => {
    if (!sessionData) return [];
    const macIds = Object.keys(sessionData?.players || {});
    const configTags = config.tags || {};
    const tags = getTagsFromMacIds(macIds, configTags);

    return Object.keys(sessionData?.players || {}).map((key: string) => {
      return {
        macId: key,
        tagId: tags[key]!,
        ...sessionData?.players[key]
      };
    });
  }, [sessionData]);

  useEffect(() => {
    const includedPlayers = tagData.reduce(
      (
        acc: Record<
          string,
          {
            id: string;
            included: boolean;
            macId?: string;
          }
        >,
        tag
      ) => {
        const player = allPlayers.find((pl) => pl.tag === tag.tagId);
        if (player) {
          acc[player.tag] = {
            id: player.id,
            included: true
          };
        }
        return acc;
      },
      {}
    );

    setIncludedPlayers(includedPlayers);
  }, [tagData]);

  const createGameEvent = async () => {
    const gameData: Partial<GameAny> = {
      date: formatDateTime(eventPickerState.eventDate),
      type: incomingType as GameType.Match | GameType.Training,
      preparation: {
        playersInPitch:
          Object.values(includedPlayers)
            .filter((pl) => pl.included)
            .map((pl) => pl.id) || [],
        playersOnBench: allPlayers
          .filter(
            (pl) =>
              !Object.values(includedPlayers)
                .map((pl) => pl.id)
                .includes(pl.id)
          )
          .map(({ id }) => id)
      },
      benchmark: {
        manualIndicator: true,
        indicator: eventPickerState.trainingCategory
      } as any
    };

    if (incomingType === GameType.Training) {
      gameData.manualIndicator = true;
      gameData.benchmark = {
        manualIndicator: true,
        indicator: eventPickerState.trainingCategory
      } as BenchmarkData;
    }

    return dispatch(createGameAction(gameData as GameAny))
      .unwrap()
      .then((game) => {
        return game;
      });
  };

  const onRequestFullReport = async () => {
    const preGameEvent = event || (await createGameEvent());
    const copyEvent = { ...preGameEvent };
    setPreGameEvent(copyEvent);
  };

  useEffect(() => {
    if (preGameEvent) {
      requestFullReport();
    }
  }, [preGameEvent]);

  const requestFullReport = (tries = 0, gameId = undefined) => {
    if (abortController.current) return;
    setFetchingReport(true);
    const macIds = Object.entries(includedPlayers)
      .filter(([, pl]) => pl.included)
      .reduce((acc, [tagId, pl]) => {
        const macId = tagData.find((tag) => tag.tagId === tagId)?.macId;
        const player = allPlayers.find((player) => player.id === pl.id);
        if (macId && player) {
          acc[macId] = {
            id: player.tag,
            name: player.name
          };
        }

        return acc;
      }, {} as any);

    console.log(
      '[REQUEST FULL REPORT]',
      fullSession?.startTimestamp,
      fullSession?.endTimestamp,
      macIds,
      includedPlayers
    );

    API.requestFullReport(
      {
        drills: [...periods, ...drills]
          .filter(
            (drill) =>
              drill.locked && drill.startTimestamp && drill.endTimestamp
          )
          .filter((drill) => drill.name !== 'fullGame')
          .map((drill) => {
            return {
              drillName: drill.name,
              start: drill.startTimestamp! - (fullSession?.startTimestamp || 0),
              end: drill.endTimestamp! - (fullSession?.startTimestamp || 0)
            };
          }),
        hockey: isHockey,
        gameId: preGameEvent?.id,
        fullSession: {
          start: fullSession?.startTimestamp || 0,
          end: fullSession?.endTimestamp || 0
        },
        gender:
          activeClub?.gender === GenderType.Men
            ? EventGender.male
            : EventGender.female,
        gameType: incomingType,
        description: utils.getEventDescription(preGameEvent as GameAny)
          .description,
        players: macIds
      },
      gameId,
      true
    )
      .then(async (resp: any) => {
        console.log(
          'Request full report resp',
          resp.status,
          preGameEvent?.id,
          resp.data
        );
        if (resp.data && resp.data.stats) {
          console.log('[FULL REPORT]', resp.data.stats);
          const reportData = resp.data.stats as StatsDataNew;
          const jsonData = JSON.stringify(reportData);
          const statsDataString = replaceMacIds(
            jsonData,
            config.tags,
            Object.entries(includedPlayers)
              .filter(([, pl]) => pl.included)
              .map(([tagId, pl]) => {
                return {
                  id: pl.id,
                  tag: tagId
                };
              }) as Player[]
          ) as StatsDataNew;

          const copyEvent = { ...preGameEvent } as GameAny & {
            replaceReport?: boolean;
          };

          const UTCdate = moment(
            `${moment(eventPickerState.eventDate).format(
              'YYYY/MM/DD'
            )} ${moment(fullSession?.startTimestamp).format('HH:mm')}`,
            'YYYY/MM/DD hh:mm'
          ).format('YYYY/MM/DD HH:mm');

          copyEvent.UTCdate = UTCdate;

          copyEvent.startTime = formatDateTime(
            moment(fullSession?.startTimestamp || 0).toDate(),
            'HH:mm'
          ).toString();
          copyEvent.endTime = formatDateTime(
            moment(fullSession?.endTimestamp || 0).toDate(),
            'HH:mm'
          ).toString();

          copyEvent.status = {
            startTimestamp: fullSession?.startTimestamp || 0,
            endTimestamp: fullSession?.endTimestamp || 0,
            duration: Math.abs(
              (fullSession?.endTimestamp || 0) -
                (fullSession?.startTimestamp || 0)
            ),
            isFinal: true,
            drills: drills
              .filter((drill) => drill.locked)
              .map((drill) => drill.name),
            isFullReport: true
          };
          if (incomingType === GameType.Match && copyEvent.status) {
            copyEvent.versus = eventPickerState.opponentName;
            copyEvent.location = eventPickerState.whereIsPlaying;

            copyEvent.status.scoreUs = eventPickerState.matchResult.home;
            copyEvent.status.scoreThem = eventPickerState.matchResult.away;
            copyEvent.status.scoreResult =
              eventPickerState.matchResult.home >
              eventPickerState.matchResult.away
                ? 'w'
                : eventPickerState.matchResult.home <
                  eventPickerState.matchResult.away
                  ? 'l'
                  : 'd';
          }
          copyEvent.report = {
            stats: statsDataString,
            timeStamp: resp.data.timestamp
          };
          if (copyEvent.status) {
            copyEvent.status = {
              ...copyEvent.status,
              isFullReport: true
            };
          }

          copyEvent.replaceReport = true;
          dispatch(updateGameAction(copyEvent)).then(() => {
            navigation.replace('Report', { eventId: copyEvent.id });
          });
        } else if (resp.data && resp.data.gameId) {
          console.log('requesting data with game id');

          await waitFor(3500);
          return requestFullReport(tries + 1, resp.data.gameId);
        } else if (
          resp.data.message === 'Report not found' ||
          resp.data.message === 'No mapping file found'
        ) {
          console.log('polling for data with game id');
          await waitFor(3500);
          return requestFullReport(tries + 1, gameId);
        }
      })
      .catch((err: string) => {
        console.log('err1', err);
      });
  };

  const onCancelReport = async () => {
    abortController.current = true;
    if (preGameEvent) {
      await axios
        .get(API_ENDPOINTS.EDGE_CANCEL_FULL_REPORT(preGameEvent.id))
        .catch(() => {});
      if (!event) {
        dispatch(deleteGameAction(preGameEvent));
      }
    }

    setFetchingReport(false);
    setShowCancelModal(false);
  };

  const renderPlayerHeader = () => {
    return (
      <View style={styles.sessionsContainerHeader}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {headerData.map((item, index) => {
            return (
              <Text
                style={[
                  styles.playerHeaderText,
                  {
                    flex: item.flex
                  }
                ]}
                key={index}
              >
                {item.text}
              </Text>
            );
          })}
        </View>

        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: 25
          }}
        >
          {headerData.map((item, index) => {
            return (
              <Text
                style={[
                  styles.playerHeaderText,
                  {
                    flex: item.flex
                  }
                ]}
                key={index}
              >
                {item.text}
              </Text>
            );
          })}
        </View>
      </View>
    );
  };

  const renderPlayerItem = ({ item, index }: PlayerItemSessionData) => {
    return (
      <SessionPlayerItem
        item={item}
        index={index}
        tagData={tagData}
        includedPlayers={includedPlayers}
        setIncludedPlayers={setIncludedPlayers}
      />
    );
  };

  const renderPlayersSection = () => {
    return (
      <Card style={styles.section}>
        <View style={styles.playersHeaderContainer}>
          <Text style={styles.heading}>Choose Players</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5
            }}
          >
            <MaterialCommunityIcons
              name="account-supervisor-circle-outline"
              size={21}
              color="black"
            />

            <Text
              style={{
                fontSize: 16,
                fontFamily: variables.mainFont,
                color: variables.grey
              }}
            >
              {
                Object.values(includedPlayers).filter((pl) => pl.included)
                  .length
              }{' '}
              / {tagData.length}
            </Text>
          </View>
        </View>
        {playersSectionExpanded && (
          <View>
            {renderPlayerHeader()}
            <View
              style={{
                marginTop: 15
              }}
            >
              <FlatList
                nestedScrollEnabled
                keyExtractor={(_, index) => index.toString()}
                style={{
                  maxHeight: 400
                }}
                numColumns={2}
                data={[...tagData]
                  .filter((it) => it.tagId)
                  .sort((a: any, b: any) => a.tagId - b.tagId)}
                renderItem={renderPlayerItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        )}
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              );
              setplayersSectionExpanded(!playersSectionExpanded);
            }}
          >
            <MaterialIcons
              name={
                playersSectionExpanded
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              size={24}
              color={variables.red}
            />
          </Pressable>
        </View>
      </Card>
    );
  };

  const renderMarkDrillsSection = () => {
    return (
      <Card style={styles.section}>
        <View style={styles.playersHeaderContainer}>
          <Text style={styles.heading}>Mark Periods</Text>
        </View>
        {sessionData && fullSession && drillsSectionExpanded && (
          <MarkDrills
            drills={drills}
            setDrills={setDrills}
            periods={periods}
            setPeriods={setPeriods}
            sessionData={sessionData}
            gameType={incomingType}
            fullSession={fullSession}
            setFullSession={setFullSession}
          />
        )}
        <View style={{ alignItems: 'center', gap: 17 }}>
          <Pressable
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              );
              setDrillsSectionExpanded(!drillsSectionExpanded);
            }}
          >
            <MaterialIcons
              name={
                drillsSectionExpanded
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              size={24}
              color={variables.red}
            />
          </Pressable>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {fetchingReport && (
        <DatasetRequestedModal
          buttonText="Cancel"
          onDismiss={() => setShowCancelModal(true)}
          isListingPlayerTags={false}
        />
      )}
      {showCancelModal && (
        <CancelModal
          onCancel={() => setShowCancelModal(false)}
          onSubmit={onCancelReport}
        />
      )}
      <Card style={styles.cardContainer}>
        <View style={styles.headerContainer}>
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={navigation.goBack}
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20
            }}
          >
            <Ionicons name="caret-back-sharp" size={17} color={variables.red} />
          </Pressable>
          <View style={styles.handle} />
          <Pressable onPress={navigation.getParent()?.goBack}>
            <AntDesign name="close" size={21} color={variables.red} />
          </Pressable>
        </View>
      </Card>

      <ScrollView nestedScrollEnabled>
        <SessionPicker
          additionalPickers
          eventType={incomingType}
          data={eventPickerState}
          setData={setEventPickerState}
        />
        {renderPlayersSection()}
        {renderMarkDrillsSection()}
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <ButtonNew
          disabled={
            (incomingType === GameType.Match &&
              eventPickerState.opponentName.length === 0) ||
            !eventPickerState.matchResult.home ||
            !eventPickerState.matchResult.away ||
            (incomingType === GameType.Training &&
              eventPickerState.trainingCategory === '')
          }
          onPress={onRequestFullReport}
          mode="primary"
          text="Generate Report"
          style={{
            height: 40,
            borderRadius: 10
          }}
        />
      </View>
    </View>
  );
};

export default SetupEdgeSession;

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 10
  },
  cardContainer: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 25,
    padding: 20,
    shadowColor: variables.realWhite,
    shadowOpacity: 0.05
  },
  handle: {
    backgroundColor: variables.lightGrey,
    borderRadius: 4,
    height: 5,
    marginBottom: 10,
    width: 70
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  },
  heading: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24
  },

  mainContainer: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    marginTop: 65
  },
  playerHeaderText: {
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  playersHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  section: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    marginBottom: 27,
    marginHorizontal: 21,
    overflow: 'hidden',
    paddingBottom: 10,
    paddingHorizontal: 27,
    paddingTop: 34
  },
  sessionsContainerHeader: {
    borderBottomColor: variables.lineGrey,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 9
  }
});
