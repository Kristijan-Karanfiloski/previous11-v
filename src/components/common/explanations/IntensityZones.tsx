import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import {
  INTENSITY_ZONES_EXPLANATION,
  INTENSITY_ZONES_EXPLANATION_HOCKEY
} from '../../../utils/mixins';

import { styles } from './Explanation.style';

interface Props {
  handleInfoModal: () => void;
}

const IntensityZones = ({ handleInfoModal }: Props) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';

  const styleNormal = styles.loadMoreText;
  const styleBold = [styles.loadMoreText, styles.loadMoreBoldText];
  return (
    <View style={[styles.mainContainer, styles.mainContainerIntensityZones]}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Intensity Zones</Text>
        <View style={styles.border} />
        <View style={styles.loadMoreInnerContainer}>
          {(isHockey
            ? INTENSITY_ZONES_EXPLANATION_HOCKEY
            : INTENSITY_ZONES_EXPLANATION
          ).map((item, index) => {
            return (
              <Text key={index} style={item.style ? styleBold : styleNormal}>
                {item.text}
              </Text>
            );
          })}
        </View>
        <View style={styles.border} />
        <TouchableOpacity
          onPress={handleInfoModal}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IntensityZones;
