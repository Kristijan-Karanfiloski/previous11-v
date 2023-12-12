import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { BENCHMARK_EXPLANATION } from '../../../utils/mixins';

import { styles } from './Explanation.style';

interface Props {
  handleInfoModal: () => void;
}

const Benchmark = ({ handleInfoModal }: Props) => {
  const styleNormal = styles.loadMoreText;
  const styleBold = [styles.loadMoreText, styles.loadMoreBoldText];
  return (
    <View style={[styles.mainContainer, styles.mainContainerLoadData]}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Benchmark</Text>
        <View style={styles.border} />

        <View style={styles.loadMoreInnerContainer}>
          {BENCHMARK_EXPLANATION.map((item, index) => {
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

export default Benchmark;
