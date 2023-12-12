import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { BEST_MATCH_EXPLANATION } from '../../../utils/mixins';

import { styles } from './Explanation.style';

interface Props {
  handleInfoModal: () => void;
}

const BestMatch = ({ handleInfoModal }: Props) => {
  const styleNormal = styles.loadMoreText;
  const styleBold = [styles.loadMoreText, styles.loadMoreBoldText];
  return (
    <View style={[styles.mainContainer, styles.mainContainerBestMatch]}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Best Match</Text>
        <View style={styles.border} />

        <View style={styles.loadMoreInnerContainer}>
          {BEST_MATCH_EXPLANATION.map((item, index) => {
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

export default BestMatch;
