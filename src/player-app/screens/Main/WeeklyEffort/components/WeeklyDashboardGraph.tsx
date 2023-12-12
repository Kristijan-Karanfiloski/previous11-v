import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LinearGradientView from '../../../../../components/LinearGradientView';
import { variables } from '../../../../../utils/mixins';
import { WeeklyEffortData } from '../../../../heleprs';

type Props = {
  data: { [n: string]: WeeklyEffortData };
};

const WeeklyDashboardGraph = ({ data }: Props) => {
  const renderLines = () => {
    const lines = [];
    let num = 0;
    while (num < 5) {
      lines.push(<View key={num} style={styles.line}></View>);
      num++;
    }
    return lines;
  };

  const getHighestLoad = () => {
    let highestLoad = 0;
    Object.keys(data).forEach((key) => {
      const load = data[key].totalWeeklyLoad;
      if (load > highestLoad) {
        highestLoad = load;
      }
    });

    return highestLoad;
  };

  const renderGraphs = () => {
    const highestLoad = getHighestLoad();

    return Object.keys(data)
      .filter((key) => data[key].weekIndex < 3)
      .map((key) => {
        const isCurrentWeek = data[key].weekIndex === 0;
        const percent = (data[key].totalWeeklyLoad / highestLoad) * 100;
        return (
          <LinearGradientView
            linearGradient={{ y2: '100%' }}
            colors={[
              {
                offset: 0,
                color: isCurrentWeek ? '#FFA658' : variables.chartLightGrey
              },
              {
                offset: 1,
                color: isCurrentWeek ? '#E5004D' : variables.chartLightGrey
              }
            ]}
            key={key}
            style={{
              ...styles.graph,
              height: `${percent}%`
            }}
          ></LinearGradientView>
        );
      });
  };

  const renderAverageLine = () => {
    const highestLoad = getHighestLoad();
    const bottomPercentage = (data[0].benchmark / highestLoad) * 100;
    return (
      <View
        style={{ ...styles.averageLine, bottom: `${bottomPercentage}%` }}
      ></View>
    );
  };

  return (
    <View>
      <View style={styles.box}>
        {renderLines()}
        <View style={styles.graphsContainer}>{renderGraphs()}</View>
        {renderAverageLine()}
      </View>
      <View style={styles.labels}>
        <View style={styles.label}>
          <View style={styles.labelIcon1}></View>
          <Text style={styles.labelText}>12 week avg.</Text>
        </View>
        <View style={styles.label}>
          <LinearGradientView
            linearGradient={{ y2: '100%' }}
            style={styles.labelIcon2}
            colors={[
              { offset: 0, color: '#FFA658' },
              { offset: 1, color: '#E5004D' }
            ]}
          ></LinearGradientView>
          <Text style={styles.labelText}>This week</Text>
        </View>
        <View style={styles.label}>
          <View
            style={{
              ...styles.labelIcon2,
              backgroundColor: variables.chartLightGrey
            }}
          ></View>
          <Text style={styles.labelText}>Past weeks</Text>
        </View>
      </View>
    </View>
  );
};

export default WeeklyDashboardGraph;

const styles = StyleSheet.create({
  averageLine: {
    backgroundColor: '#58FFAE',
    height: 4,
    position: 'absolute',
    width: '100%'
  },
  box: {
    borderColor: variables.lighterGrey,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 125,
    justifyContent: 'space-between',
    marginBottom: 16,
    marginLeft: 'auto',
    width: 160
  },
  graph: {
    backgroundColor: variables.chartLightGrey,
    height: '20%',
    width: 30
  },
  graphsContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row-reverse',
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    position: 'absolute',
    width: '100%'
  },
  label: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 12
  },
  labelIcon1: {
    backgroundColor: '#58FFAE',
    height: 2,
    marginRight: 5,
    width: 11
  },
  labelIcon2: {
    height: 11,
    marginRight: 5,
    width: 5
  },
  labelText: {
    fontFamily: variables.mainFontLight,
    fontSize: 10
  },
  labels: { flexDirection: 'row', marginBottom: 25 },
  line: {
    backgroundColor: variables.lighterGrey,
    height: 1,
    width: '100%'
  }
});
