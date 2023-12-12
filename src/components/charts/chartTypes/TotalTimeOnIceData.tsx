import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TimeOnIce } from '../../../../types';
import { utils, variables } from '../../../utils/mixins';

interface Props {
  data: TimeOnIce;
}

const TotalTimeOnIceData = ({ data }: Props) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Number of shifts</Text>
        <Text style={styles.dataText}>{data.series.length}</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.headerText}>Average ice time</Text>
        <Text style={styles.dataText}>
          {utils.convertMilisecondsToTime(data.avg * 1000)}
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.headerText}>longest</Text>
        <Text style={styles.dataText}>
          {utils.convertMilisecondsToTime(data.max * 1000)}
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.headerText}>shortest</Text>
        <Text style={styles.dataText}>
          {utils.convertMilisecondsToTime(data.min * 1000)}
        </Text>
      </View>
    </View>
  );
};

export default TotalTimeOnIceData;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%'
  },
  dataText: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 32,
    marginTop: 12
  },
  headerText: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 14,
    textTransform: 'uppercase'
  },
  mainContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    marginTop: -15
  }
});
