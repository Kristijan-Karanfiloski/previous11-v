import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';

import { GameType } from '../../../types';
import API_ENDPOINTS from '../../helpers/api_endpoints';
import { LoadEdgeSessionsStackParamList } from '../../types';
import { utils, variables } from '../../utils/mixins';
import ButtonNew from '../common/ButtonNew';
import Card from '../common/Card';
import OverlayLoader from '../common/OverlayLoader';

import SessionPicker from './SessionPicker';

type SessionItem = {
  id: string;
  start: number;
  duration: number;
  report: boolean;
};

const EdgeSessionLanding = () => {
  const navigation: any = useNavigation();
  const route = useRoute() as RouteProp<
    LoadEdgeSessionsStackParamList,
    'EdgeSessionLanding'
  >;
  const date = route.params?.date;
  const event = route.params?.event;
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [eventType, setEventType] = useState<GameType | null>(
    event ? event.type : null
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      setSessions([]);
      axios
        .get(API_ENDPOINTS.EDGE_LIST_SESSIONS)
        .then((res) => {
          if (res.status === 200 && res.data) {
            setSessions(res.data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
    return unsubscribe;
  }, [navigation]);

  const onSelectEvent = (sessionId: string) => {
    navigation.navigate('SetupEdgeSession', {
      sessionId,
      eventType,
      date,
      event
    });
  };

  const renderSessionsSection = () => {
    if (isLoading) return <OverlayLoader isLoading={isLoading} isOverlay />;
    if (sessions.length === 0) {
      return (
        <Card style={styles.section}>
          <Text style={styles.heading}>No Sessions Found</Text>
          <Text style={styles.subSectionText}>
            It seems that there are no sessions available to load from your Edge
            Device.
          </Text>
        </Card>
      );
    }

    return (
      <Card style={StyleSheet.flatten([styles.section, { flex: 1 }])}>
        <Text style={styles.heading}>Multiple Sessions Found</Text>
        <Text style={styles.subSectionText}>
          Please select the session you wish to load from your Edge device.
        </Text>

        <View style={{ flex: 1 }}>
          <View style={styles.sessionsContainerHeader}>
            <Text style={[styles.headingTitle, { textAlign: 'left' }]}>
              Date
            </Text>
            <Text style={[styles.headingTitle, { textAlign: 'right' }]}>
              Edge start time
            </Text>
            <Text style={[styles.headingTitle, { textAlign: 'right' }]}>
              Session length
            </Text>
            <View style={{ flex: 0.5 }} />
          </View>
          <View
            style={{
              marginTop: 15
            }}
          >
            <ScrollView showsVerticalScrollIndicator>
              {renderSessions()}
            </ScrollView>
          </View>
        </View>
      </Card>
    );
  };

  const renderSessions = useCallback(() => {
    return sessions
      .sort((a: SessionItem, b: SessionItem) => {
        return b.start - a.start;
      })
      .map((session, index) => {
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
              flex: 1
            }}
          >
            <Text style={styles.sessionItemText}>
              {moment(session.start).format('ddd DD/MM')}
            </Text>
            <Text style={[styles.sessionItemText, { textAlign: 'right' }]}>
              {moment(session.start).format('HH:mm')}
            </Text>
            <Text style={[styles.sessionItemText, { textAlign: 'right' }]}>
              {utils.convertMilisecondsToWeeklyLoadTime(session.duration)}
            </Text>

            <View
              style={{
                flex: 0.5,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ButtonNew
                disabled={!eventType}
                onPress={() => onSelectEvent(session.id)}
                mode="primary"
                text="Select"
                style={{
                  height: 40,
                  width: 120,
                  borderRadius: 10
                }}
              />
            </View>
          </View>
        );
      });
  }, [sessions, eventType]);

  return (
    <View style={styles.mainContainer}>
      <Card style={styles.cardContainer}>
        <View style={styles.headerContainer}>
          <Pressable onPress={navigation.goBack} style={styles.closeIcon}>
            <AntDesign name="close" size={21} color={variables.red} />
          </Pressable>
          <View style={styles.handle} />
        </View>
      </Card>
      <SessionPicker
        typePickerDisabled={!!event}
        eventType={eventType}
        onTypeChange={setEventType}
      />

      {renderSessionsSection()}
    </View>
  );
};

export default EdgeSessionLanding;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginBottom: 25,
    padding: 20,
    shadowColor: variables.realWhite,
    shadowOpacity: 0.05
  },
  closeIcon: {
    position: 'absolute',
    right: 0,
    top: -5
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
    justifyContent: 'center'
  },
  heading: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24
  },
  headingTitle: {
    flex: 0.22,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    textAlign: 'center'
  },
  mainContainer: {
    backgroundColor: '#F9F9F9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flex: 1,
    marginTop: 65
  },
  section: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    marginBottom: 27,
    marginHorizontal: 21,
    overflow: 'hidden',
    paddingHorizontal: 27,
    paddingVertical: 34
  },
  sessionItemText: {
    flex: 0.22,
    fontFamily: variables.mainFontLight,
    fontSize: 12,
    textAlign: 'left'
  },
  sessionsContainerHeader: {
    borderBottomColor: variables.lineGrey,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 9
  },
  subSectionText: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 14,
    marginVertical: 20
  }
});
