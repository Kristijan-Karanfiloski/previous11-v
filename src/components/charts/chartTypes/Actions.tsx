import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IntensityZones } from '../../../../types';
import { variables } from '../../../utils/mixins';

interface Props {
  data: IntensityZones | undefined;
  compareData: IntensityZones | undefined;
  isDontCompare: boolean;
}

const Actions = ({ data, compareData, isDontCompare }: Props) => {
  const calculatePercentage = (value: number, benchmark: number) => {
    return benchmark ? ((value || 0) / benchmark) * 100 : 0;
  };

  const totalActions =
    (data?.explosive || 0) + (data?.veryHigh || 0) + (data?.high || 0);
  const totalActionsBenchmark =
    (compareData?.explosive || 0) +
    (compareData?.veryHigh || 0) +
    (compareData?.high || 0);

  const renderDataContainer = (
    label: string,
    key: string,
    textStyle?: object
  ) => {
    const value =
      key === 'total' ? totalActions : data?.[key as keyof IntensityZones] || 0;
    const benchmarkValue =
      key === 'total'
        ? totalActionsBenchmark
        : compareData?.[key as keyof IntensityZones] || 0;

    return (
      <View style={styles.dataContainer} key={key}>
        <Text style={styles.dataText}>{label}</Text>
        <View style={styles.numberContainer}>
          <Text style={StyleSheet.flatten([styles.dataNumber, textStyle])}>
            {value}
          </Text>
          {!isDontCompare && (
            <>
              <Text style={styles.borderline}>|</Text>
              <Text style={styles.benchmarkNumber}>{benchmarkValue}</Text>
            </>
          )}
        </View>
        {!isDontCompare && (
          <Text style={styles.dataPercentage}>
            {calculatePercentage(value, benchmarkValue || 0)}%
          </Text>
        )}
      </View>
    );
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.mainContainer,
        { height: isDontCompare ? 66 : 96 }
      ])}
    >
      {renderDataContainer('Total', 'total')}
      {renderDataContainer('Explosive', 'explosive', styles.textExplosive)}
      {renderDataContainer('Very High', 'veryHigh', styles.textVeryhigh)}
      {renderDataContainer('High', 'high', styles.textHigh)}
    </View>
  );
};

export default Actions;

const styles = StyleSheet.create({
  benchmarkNumber: {
    color: variables.greyC3,
    fontFamily: variables.mainFont,
    fontSize: 30
  },
  borderline: {
    color: variables.greyC3,
    marginHorizontal: 7
  },
  dataContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between',
    width: '20%'
  },
  dataNumber: {
    fontFamily: variables.mainFontMedium,
    fontSize: 30
  },
  dataPercentage: {
    fontFamily: variables.mainFontMedium,
    fontSize: 14
  },
  dataText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 12
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    paddingHorizontal: '10%'
  },
  numberContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  textExplosive: {
    color: variables.chartExplosive
  },
  textHigh: {
    color: variables.chartHigh
  },
  textVeryhigh: {
    color: variables.chartVeryHigh
  }
});
