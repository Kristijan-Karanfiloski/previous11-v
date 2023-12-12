import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import moment, { Moment } from 'moment';

import LinearGradientView from '../../../../../../components/LinearGradientView';
import { variables } from '../../../../../../utils/mixins';

const FORMAT_WEEK = 'YYYY/MM/DD';

type AcuteChronicData = {
  date: string;
  acuteLoad: number;
  chronicLoad: number;
  acuteChronicRatio: number;
};

interface Props {
  calculationLoad: AcuteChronicData[];
  currentDate: Moment;
}

const AcuteChronicChart = ({ calculationLoad, currentDate }: Props) => {
  const renderVerticalLine = (index: number) => {
    return (
      <Svg
        key={index}
        height="100%"
        width="100%"
        style={[
          styles.verticalLines,
          {
            left: `${100 - index * 10}%`
          }
        ]}
      >
        <Line
          stroke={variables.chartLightGrey}
          strokeWidth={1.5}
          x1="0"
          y1="0"
          x2="0"
          y2="100%"
        />
      </Svg>
    );
  };

  const renderLinearBackground = () => {
    return (
      <LinearGradientView
        linearGradient={{ x1: '0%', y1: '0%', x2: '100%', y2: '0%' }}
        colors={[
          { offset: 0, color: '#88FF9A', opacity: 0.3 },
          { offset: 0.33, color: '#88FF9A', opacity: 0.5 },
          { offset: 0.66, color: '#88FF9A', opacity: 0.5 },
          { offset: 1, color: '#88FF9A', opacity: 0.3 }
        ]}
        style={{ position: 'absolute', height: 50, width: '100%', bottom: 75 }}
        rectOpacity={0.5}
      />
    );
  };

  const renderChartBox = (data: AcuteChronicData, index: number) => {
    const height = data.acuteChronicRatio * 100;
    const isLineVisible = index * 10 - 1.6 > -1.6 && index * 10 - 1.6 < 98.4;
    if (!data.date) {
      return null;
    }

    return (
      <React.Fragment key={`${index}+${height}`}>
        {isLineVisible && renderVerticalLine(index)}
        {height < 125 && height > 75
          ? (
          <LinearGradientView
            index={index}
            linearGradient={{ y2: '100%' }}
            colors={[
              { offset: 0, color: '#58FFAE' },
              { offset: 1, color: '#DBFF76' }
            ]}
            style={StyleSheet.flatten([
              styles.chartBox,
              {
                right: `${index * 10 - 1.6}%`,
                height: height > 200 ? 200 : height,
                zIndex: 2
              }
            ])}
          />
            )
          : (
          <View
            style={StyleSheet.flatten([
              styles.chartBoxOutsideRange,
              {
                right: `${index * 10 - 1.6}%`,
                height: height > 200 ? 200 : height,
                zIndex: 2
              }
            ])}
          ></View>
            )}
      </React.Fragment>
    );
  };

  const renderLegendItem = (item: AcuteChronicData, index: number) => {
    const isTodayDate =
      moment(item.date).format(FORMAT_WEEK) === currentDate.format(FORMAT_WEEK);
    if (!item.date) {
      return null;
    }
    return (
      <View
        key={index}
        style={StyleSheet.flatten([
          { right: `${index * 10 - 1}%` },
          styles.chartLegend
        ])}
      >
        <Text
          style={StyleSheet.flatten([
            styles.legendText,
            {
              fontFamily: isTodayDate
                ? variables.mainFontBold
                : variables.mainFont,
              color: isTodayDate ? variables.red : variables.textBlack
            }
          ])}
        >
          {moment(item.date, FORMAT_WEEK).format('DD/MM')}
        </Text>
      </View>
    );
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.leftLegendContainer}>
          <Text style={styles.leftLegendText}>2.00</Text>
          <Text style={styles.leftLegendText}>1.00</Text>
          <Text style={styles.leftLegendText}>0</Text>
        </View>
        <View style={styles.chartContainer}>
          {renderLinearBackground()}
          {calculationLoad
            .filter((item) => item.date !== '')
            .reverse()
            .map((data, index) => {
              return renderChartBox(data, index);
            })}
        </View>
      </View>
      <View style={styles.chartLegendContainer}>
        {calculationLoad
          .filter((item) => item.date !== '')
          .reverse()
          .map((item, index) => {
            return renderLegendItem(item, index);
          })}
      </View>
    </>
  );
};

export default AcuteChronicChart;

const styles = StyleSheet.create({
  chartBox: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    bottom: 0,
    position: 'absolute',
    width: 10
  },
  chartBoxOutsideRange: {
    backgroundColor: variables.black,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    bottom: 0,
    position: 'absolute',
    width: 10
  },
  chartContainer: {
    borderColor: variables.chartLightGrey,
    borderWidth: 0.8,
    height: 200,
    width: '88%'
  },
  chartLegend: {
    bottom: 25,
    position: 'absolute'
  },
  chartLegendContainer: {
    flexDirection: 'row',
    height: 50,
    marginLeft: '12%',
    paddingRight: 10,
    width: '88%'
  },
  leftLegendContainer: {
    alignItems: 'flex-end',
    height: 200,
    justifyContent: 'space-between',
    marginTop: 4,
    paddingRight: 4,
    width: '10%'
  },
  leftLegendText: {
    fontFamily: variables.mainFont,
    fontSize: 10
  },
  legendText: {
    fontSize: 10,
    transform: [{ rotate: '-45deg' }]
  },
  mainContainer: {
    flexDirection: 'row',
    height: 200,
    justifyContent: 'space-between',
    paddingRight: 10,
    width: '100%'
  },
  verticalLines: {
    position: 'absolute',
    top: 0
  }
});
