import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { TIME_IN_ZONE_EXPLANATION } from '../../../utils/mixins';

import { styles } from './Explanation.style';

interface Props {
  handleInfoModal: () => void;
}

const TimeInZone = ({ handleInfoModal }: Props) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Time in Zone</Text>
        <View style={styles.border} />
        <Text style={styles.text}>{TIME_IN_ZONE_EXPLANATION}</Text>
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

export default TimeInZone;
