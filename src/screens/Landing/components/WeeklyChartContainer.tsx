import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { Icon } from '../../../components/icon/icon';
import LinearGradientView from '../../../components/LinearGradientView';
import {
  gradientColorsMatch,
  gradientColorsTraining,
  variables
} from '../../../utils/mixins';

import WeeklyChart from './WeeklyChart';

const WeeklyChartContainer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.legendContainer}>
        <Text style={styles.headingText}>Weekly Load</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LandingExplanationModal');
          }}
        >
          <Icon
            icon="info_icon"
            style={{
              color: variables.lighterGrey,
              fill: 'currentColor',
              marginLeft: 10
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.legendSubContainer}>
          <LinearGradientView
            colors={gradientColorsTraining}
            linearGradient={{ y2: '100%' }}
            style={styles.gradientContainer}
          />
          <Text style={styles.legendText}>Training Load</Text>
        </View>
        <View style={styles.legendSubContainer}>
          <LinearGradientView
            colors={gradientColorsMatch}
            linearGradient={{ y2: '100%' }}
            style={styles.gradientContainer}
          />
          <Text style={styles.legendText}>Match Load</Text>
        </View>
      </View>
      <WeeklyChart />
    </View>
  );
};

export default WeeklyChartContainer;

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 500,
    height: 8,
    marginRight: 8,
    width: 8
  },
  headingText: {
    fontFamily: variables.mainFont,
    fontSize: 24
  },
  legendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5
  },
  legendSubContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 15
  },
  legendText: {
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  mainContainer: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    height: 390,
    marginHorizontal: 15,
    marginVertical: 7,
    padding: 30
  }
});
