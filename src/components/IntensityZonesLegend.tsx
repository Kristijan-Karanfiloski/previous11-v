import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { INTENSITY_ZONES, variables } from '../utils/mixins';

interface IntensityZonesLegendProps {
  inLineTitle?: boolean;
}

export default function IntensityZonesLegend({
  inLineTitle = false
}: IntensityZonesLegendProps) {
  return (
    <View
      style={
        inLineTitle && {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16
        }
      }
    >
      <Text
        style={[
          styles.filtersTitle,
          inLineTitle && { marginBottom: 0, marginRight: 17 }
        ]}
      >
        intensity zones
      </Text>
      <View style={styles.filtersContainer}>
        {INTENSITY_ZONES.map((zone, index) => {
          //   if (removeModerate && index === INTENSITY_ZONES.length - 2) {
          //     return null;
          //   }

          return (
            <View key={index} style={styles.legendContainer}>
              <View
                style={[styles.legendLine, { backgroundColor: zone.color }]}
              />
              <Text style={styles.legendText}>{zone.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  filtersTitle: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 10,
    lineHeight: 12.76,
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  legendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 13
  },
  legendLine: {
    borderRadius: 3,
    height: 3,
    marginRight: 3,
    width: 12
  },
  legendText: {
    fontFamily: variables.mainFont,
    fontSize: 10,
    lineHeight: 12.76
  }
});
