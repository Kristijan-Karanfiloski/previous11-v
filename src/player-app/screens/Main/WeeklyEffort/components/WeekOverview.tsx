import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { Icon } from '../../../../../components/icon/icon';
import LinearGradientView from '../../../../../components/LinearGradientView';
import { selectActiveClub } from '../../../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../../../redux/store';
import { variables } from '../../../../../utils/mixins';
import { WeeklyEffortData } from '../../../../heleprs';

type Props = {
  data: WeeklyEffortData;
  activeWeek: number;
  onArrowPress: (type: 'prev' | 'next') => void;
};

const BarGraph = ({
  letter,
  load,
  isMatchday,
  highestLoad,
  index
}: {
  letter: string;
  load: number;
  isMatchday: boolean;
  highestLoad: number;
  index: string;
}) => {
  const percentage = (load / highestLoad) * 100 || 0;
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  return (
    <View style={styles.barGraphContainer}>
      {isMatchday && (
        <Icon
          icon={isHockey ? 'icehockey_puck' : 'football'}
          style={styles.matchdayIcon}
        />
      )}
      <View style={styles.barGraph}>
        <LinearGradientView
          index={index}
          linearGradient={{ y2: '100%' }}
          colors={[
            { offset: 0, color: isMatchday ? '#C258FF' : '#58B1FF' },
            { offset: 1, color: isMatchday ? '#654CF4' : '#00E591' }
          ]}
          style={{
            ...styles.barGraphInner,
            height: `${percentage}%`
          }}
        />
      </View>
      <View style={styles.barGraphSeparator}></View>
      <Text style={styles.barGraphText}>{letter}</Text>
    </View>
  );
};

const WeekOverview = ({ data, activeWeek, onArrowPress }: Props) => {
  const getHighestLoadForTheWeek = () => {
    let load = 0;
    (
      Object.keys(data.daysOfWeek) as Array<keyof typeof data.daysOfWeek>
    ).forEach((key) => {
      const dayLoad = data.daysOfWeek[key].load;
      if (dayLoad > load) {
        load = dayLoad;
      }
    });

    return load;
  };

  const highestLoad = getHighestLoadForTheWeek();

  const getTitle = (name: string) => {
    const startDate = name.split('-')[0];
    const endDate = name.split('-')[1];

    const startDateFormated = moment(startDate, 'YYYY/MM/DD').format('D MMM');
    const endDateFormated = moment(endDate, 'YYYY/MM/DD').format('D MMM YYYY');

    return `${startDateFormated} - ${endDateFormated}`;
  };

  return (
    <LinearGradientView
      linearGradient={{ y2: '100%' }}
      colors={[
        { offset: 0, color: data.isInRange ? '#DBFF76' : variables.realWhite },
        { offset: 1, color: data.isInRange ? '#58FFAE' : '#D4E0E1' }
      ]}
      contentStyle={styles.container}
    >
      <Text style={styles.title}>
        {activeWeek === 0 ? 'This Week: ' : ''}
        {getTitle(data.name)}
      </Text>
      <Text style={styles.loadText}>{data.totalWeeklyLoad}</Text>
      <Text style={styles.description}>{data.description}</Text>
      <View style={{ flexDirection: 'row' }}>
        {(
          Object.keys(data.daysOfWeek) as Array<keyof typeof data.daysOfWeek>
        ).map((key, i) => {
          const nameOfDay = key;
          const load = data.daysOfWeek[key].load;

          return (
            <BarGraph
              key={i}
              index={`${activeWeek}${i}`}
              letter={nameOfDay[0].toUpperCase()}
              load={load}
              isMatchday={data.daysOfWeek[key].isMatchday}
              highestLoad={highestLoad}
            />
          );
        })}
      </View>

      <View style={styles.arrowsContainer}>
        <Pressable
          onPress={() => onArrowPress('prev')}
          disabled={activeWeek === 11}
        >
          <Icon
            icon="arrow_next"
            style={{
              color:
                activeWeek === 11 ? 'rgba(0,0,0,0.3)' : variables.textBlack,
              transform: [{ rotate: '180deg' }]
            }}
          />
        </Pressable>
        <Text style={styles.arrowText}>Use arrows to change week</Text>
        <Pressable
          onPress={() => onArrowPress('next')}
          disabled={activeWeek === 0}
        >
          <Icon
            icon="arrow_next"
            style={{
              color: activeWeek === 0 ? 'rgba(0,0,0,0.3)' : variables.textBlack
            }}
          />
        </Pressable>
      </View>
    </LinearGradientView>
  );
};

export default WeekOverview;

const styles = StyleSheet.create({
  arrowText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontLight,
    fontSize: 10
  },
  arrowsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40
  },
  barGraph: {
    height: 75,
    justifyContent: 'flex-end',
    width: 11
  },
  barGraphContainer: { alignItems: 'center', marginRight: 18 },
  barGraphInner: {
    backgroundColor: variables.realWhite,
    width: 11
  },
  barGraphSeparator: {
    backgroundColor: 'black',
    height: 2,
    marginTop: 4,
    width: 11
  },
  barGraphText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    marginTop: 1
  },
  container: {
    paddingBottom: 18,
    paddingHorizontal: 25,
    paddingTop: 64
  },
  description: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 14,
    height: 56,
    marginBottom: 28
  },
  loadText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 55,
    marginBottom: 13
  },
  matchdayIcon: {
    color: 'black',
    height: 16,
    left: -10,
    position: 'absolute',
    top: -22
  },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 16,
    marginBottom: 17
  }
});
