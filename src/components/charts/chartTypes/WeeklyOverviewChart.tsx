import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import _ from 'lodash';
import moment from 'moment';

import { WeeklyOverview } from '../../../../types';
import {
  DOTTED_LINES_CHARTS,
  variables,
  WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR
} from '../../../utils/mixins';

interface Props {
  data: WeeklyOverview;
  activeSelector: {
    label: string;
    color: string;
    key: string;
    aboveAverageColor: string;
    sort?: number;
  };
}

const WeeklyOverviewChart = ({ data, activeSelector }: Props) => {
  const [pressedData, setPressedData] = useState<number | null>(null);

  const maxValue = useMemo(() => {
    return _.max(
      data.map((item) => {
        if (activeSelector.key === WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[0].key) {
          return item.load;
        }
        if (activeSelector.key === WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[1].key) {
          return item.explosive;
        }
        if (activeSelector.key === WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[2].key) {
          return item.veryHigh;
        }

        return item.high;
      })
    );
  }, [activeSelector.key, data]);

  useEffect(() => {
    setPressedData(null);
  }, [activeSelector.key]);

  const factor =
    (maxValue || 1) / 5 < 1
      ? (maxValue || 1) / 5
      : Math.round((maxValue || 1) / 5);
  const horizontalPercentage = 100 / 14;
  const verticalPercentage = 100 / ((maxValue || 1) + factor);

  const getValue = (item: {
    load: any;
    explosive: any;
    veryHigh: any;
    high: any;
    date?: any;
    indicator?: number | string | null;
  }) => {
    if (activeSelector.key === WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[0].key) {
      return item.load;
    } else {
      switch (activeSelector.key) {
        case WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[1].key:
          return item.explosive;
        case WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[2].key:
          return item.veryHigh;
        case WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR[3].key:
          return item.high;
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      {data.map((game, index) => {
        const weekDay = moment(game.date, 'YYYY/MM/DD').isoWeekday();
        let positionIndex = (weekDay - 1) * 2 + 0.1;
        if (index !== 0 && game.date === data[index - 1].date) {
          positionIndex = positionIndex + 1;
        }
        const value = getValue(game);
        return (
          <React.Fragment key={index}>
            <Pressable
              onPress={() => {
                if (index === pressedData) {
                  setPressedData(null);
                } else setPressedData(index);
              }}
              key={index}
              style={{
                bottom: 0,
                position: 'absolute',
                backgroundColor: activeSelector.color,
                height: `${value * verticalPercentage - 1}%`,
                width: `${horizontalPercentage * 0.8}%`,
                left: `${horizontalPercentage * positionIndex}%`
              }}
            />
            {pressedData === index && (
              <>
                <Text
                  ellipsizeMode="clip"
                  numberOfLines={1}
                  style={[
                    styles.horizontalLine,
                    { bottom: `${value * verticalPercentage - 5}%` }
                  ]}
                >
                  {DOTTED_LINES_CHARTS}
                </Text>
                <Text
                  style={[
                    styles.valueNumber,
                    {
                      bottom: `${value * verticalPercentage - 2}%`
                    }
                  ]}
                >
                  {Math.round(value)}
                </Text>
              </>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

export default WeeklyOverviewChart;

const styles = StyleSheet.create({
  horizontalLine: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontBold,
    fontSize: 14,
    position: 'absolute',
    zIndex: 1
  },
  mainContainer: {
    height: 250,
    zIndex: 10
  },
  valueNumber: {
    color: variables.black,
    fontFamily: variables.mainFont,
    fontSize: 14,
    position: 'absolute',
    right: 5
  }
});
