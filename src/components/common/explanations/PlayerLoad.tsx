import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import formula from '../../../assets/images/formula.png';
import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import {
  PLAYER_LOAD_EXPLANATION,
  PLAYER_LOAD_EXPLANATION_HOCKEY
} from '../../../utils/mixins';

import { styles } from './Explanation.style';

interface Props {
  handleInfoModal: () => void;
}

const PlayerLoad = ({ handleInfoModal }: Props) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';

  const styleNormal = styles.loadMoreText;
  const styleBold = [styles.loadMoreText, styles.loadMoreBoldText];
  return (
    <View style={[styles.mainContainer, styles.mainContainerPlayerLoad]}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Player Load</Text>
        <View style={styles.border} />
        <View style={styles.loadMoreInnerContainer}>
          {(isHockey
            ? PLAYER_LOAD_EXPLANATION_HOCKEY
            : PLAYER_LOAD_EXPLANATION
          ).map((item, index) => {
            if (item.image) {
              return (
                <Image
                  key={index}
                  source={formula}
                  style={styles.formulaImage}
                  resizeMode={'stretch'}
                />
              );
            }
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

export default PlayerLoad;
