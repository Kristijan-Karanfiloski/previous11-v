import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import {
  removeActiveClub,
  selectActiveClub
} from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { OnboardingStackParamList } from '../../../types';
import { variables } from '../../../utils/mixins';
import Button from '../../common/Button';
import { Icon } from '../../icon/icon';

interface OnboardingNavigatorProps {
  text: string;
  hasSkipButton?: boolean;
  mainButtonHandler?: () => void;
  showAddPlayerModal?: () => void;
  activeBubble?: number;
  hasSecondaryButton?: boolean;
  hasFinishButton?: boolean;
  disableMainButton?: boolean;
  hideMainButton?: boolean;
  hasCustomHeight?: boolean;
}

const OnboardingNavigator = ({
  text,
  hasSkipButton,
  mainButtonHandler,
  activeBubble,
  showAddPlayerModal,
  hasSecondaryButton = false,
  hasFinishButton = false,
  disableMainButton = false,
  hideMainButton = false,
  hasCustomHeight = false
}: OnboardingNavigatorProps) => {
  const club = useAppSelector(selectActiveClub);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute() as RouteProp<
    OnboardingStackParamList,
    | 'OnboardInvitePlayers'
    | 'OnboardingSteps'
    | 'OnboardingInfo'
    | 'OnboardingEvents'
  >;

  const handleNextOnboardingStep = () => {
    if (mainButtonHandler) return mainButtonHandler();

    if (showAddPlayerModal) return showAddPlayerModal();

    if (!club.gender) {
      return alert(
        'Please add the gender of your team before continuing to next step.'
      );
    }

    return navigation.navigate('OnboardingSteps', { recurringEvent: '' });
  };

  const goToFinishedScreen = () => {
    navigation.navigate('FinishedInvitePlayersScreen');
  };

  const handleGoBack = () => {
    if (route.name === 'OnboardingSteps') {
      dispatch(removeActiveClub());
    }

    navigation.goBack();
  };

  const onSkipHandler = () => {
    navigation.navigate('OnboardingSteps', { recurringEvent: 'skipped' });
  };

  return (
    <View
      style={[
        styles.onboardNavigationBox,
        hasCustomHeight ? styles.hasCustomContainer : {}
      ]}
    >
      <Text
        style={[
          styles.onboardNavigationText,
          hasCustomHeight && styles.hasCustomMargin
        ]}
      >
        {text}
      </Text>
      <View style={styles.onboardButtonContainer}>
        {hasFinishButton && (
          <Button
            mode="outline"
            marginStyle={{ margin: 10 }}
            content="Done"
            onPressed={goToFinishedScreen}
            customStyle={{ padding: 20 }}
          />
        )}
        {hasSecondaryButton && (
          <Button
            mode="outline"
            marginStyle={{ margin: 10 }}
            content="Done"
            onPressed={handleNextOnboardingStep}
            customStyle={{ padding: 20 }}
          />
        )}
        {!hideMainButton && (
          <Button
            content={
              route.name === 'OnboardInvitePlayers' ? 'Add Player' : 'Save'
            }
            marginStyle={{ margin: 10 }}
            onPressed={handleNextOnboardingStep}
            disabled={disableMainButton}
          />
        )}
      </View>
      {activeBubble && (
        <View style={styles.navBubbleContainer}>
          <View
            style={[
              styles.navBubble,
              styles.navBubbleMargin,
              activeBubble === 1 && styles.activeNavBubble
            ]}
          />
          <View
            style={[
              styles.navBubble,
              styles.navBubbleMargin,
              activeBubble === 2 && styles.activeNavBubble
            ]}
          />
          <View style={styles.navBubble} />
        </View>
      )}
      <View style={styles.onboardBackButton}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.onboardBackButton}
        >
          <Icon icon="arrow_left" />
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
      {hasSkipButton && (
        <View style={styles.onboardSkipButton}>
          <TouchableOpacity
            onPress={onSkipHandler}
            style={styles.onboardSkipButton}
          >
            <Text>Skip</Text>
            <Icon
              icon="arrow_left"
              containerStyle={{
                transform: [
                  {
                    rotate: '180deg'
                  }
                ]
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OnboardingNavigator;

const styles = StyleSheet.create({
  activeNavBubble: {
    backgroundColor: '#686868',
    height: 10,
    width: 23
  },
  hasCustomContainer: {
    height: 200,
    paddingVertical: 20
  },
  hasCustomMargin: {
    marginBottom: 15
  },
  navBubble: {
    backgroundColor: '#9899A0',
    borderRadius: 10,
    height: 10,
    width: 10
  },
  navBubbleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 30,
    justifyContent: 'center',
    marginTop: 10,
    width: 100
  },
  navBubbleMargin: {
    marginRight: 10
  },
  onboardBackButton: {
    alignItems: 'center',
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 20,
    position: 'absolute',
    width: 50
  },
  onboardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  onboardNavigationBox: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    borderBottomColor: variables.red,
    borderBottomWidth: 9,
    bottom: 0,
    height: 250,
    paddingVertical: 40,
    position: 'absolute',
    width: '100%'
  },
  onboardNavigationText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    marginBottom: 37,
    textAlign: 'center',
    width: '70%'
  },
  onboardSkipButton: {
    alignItems: 'center',
    bottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 20,
    width: 50
  }
});
