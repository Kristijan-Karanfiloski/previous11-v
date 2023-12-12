import React from 'react';
import { Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { EXPLANATION_TYPES } from '../../../utils/mixins';
import FullScreenDialog from '../FullScreenDialog';

import Benchmark from './Benchmark';
import BestMatch from './BestMatch';
import ExplosivePerformance from './ExplosivePerformance';
import IntensityZones from './IntensityZones';
import LoadGoal from './LoadGoal';
import PlayerLoad from './PlayerLoad';
import TimeInZone from './TimeInZone';

interface Props {
  isVisible: boolean;
  toggleModal: () => void;
  showModal: string | null;
}

const ExplanationModalContainer = ({
  isVisible,
  toggleModal,
  showModal
}: Props) => {
  const navigation = useNavigation();

  const renderModal = () => {
    switch (showModal) {
      case EXPLANATION_TYPES.intensityZones:
        return <IntensityZones handleInfoModal={toggleModal} />;
      case EXPLANATION_TYPES.movements:
        return <ExplosivePerformance handleInfoModal={toggleModal} />;
      case EXPLANATION_TYPES.bestMatch:
        return <BestMatch handleInfoModal={toggleModal} />;
      case EXPLANATION_TYPES.benchmark:
        return <Benchmark handleInfoModal={toggleModal} />;
      case EXPLANATION_TYPES.loadGoal:
        return <LoadGoal handleInfoModal={toggleModal} />;
      case EXPLANATION_TYPES.timeInZone:
        return <TimeInZone handleInfoModal={toggleModal} />;
      case EXPLANATION_TYPES.playerLoad:
        return <PlayerLoad handleInfoModal={toggleModal} />;
      default:
        return null;
    }
  };

  if (!showModal) {
    return null;
  }

  if (showModal === EXPLANATION_TYPES.rpe) {
    if (isVisible) {
      navigation.navigate('RPEExplanationMoldal');
    }
    return null;
  }

  return (
    <Modal animationType="fade" visible={isVisible} transparent>
      <FullScreenDialog>{renderModal()}</FullScreenDialog>
    </Modal>
  );
};

export default ExplanationModalContainer;
