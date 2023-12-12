import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { selectAllPlayers } from '../../../redux/slices/playersSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import { MODAL_HEADING_LEGEND } from '../types';

interface Props {
  children: React.ReactNode;
  heading: string;
  headingLegend?: string;
  selectedPlayers?: {
    [key: string]: boolean;
  };
  includeExcludePress?: (status: boolean) => void;
}

const BoxWrapper = ({
  children,
  heading,
  headingLegend = '',
  selectedPlayers = {},
  includeExcludePress
}: Props) => {
  const allPlayers = useAppSelector(selectAllPlayers);

  const renderHeading = () => {
    if (headingLegend === MODAL_HEADING_LEGEND.number_of_players) {
      return (
        <View style={styles.legendContainer}>
          <MaterialCommunityIcons
            name="account-supervisor-circle-outline"
            size={21}
            color="black"
          />
          <Text style={styles.legendText}>
            {Object.values(selectedPlayers).filter((player) => player).length} /{' '}
            {allPlayers.length}
          </Text>
        </View>
      );
    }
    if (headingLegend === MODAL_HEADING_LEGEND.include_exclude) {
      return (
        <View style={styles.legendContainer}>
          <TouchableOpacity
            onPress={() => includeExcludePress && includeExcludePress(true)}
          >
            <Text style={styles.includeExcludeText}>Include all</Text>
          </TouchableOpacity>
          <Text style={styles.includeExcludeSeparator}>|</Text>
          <TouchableOpacity
            onPress={() => includeExcludePress && includeExcludePress(false)}
          >
            <Text style={styles.includeExcludeText}>Exclude all</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.headerContainer}>
        {<Text style={styles.headerText}>{heading}</Text>}
        {headingLegend && renderHeading()}
      </View>
      {children}
    </View>
  );
};

export default BoxWrapper;

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    marginBottom: 14,
    paddingHorizontal: 27,
    paddingVertical: 34
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24
  },
  includeExcludeSeparator: {
    fontFamily: variables.mainFontBold,
    fontSize: 12,
    marginHorizontal: 8
  },
  includeExcludeText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    textDecorationLine: 'underline',
    textTransform: 'uppercase'
  },
  legendContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  legendText: {
    fontFamily: variables.mainFont,
    fontSize: 16,
    marginLeft: 5
  }
});
