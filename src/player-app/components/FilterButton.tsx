import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { progressFilterState } from '../../redux/slices/progressFilter';
import { useAppSelector } from '../../redux/store';
import { color } from '../../theme';
import { variables } from '../../utils/mixins';

const FilterButton = () => {
  const navigation = useNavigation();
  const progressFilter = useAppSelector(progressFilterState);

  const getFilterNumber = () => {
    if (!progressFilter?.numberOfFilters) return '';
    return `(${progressFilter?.numberOfFilters})`;
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('FilterModal', {
          modal: 'filter'
        })
      }
    >
      <Text style={styles.text}>filter {getFilterNumber()}</Text>
    </Pressable>
  );
};

export default FilterButton;

const styles = StyleSheet.create({
  text: {
    color: color.palette.black,
    fontFamily: variables.mainFontBold,
    fontSize: 14,
    marginRight: 15,
    textTransform: 'uppercase'
  }
});
