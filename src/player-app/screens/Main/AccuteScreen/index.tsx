import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { GameType } from '../../../../../types';
import { Icon } from '../../../../components/icon/icon';
import {
  SyncedScrollViewContext,
  syncedScrollViewState
} from '../../../../hooks/SyncedScrollViewContext';
import { selectAuth } from '../../../../redux/slices/authSlice';
import { selectFinishedGamesByPlayer } from '../../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../../redux/store';
import {
  ActivitiesStackParamList,
  ProgressStackParamList
} from '../../../../types';
import { acuteChronicPlayerApp } from '../../../../utils/adapter';
import { utils, variables } from '../../../../utils/mixins';

import Chart from './Chart';
import ListItem from './ListItem';
import { SyncedScrollView } from './SyncedScrollView';

type AccuteData = {
  date: string;
  acuteLoad: number;
  chronicLoad: number;
  acuteChronicRatio: number;
};

const AccuteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute() as RouteProp<
    ProgressStackParamList | ActivitiesStackParamList,
    'Accute'
  >;
  const date = route.params?.date;
  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const games = useAppSelector((state) =>
    selectFinishedGamesByPlayer(state, playerId)
  );

  const dates = games.map((game) => game.date);
  const acuteDates = Array.from(new Set(dates));
  const data = acuteChronicPlayerApp(playerId, acuteDates, false, games).filter(
    ({ date }) => !!date
  );

  const [selectedItem, setSelectedItem] = useState(
    data[data.length - 1] || null
  );

  useEffect(() => {
    if (date) {
      const initialSelectedItem = data.find((item) => item.date === date);
      if (initialSelectedItem) {
        setSelectedItem(initialSelectedItem);
      }
    }
  }, [date]);

  const getType = (item?: AccuteData) => {
    const selItem = item || selectedItem;
    if (!selItem) return '';
    const gameTypesOnSelectedDate = games
      .filter((game) => game.date === selItem.date)
      .map(({ type, benchmark }) => {
        if (type === GameType.Match) {
          return 'Match';
        }
        return utils.getTrainingDescription(benchmark?.indicator || null);
      });

    if (!!item && gameTypesOnSelectedDate.length > 1) return 'Multiple';

    return gameTypesOnSelectedDate.join(', ');
  };

  const renderRow = (item: AccuteData) => {
    const type = getType(item);
    return <ListItem data={item} selectedItem={selectedItem} type={type} />;
  };

  return (
    <SyncedScrollViewContext.Provider value={syncedScrollViewState}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <View style={styles.content}>
            <View style={styles.topContent}>
              <View style={styles.dateWrapper}>
                <Text style={styles.text}>
                  {!!selectedItem &&
                    moment(selectedItem.date, 'YYYY/MM/DD').format('MMMM DD')}
                </Text>
                <View style={styles.divider} />
                <Text numberOfLines={1} style={{ ...styles.text, width: 190 }}>
                  {getType()}
                </Text>
              </View>
              <Pressable
                onPress={() =>
                  navigation.navigate('TooltipModal', {
                    modal: 'acuteChronic'
                  })
                }
              >
                <Icon
                  style={{ color: variables.lighterGrey }}
                  icon="info_icon"
                />
              </Pressable>
            </View>
            <View style={styles.bottomContent}>
              <View style={styles.loadWrapper}>
                <Text style={styles.loadText}>
                  {!!selectedItem && selectedItem.acuteChronicRatio.toFixed(2)}
                </Text>
                <Icon icon="arrow_downward" />
              </View>
              <View style={{}}>
                <View style={styles.infoWrapper}>
                  <Text style={styles.textPrimary}>
                    {!!selectedItem && selectedItem.acuteLoad}
                  </Text>
                  <Text style={styles.text}>
                    Acute <Text style={styles.textSecondary}>(7 day avg.)</Text>
                  </Text>
                </View>
                <View style={styles.infoWrapper}>
                  <Text style={styles.textPrimary}>
                    {' '}
                    {!!selectedItem && selectedItem.chronicLoad}
                  </Text>
                  <Text style={styles.text}>
                    Chronic{' '}
                    <Text style={styles.textSecondary}>(28 day avg.)</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Chart
            data={[...data].reverse()}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.headers}>
            <Text style={[styles.header, styles.column1]}>Date</Text>
            <Text style={[styles.header, styles.column2]}>Type</Text>
            <Text style={[styles.header, styles.column3]}>Acute : Chronic</Text>
            <Text style={[styles.header, styles.column4]}>Ratio</Text>
          </View>

          <SyncedScrollView
            id="1"
            data={[...data].reverse()}
            renderRow={({ item }) => renderRow(item)}
            screenNumber={0}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </SyncedScrollViewContext.Provider>
  );
};

export default AccuteScreen;

const styles = StyleSheet.create({
  bottomContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column1: {
    width: 100
  },
  column2: { flex: 1 },
  column3: { flex: 1, textAlign: 'center' },
  column4: { textAlign: 'right', width: 50 },
  container: { flex: 1 },
  content: {
    paddingLeft: 20,
    paddingRight: 15,
    paddingTop: 15
  },
  dateWrapper: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  divider: {
    backgroundColor: variables.lightGrey,
    height: 10,
    marginHorizontal: 11,
    width: 1
  },
  header: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 10
  },
  headers: {
    flexDirection: 'row',
    marginBottom: 9,
    paddingHorizontal: 16
  },
  infoWrapper: {
    flexDirection: 'row',
    marginBottom: 5
  },
  loadText: {
    fontFamily: variables.mainFontBold,
    fontSize: 55,
    marginRight: 5
  },
  loadWrapper: { alignItems: 'center', flexDirection: 'row' },
  text: {
    color: variables.grey,
    fontFamily: variables.mainFontLight,
    fontSize: 12
  },
  textPrimary: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 12,
    marginRight: 15,
    textAlign: 'right',
    width: 38
  },
  textSecondary: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontLight,
    fontSize: 10
  },
  topContent: { flexDirection: 'row', justifyContent: 'space-between' },
  topSection: {
    backgroundColor: variables.realWhite,
    marginBottom: 15
  }
});
