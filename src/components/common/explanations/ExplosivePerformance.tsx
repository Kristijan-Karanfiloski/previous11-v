import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { EXPLOSIVE_PERFORMANCE_EXPLANATION } from '../../../utils/mixins';

import { styles } from './Explanation.style';

interface Props {
  handleInfoModal: () => void;
}

const ExplosivePerformance = ({ handleInfoModal }: Props) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Movements</Text>
        <View style={styles.border} />
        <Text style={styles.text}>{EXPLOSIVE_PERFORMANCE_EXPLANATION}</Text>
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

export default ExplosivePerformance;
