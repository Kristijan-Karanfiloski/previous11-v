import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { Icon } from '../../../components/icon/icon';
import { PlayerMainStackParamList } from '../../../types';
import { variables } from '../../../utils/mixins';
import AcuteChronicTooltip from '../../components/Tooltips/AcuteChronicTooltip';
import IntensityTooltip from '../../components/Tooltips/IntensityTooltip';
import TotalLoadAndSimilarTrainingsTooltip from '../../components/Tooltips/TotalLoadAndSimilarTrainingsTooltip';
import TotalLoadAndWeeklyEffortTooltip from '../../components/Tooltips/TotalLoadAndWeeklyEffortTooltip';
import TotalLoadMatchTooltip from '../../components/Tooltips/TotalLoadMatchTooltip';

const TooltipModal = () => {
  const { params } = useRoute() as RouteProp<
    PlayerMainStackParamList,
    'TooltipModal'
  >;

  const renderModal = () => {
    switch (params.modal) {
      case 'similarTrainings':
        return (
          <TotalLoadAndSimilarTrainingsTooltip tooltipType="similarTrainings" />
        );
      case 'totalLoadTraining':
        return <TotalLoadAndSimilarTrainingsTooltip tooltipType="totalLoad" />;
      case 'totalLoadMatch':
        return <TotalLoadMatchTooltip />;
      case 'intensity':
        return <IntensityTooltip />;
      case 'weeklyEffort':
        return <TotalLoadAndWeeklyEffortTooltip tooltipType="weeklyEffort" />;
      case 'acuteChronic':
        return <AcuteChronicTooltip />;
      default:
        return null;
    }
  };
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.rectangle}></View>
        <Text style={styles.title}>Info</Text>
        <Pressable onPress={navigation.goBack} style={styles.closeIcon}>
          <Icon icon="close_red" />
        </Pressable>
      </View>
      <View>{renderModal()}</View>
    </View>
  );
};

export default TooltipModal;

const styles = StyleSheet.create({
  closeIcon: {
    bottom: 0,
    left: 10,
    position: 'absolute',
    zIndex: 1
  },

  container: {
    backgroundColor: variables.realWhite,
    flex: 1,
    paddingBottom: 120
  },

  header: {
    alignItems: 'center',
    marginBottom: 35,
    paddingTop: 5
  },
  rectangle: {
    backgroundColor: 'rgba(24, 24, 24, 0.24)',
    borderRadius: 10,
    height: 5,
    marginBottom: 18,
    width: 36
  },
  title: {
    color: '#181818',
    fontFamily: variables.mainFontSemiBold,
    fontSize: 17,
    textTransform: 'uppercase'
  }
});
