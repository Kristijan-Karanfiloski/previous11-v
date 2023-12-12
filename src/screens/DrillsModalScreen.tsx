import React, { useContext, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { DrillsModalType } from '../../types';
import ButtonNew from '../components/common/ButtonNew';
import Card from '../components/common/Card';
import FullScreenDialog from '../components/common/FullScreenDialog';
import { clubFirestoreProps } from '../converters';
import { EventTopics, SocketContext } from '../hooks/socketContext';
import {
  selectActiveClub,
  updateActiveClubAction
} from '../redux/slices/clubsSlice';
import { updateTrackingEvent } from '../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { commonStyles } from '../theme';
import { DrawerStackParamList } from '../types';
import { variables } from '../utils/mixins';

const DrillsModalScreen = () => {
  const route = useRoute() as RouteProp<DrawerStackParamList, 'DrillsModal'>;

  const onSubmitHanlder = route.params.onSubmit;
  const isDrillsModal =
    route.params.type === DrillsModalType.drills ||
    route.params.type === DrillsModalType.manageDrills;
  const { sendEvent } = useContext(SocketContext);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const activeClub = useAppSelector(selectActiveClub);
  const [selectedDrill, setSelectedDrill] = useState<string | null>(null);
  const routes = navigation.getState()?.routes;
  const isPrevRouteLiveView = routes[routes.length - 2].name === 'LiveView';

  const listItems = useMemo(() => {
    return isDrillsModal ? activeClub.drills : activeClub.extraTime;
  }, [activeClub]);

  const onSubmit = (key: keyof clubFirestoreProps, value: any) => {
    return dispatch(updateActiveClubAction({ [key]: value as any }));
  };

  const onStart = () => {
    if (onSubmitHanlder && selectedDrill) {
      onSubmitHanlder(selectedDrill);
    }
    if (isPrevRouteLiveView) {
      sendEvent(EventTopics.DRILL_START, { drillName: selectedDrill });
      dispatch(updateTrackingEvent({ activeDrill: selectedDrill }));
    }
    navigation.goBack();
  };

  const renderDrillItem = (index: number) => {
    return (
      <Pressable
        key={index}
        onPress={() => {
          // remove drill
          Alert.alert(
            `Do you want to delete \n ‘${selectedDrill}‘?`,
            `The ${
              isDrillsModal ? 'drill' : 'extra time'
            } will be removed from your list. Data from previously completed ${
              isDrillsModal ? 'drills' : 'extra times'
            } are still stored.`,
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: 'Delete',
                onPress: () => {
                  onSubmit(
                    isDrillsModal
                      ? DrillsModalType.drills
                      : DrillsModalType.extraTime,
                    listItems?.filter((drill) => drill !== selectedDrill) || []
                  );

                  setSelectedDrill(null);
                }
              }
            ],
            { cancelable: true }
          );
        }}
      >
        <MaterialCommunityIcons
          name="close-circle"
          size={24}
          color={variables.lightGrey}
        />
      </Pressable>
    );
  };

  const generateTitle = () => {
    switch (route?.params?.type) {
      case DrillsModalType.drills:
        return 'Choose Drill';
      case DrillsModalType.extraTime:
        return 'Choose Extra Time';
      case DrillsModalType.manageDrills:
        return 'Manage Drills';
      case DrillsModalType.manageExtraTime:
        return 'Manage Extra Time';
      default:
        return 'Choose Drill';
    }
  };

  const renderSameDrill = () => {
    return Alert.alert(`The Drill you entered already exists`);
  };

  const renderAlertPrompt = () => {
    return Alert.prompt(
      `Enter ${isDrillsModal ? 'Drill Name' : 'Extra Time'}`,
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'destructive'
        },
        {
          text: 'OK',
          onPress: (drillText) => {
            // sorted drills
            if (
              (listItems || []).findIndex((item) => item === drillText) > -1
            ) {
              renderSameDrill();
            } else {
              const sortedDrills = [...(listItems ?? []), drillText];
              onSubmit(
                isDrillsModal
                  ? DrillsModalType.drills
                  : DrillsModalType.extraTime,
                sortedDrills
              );
            }
          }
        }
      ]
    );
  };

  const renderDrills = () => {
    return (listItems || []).map((drill, index) => (
      <View key={index}>
        <View style={styles.container}>
          <View />
          <Pressable onPress={() => setSelectedDrill(drill)}>
            <Text
              style={[
                {
                  textAlign: 'center',
                  fontSize: 16,
                  fontFamily: variables.mainFont
                },
                selectedDrill === drill && {
                  color: variables.red
                }
              ]}
            >
              {drill}
            </Text>
          </Pressable>
          {selectedDrill === drill && !isPrevRouteLiveView
            ? (
                renderDrillItem(index)
              )
            : (
            <View style={{ width: 24, height: 24 }} />
              )}
        </View>
        <View style={commonStyles.sepparator} />
      </View>
    ));
  };

  return (
    <FullScreenDialog>
      <Card
        style={StyleSheet.flatten([
          commonStyles.settingsCardContainer,
          styles.customContainer
        ])}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{generateTitle()}</Text>
          <Pressable
            style={styles.topBtn}
            onPress={() => {
              renderAlertPrompt();
            }}
          >
            <Text style={styles.titleLink}>{`Add New ${
              isDrillsModal ? 'Drill' : 'Timer'
            } +`}</Text>
          </Pressable>
        </View>
        <View style={commonStyles.sepparator} />

        <View style={{ flex: 1 }}>
          <ScrollView style={styles.scrollViewContainer}>
            {renderDrills()}
          </ScrollView>
          <View style={commonStyles.flexRowCenter}>
            <ButtonNew
              onPress={navigation.goBack}
              text={
                isPrevRouteLiveView || !!onSubmitHanlder ? 'Cancel' : 'Close'
              }
              mode="secondary"
              style={{
                marginRight: 10
              }}
            />
            {(isPrevRouteLiveView || !!onSubmitHanlder) && (
              <ButtonNew
                disabled={!selectedDrill}
                onPress={onStart}
                text={
                  isPrevRouteLiveView
                    ? `Start ${isDrillsModal ? 'Drill' : 'Timer'}`
                    : 'OK'
                }
                style={{
                  marginLeft: 10
                }}
              />
            )}
          </View>
        </View>
      </Card>
    </FullScreenDialog>
  );
};

export default DrillsModalScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  customContainer: {
    height: variables.deviceHeight * 0.55,
    width: variables.deviceWidth * 0.75
  },
  scrollViewContainer: {
    marginBottom: 10
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 20
  },
  titleLink: {
    color: variables.red,
    fontFamily: variables.mainFontMedium,
    fontSize: 17,
    marginLeft: 15
  },
  topBtn: {
    position: 'absolute',
    right: 15
  }
});
