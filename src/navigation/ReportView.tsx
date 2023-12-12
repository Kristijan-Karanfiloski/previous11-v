import React, { useContext, useEffect, useRef, useState } from 'react';
import Modal from 'react-native-modal';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { EventGender, GameAny, GenderType, StatsDataNew } from '../../types';
import Card from '../components/common/Card';
import IncompleteDatasetAlert from '../components/common/explanations/IncompleteDataset';
import Header from '../components/common/Header';
import WrongDurationModal from '../components/common/Modals/WrongDurationModal';
import DatasetImportedModal from '../components/Report/DatasetImportedModal';
import DatasetRequestedModal from '../components/Report/DatasetRequestedModal';
import TeamReport from '../components/Report/TeamReport';
import PlayerStatsView from '../components/StatsScreens/PlayerStatsView';
import API from '../helpers/api';
import { SocketContext } from '../hooks/socketContext';
import { selectActiveClub } from '../redux/slices/clubsSlice';
import { selectConfig } from '../redux/slices/configSlice';
import { selectGameById, updateGameAction } from '../redux/slices/gamesSlice';
import { selectAllPlayers } from '../redux/slices/playersSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { ReportStackParamList, RootStackParamList } from '../types';
import { replaceMacIds, waitFor } from '../utils';
import { utils } from '../utils/mixins';

const ReportViewStack = createNativeStackNavigator<ReportStackParamList>();

const ReportView = () => {
  const route = useRoute() as RouteProp<RootStackParamList, 'Report'>;
  const navigation = useNavigation();
  const abortController = useRef(false);
  const { eventId, wasPrevRouteLive } = route.params;
  const { edgeConnected } = useContext(SocketContext);
  const activeClub = useAppSelector(selectActiveClub);
  const event = useAppSelector((state) => selectGameById(state, eventId));
  const [showDataImportModal, setShowDataImportModal] = useState(false);
  const [showDataRequestedModal, setShowDataRequestedModal] = useState(false);
  const [showIncompleteDatasetModal, setShowIncompleteDatasetModal] =
    useState(false);
  const [showWrongDurationModal, setShowWrongDurationModal] = useState(false);
  const [waitingFullReport, setWaitingFullReport] = useState(false);
  const [newEndTimestamp, setNewEndTimestamp] = useState<number | null>(null);
  const players = useAppSelector(selectAllPlayers);
  const config = useAppSelector(selectConfig);

  const dispatch = useAppDispatch();
  const isHockey = activeClub.gameType === 'hockey';

  const checkSessionEnd = () => {
    const eventSeries =
      event?.report?.stats?.team?.fullSession?.playerLoad?.series || [];
    if (event && eventSeries.length) {
      const eventDuration = event.status?.duration || 0;
      const lastSerieTime = eventSeries[eventSeries.length - 1].timestamp;
      return eventDuration - lastSerieTime > 300000;
    }
    return false;
  };

  const handleNewEndTimestamp = (endTimestamp: number) => {
    setNewEndTimestamp(endTimestamp);
  };

  useEffect(() => {
    return () => {
      abortController.current = true;
    };
  }, []);

  useEffect(() => {
    if (event && !event?.status?.isFullReport && edgeConnected) {
      if (wasPrevRouteLive) {
        if (checkSessionEnd()) {
          setShowWrongDurationModal(true);
        } else {
          setShowDataRequestedModal(true);
          setWaitingFullReport(true);
          requestFullReport();
        }
      } else {
        // delay to show the modal after the screen is mounted
        if (!checkSessionEnd()) {
          setTimeout(() => {
            setShowIncompleteDatasetModal(true);
          }, 1000);
        } else {
          setShowWrongDurationModal(true);
        }
      }
    }
  }, [event?.id]);

  useEffect(() => {
    if (newEndTimestamp) {
      onConfirmNewEndTimestamp();
    }
  }, [newEndTimestamp]);

  const onConfirmNewEndTimestamp = () => {
    setShowIncompleteDatasetModal(false);
    setWaitingFullReport(true);
    setShowWrongDurationModal(false);
    requestFullReport();
  };

  const requestFullReport = (gameId?: string, tries = 0) => {
    if (abortController.current) return;
    if (!event) return;
    const drills = event?.report?.stats.team?.drills || {};
    API.requestFullReport(
      {
        drills: [
          ...Object.keys(drills)
            .filter((drill) => drill !== 'fullGame')
            .map((drill) => {
              return {
                drillName: drill,
                start: drills[drill].startTimestamp,
                end: drills[drill].endTimestamp
              };
            })
        ],
        hockey: isHockey,
        gameId: event.id,
        fullSession: {
          start: event.status?.startTimestamp || 0,
          end: newEndTimestamp || event.status?.endTimestamp || 0
        },
        gender:
          activeClub?.gender === GenderType.Men
            ? EventGender.male
            : EventGender.female,
        gameType: event.type,
        description: utils.getEventDescription(event).description
      },
      gameId
    )
      .then(async (resp) => {
        console.log('Request full report resp', resp.data);
        if (resp.data && resp.data.stats) {
          // report fetched
          console.log('report fetched');
          const reportData = resp.data.stats as StatsDataNew;
          const jsonData = JSON.stringify(reportData);
          const statsDataString = replaceMacIds(
            jsonData,
            config.tags,
            players
          ) as StatsDataNew;
          const copyEvent = { ...event } as GameAny & {
            replaceReport?: boolean;
          };
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
          setWaitingFullReport(false);
          copyEvent.replaceReport = true;
          dispatch(updateGameAction(copyEvent)).then(() =>
            setShowDataImportModal(true)
          );
        } else if (resp.data && resp.data.gameId) {
          console.log('requesting data with game id');

          await waitFor(3500);
          return requestFullReport(resp.data.gameId, tries + 1);
        } else if (resp.data.message === 'Report not found' && gameId) {
          console.log('polling for data with game id', gameId);
          await waitFor(3500);
          return requestFullReport(gameId, tries + 1);
        }
      })
      .catch((err) => {
        console.log('err1', err);
      });
  };

  const renderDataImportedModal = () => {
    return (
      <Modal
        style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}
        isVisible={showDataImportModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        <Card
          style={{
            alignItems: 'center',
            paddingHorizontal: 28,
            paddingVertical: 30,
            width: 485
          }}
        >
          <DatasetImportedModal onClick={() => setShowDataImportModal(false)} />
        </Card>
      </Modal>
    );
  };

  const renderDataRequestModal = () => {
    return (
      showDataRequestedModal && (
        <DatasetRequestedModal
          onDismiss={() => setShowDataRequestedModal(false)}
        />
      )
    );
  };

  const renderIncompleteDatasetModal = () => {
    if (!showIncompleteDatasetModal || !event) return null;

    return (
      <IncompleteDatasetAlert
        onDismiss={() => setShowIncompleteDatasetModal(false)}
        onConfirm={() => {
          setShowIncompleteDatasetModal(false);
          setWaitingFullReport(true);
          requestFullReport();
        }}
        event={event}
      />
    );
  };

  const renderWrongDurationModal = () => {
    if (!event) return null;
    if (!showWrongDurationModal) return null;
    return (
      <WrongDurationModal
        event={event}
        handleNewEndTimestamp={handleNewEndTimestamp}
      />
    );
  };

  if (!event) return null;

  return (
    <React.Fragment>
      {renderDataImportedModal()}
      {renderDataRequestModal()}
      {renderIncompleteDatasetModal()}
      {renderWrongDurationModal()}
      <ReportViewStack.Navigator
        initialRouteName="TeamReport"
        screenOptions={{
          headerShown: true,
          header: () => (
            <Header
              onRequestFullReport={() => {
                if (!edgeConnected) {
                  return navigation.navigate('LostConnectionModal', {
                    isStartingEvent: true,
                    presentational: true
                  });
                }
                if (checkSessionEnd()) {
                  setShowWrongDurationModal(true);
                } else {
                  setShowIncompleteDatasetModal(true);
                }
              }}
              isWaitingFullReport={waitingFullReport}
            />
          )
        }}
      >
        <ReportViewStack.Screen
          initialParams={{ eventId }}
          name="TeamReport"
          component={TeamReport}
        />
        <ReportViewStack.Screen
          initialParams={{ eventId }}
          name="PlayerReport"
          component={PlayerStatsView}
        />
      </ReportViewStack.Navigator>
    </React.Fragment>
  );
};

export default ReportView;
