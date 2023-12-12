import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GameType } from '../../../../types';
import { selectTrackingEvent } from '../../../redux/slices/trackingEventSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import Card from '../../common/Card';
import FullScreenDialog from '../../common/FullScreenDialog';
import EndLiveEventStepOne from '../EndLiveEventModal/EndLiveEventStepOne';
import EndLiveEventStepThree from '../EndLiveEventModal/EndLiveEventStepThree';
import EndLiveEventStepTwo from '../EndLiveEventModal/EndLiveEventStepTwo';

type Step = 1 | 2 | 3;
const EndLiveEventModal = () => {
  const [step, setStep] = useState<Step>(1);
  const activeEvent = useAppSelector(selectTrackingEvent);
  const isMatch = activeEvent?.type === GameType.Match;
  const getTitle = (step: Step) => {
    switch (step) {
      case 1:
        return 'Do you want to end tracking this session?';
      case 2:
      case 3:
        return 'We are fetching the last data from your tags';
    }
  };

  const renderEndEventFlow = () => {
    if (step === 2) {
      if (isMatch) {
        return <EndLiveEventStepThree next={() => setStep(3)} />;
      }
      return <EndLiveEventStepTwo next={() => setStep(3)} />;
    }
    if (step > 2) {
      return <EndLiveEventStepTwo next={() => setStep(3)} />;
    }
  };

  console.log('step', step);

  return (
    <FullScreenDialog style={styles.modalContainer}>
      <Card>
        <View style={styles.container}>
          <View style={styles.header}>
            {/* <View style={styles.steps}>
              <View style={[styles.dot, step === 1 && styles.dotActive]}></View>
              <View style={[styles.dot, step === 2 && styles.dotActive]}></View>
              <View style={[styles.dot, step === 3 && styles.dotActive]}></View>
            </View> */}
            {((!isMatch && step === 2) || (isMatch && step === 3)) && (
              <MaterialCommunityIcons
                name="sync"
                size={27}
                color={variables.red}
              />
            )}
            <Text style={styles.title}>{getTitle(step)}</Text>
          </View>
          {step === 1 && <EndLiveEventStepOne next={() => setStep(2)} />}
          {renderEndEventFlow()}
          {/* {step === 3 && <EndLiveEventStepTwo next={() => setStep(3)} />}
          {isMatch && step === 2 && (
            <EndLiveEventStepThree next={() => setStep(3)} />
          )} */}
        </View>
      </Card>
    </FullScreenDialog>
  );
};

export default EndLiveEventModal;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 45,
    paddingHorizontal: 50,
    paddingTop: 20,
    width: 485
  },

  header: {
    alignItems: 'center',
    borderBottomColor: variables.lightestGrey,
    borderBottomWidth: 1
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginBottom: 18,
    marginTop: 20,
    textAlign: 'center'
  }
});
