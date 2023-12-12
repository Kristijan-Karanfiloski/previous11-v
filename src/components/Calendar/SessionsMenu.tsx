import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Pressable,
  SectionList,
  SectionListData,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

import { GameAny, GameType } from '../../../types';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectAllGames } from '../../redux/slices/gamesSlice';
import { useAppSelector } from '../../redux/store';
import { DrawerStackParamList, SlideInSubPageRef } from '../../types';
import { utils, variables } from '../../utils/mixins';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import FullScreenDialog from '../common/FullScreenDialog';
import OverlayLoader from '../common/OverlayLoader';
import SlideInSubPage from '../common/SlideInSubPage';
import LeftIndicator from '../EventCard/LeftIndicator';
import { Icon } from '../icon/icon';

const SessionsMenu = () => {
  const route = useRoute() as RouteProp<DrawerStackParamList, 'SessionsMenu'>;
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const sectionListRef = useRef<SectionList>(null);
  const navigation = useNavigation();
  const pageRef = React.useRef<SlideInSubPageRef | null>(null);
  const games = useAppSelector(selectAllGames);
  const [listRendered, setListRendered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState('all');

  const getGames = useCallback(() => {
    const date = route.params?.initialDate
      ? moment(route.params?.initialDate).format('YYYY/MM/DD')
      : moment().format('YYYY/MM/DD');
    const gameDates = games.map(({ date }) => date);
    const gameOnDateExist = gameDates.indexOf(date) !== -1;
    let indexOfLastGameOnDate = gameOnDateExist
      ? gameDates.lastIndexOf(date)
      : -1;

    if (!gameOnDateExist) {
      const pastGames = gameDates.filter((gameDate) =>
        moment(gameDate, 'YYYY/MM/DD').isBefore(moment(date, 'YYYY/MM/DD'))
      );
      const pastGameDate = pastGames[pastGames.length - 1];
      indexOfLastGameOnDate = gameDates.lastIndexOf(pastGameDate);
    }

    if (indexOfLastGameOnDate < 0) {
      return [];
    }

    const firstGameDate = games[indexOfLastGameOnDate - 20]?.date;
    const indexOfFirstGame = firstGameDate
      ? gameDates.indexOf(firstGameDate)
      : 0;

    const playerGames = [...games].slice(
      indexOfFirstGame,
      indexOfLastGameOnDate + 1
    );
    return [...playerGames].reverse();
  }, [games, route.params?.initialDate]);

  useEffect(() => {
    if (listRendered) {
      setTimeout(() => setIsLoading(false), 200);
    }
  }, [listRendered]);

  const sections = useMemo(() => {
    const games =
      filterValue !== 'all'
        ? getGames().filter((game) => game.type === filterValue)
        : getGames();

    const sections = games.reduce((acc: Record<string, GameAny[]>, game) => {
      const key = game.date;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(game);
      return acc;
    }, {});

    return Object.keys(sections).map((key) => ({
      title: key,
      data: sections[key]
    }));
  }, [filterValue, getGames, games]);

  useEffect(() => {
    if (sectionListRef.current && listRendered) {
      const date = route.params?.initialDate
        ? route.params?.initialDate
        : moment().format('YYYY/MM/DD');
      const sectionIndex = sections.map((sec) => sec.title).indexOf(date);

      sectionListRef.current?.scrollToLocation({
        sectionIndex: sectionIndex < 0 ? 0 : sectionIndex,
        itemIndex: 1,
        animated: false
      });
    }
  }, [sectionListRef.current, listRendered, sections]);

  const renderItemDescription = (event: GameAny) => {
    const { type, UTCdate, date, status, versus, benchmark, startTime } = event;

    const isMatch = type === GameType.Match;
    const { date: eventDate, dateFormat } = utils.checkAndFormatUtcDate(
      UTCdate,
      date,
      startTime
    );
    const isPast = moment(eventDate, dateFormat).isBefore(moment());
    const isFinal = status?.isFinal;

    const textStyle =
      isPast && !isFinal
        ? { color: variables.grey2, fontFamily: variables.mainFont }
        : !isPast && !isFinal
            ? { color: variables.black, fontFamily: variables.mainFont }
            : {};

    if (isMatch) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.itemDescTextTertiary, ...textStyle }}>
            vs.{' '}
          </Text>
          <Text
            numberOfLines={1}
            style={{ ...styles.itemDescText, ...textStyle, flex: 1 }}
          >
            {versus}
          </Text>
        </View>
      );
    }

    let desc = '';
    if (
      typeof benchmark?.indicator === 'number' &&
      isFinite(benchmark.indicator)
    ) {
      const trainingCategorySign = benchmark.indicator > 0 ? '+' : '';
      desc =
        benchmark.indicator === 0
          ? 'MD Training'
          : `${trainingCategorySign}${benchmark.indicator} Training`;
    }

    if (typeof benchmark?.indicator === 'string') {
      desc = utils.getTrainingTitleFromString(benchmark.indicator);
    }

    return <Text style={{ ...styles.itemDescText, ...textStyle }}>{desc}</Text>;
  };

  const renderItem = ({ item, index }: { item: GameAny; index: number }) => {
    const { type, status, UTCdate, date, report, startTime } = item;
    const isMatch = type === GameType.Match;
    const isFinal = status?.isFinal;
    const { date: eventDate, dateFormat } = utils.checkAndFormatUtcDate(
      UTCdate,
      date,
      startTime
    );
    const isPast = moment(eventDate, dateFormat).isBefore(moment());
    const totalLoad = report?.stats?.team?.fullSession?.playerLoad?.total;

    const icon = isHockey
      ? isMatch
        ? 'icehockey_puck'
        : 'skate'
      : isMatch
        ? 'football'
        : 'footballBoot';

    const isLast =
      (sections.find((sec) => sec.title === item.date)?.data.length || 0) -
        1 ===
      index;

    const handlePress = () => {
      navigation.navigate('EventDetailsModal', {
        event: item,
        closePrevRoute: true
      });
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.itemContainer, isLast && styles.itemContainerLastItem]}
      >
        <View style={styles.itemIndicator}>
          {(isPast || isFinal) && (
            <LeftIndicator event={item} customStyle={styles.itemIndicator} />
          )}
        </View>

        <View
          style={[
            styles.itemIconContainer,
            !isFinal && !isPast && { backgroundColor: 'transparent' }
          ]}
        >
          <Icon
            style={{
              color:
                isPast && !isFinal ? variables.chartLightGrey : variables.black,
              fill:
                isPast && !isFinal ? variables.chartLightGrey : variables.black
            }}
            icon={icon}
          />
        </View>
        <View style={styles.itemContent}>
          <View
            style={{
              ...styles.itemDescSection,
              justifyContent: !isFinal ? 'center' : 'flex-start'
            }}
          >
            {renderItemDescription(item)}
            {isFinal && (
              <Text style={styles.itemDescSubText}>
                {Math.ceil((utils.getEventDuration(item) || 1) / 1000 / 60)} min
              </Text>
            )}
          </View>
          <View style={styles.itemLoadSection}>
            <Text style={styles.itemLoadText}>
              {isFinal ? 'Total Load' : ''}
            </Text>
            {isFinal && (
              <Text style={styles.itemLoadSubText}>
                {Math.round(totalLoad || 0)}
              </Text>
            )}
          </View>

          <Text style={styles.itemTimeText}>
            {moment(eventDate, dateFormat).format('HH:mm')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({
    section: { title }
  }: {
    section: SectionListData<GameAny>;
  }) => {
    const text = moment(title, 'YYYY/MM/DD').format('dddd D. MMMM');
    const isToday = title === moment().format('YYYY/MM/DD');

    return (
      <View style={styles.sectionHeader}>
        <Text
          style={{
            ...styles.sectionHeaderText,
            color: isToday ? variables.red : variables.textBlack
          }}
        >
          {text}
        </Text>
      </View>
    );
  };

  const onTodayPress = () => {
    if (sectionListRef.current && !isLoading) {
      const date = moment().format('YYYY/MM/DD');
      const sectionIndex = sections.map((sec) => sec.title).indexOf(date);

      sectionListRef.current?.scrollToLocation({
        sectionIndex: sectionIndex < 0 ? 0 : sectionIndex,
        itemIndex: 1,
        animated: false
      });
    }
  };

  const isTodayButtonDisabled = () => {
    const titles = sections.map(({ title }) => title);
    return !titles.includes(moment().format('YYYY/MM/DD'));
  };

  return (
    <FullScreenDialog
      style={styles.container}
      onDismiss={() => {
        pageRef.current?.pageClose();
      }}
    >
      <View style={styles.menu}>
        <SlideInSubPage ref={pageRef} onClose={navigation.goBack}>
          <View style={{ flex: 1, backgroundColor: variables.realWhite }}>
            <View style={styles.menuHeader}>
              <Button
                disabled={isTodayButtonDisabled()}
                customStyle={{ marginRight: 27 }}
                content="Today"
                mode="white"
                onPressed={onTodayPress}
              />
              <View style={{ width: 120 }}>
                <Dropdown
                  uiType="two"
                  placeholder="Select event type"
                  value={filterValue}
                  options={[
                    { label: 'See All', value: 'all' },
                    { label: 'Matches', value: GameType.Match },
                    { label: 'Trainings', value: GameType.Training }
                  ]}
                  onChange={(value) => {
                    if (isLoading) return;
                    setFilterValue(value);
                  }}
                  preventUnselect
                  dropdownHeight={120}
                />
              </View>
              <Pressable
                style={styles.list}
                onPress={() =>
                  navigation.navigate('CreateEventModal', {
                    closePrevRoute: true
                  })
                }
              >
                <Icon icon="plus" style={{ color: variables.red }} />
              </Pressable>
              <Pressable onPress={() => pageRef.current?.pageClose()}>
                <Icon icon="menu_opened" />
              </Pressable>
            </View>
            <View style={styles.content}>
              {sections.length === 0 && (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No Sessions</Text>
                </View>
              )}
              {isLoading && sections.length > 0 && (
                <View style={styles.loadingOverlay}>
                  <OverlayLoader
                    isLoading
                    isOverlay={false}
                    color={variables.grey2}
                  />
                </View>
              )}
              {sections.length > 0 && (
                <SectionList
                  ref={sectionListRef}
                  keyExtractor={(_, index) => index.toString()}
                  sections={sections}
                  renderItem={renderItem}
                  renderSectionHeader={renderSectionHeader}
                  onScrollToIndexFailed={(e) => console.log('error', e)}
                  initialNumToRender={10000}
                  onLayout={() => setTimeout(() => setListRendered(true), 200)}
                  contentContainerStyle={styles.sectionList}
                />
              )}
            </View>
          </View>
        </SlideInSubPage>
      </View>
      {/* </View> */}
    </FullScreenDialog>
  );
};

export default SessionsMenu;

const styles = StyleSheet.create({
  container: {
    alignItems: undefined
  },
  content: {
    flex: 1
  },
  itemContainer: {
    flexDirection: 'row',
    height: 44,
    marginBottom: 7,
    marginTop: 7
  },
  itemContainerLastItem: {
    borderBottomWidth: 1,
    borderColor: '#E1E1E1',
    height: 64,
    paddingBottom: 20
  },
  itemContent: { flexDirection: 'row', flex: 1, paddingTop: 3 },
  itemDescSection: { flex: 1 },
  itemDescSubText: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 11
  },
  itemDescText: {
    fontFamily: variables.mainFontBold,
    fontSize: 14,
    marginBottom: 3,
    paddingRight: 8
  },
  itemDescTextTertiary: {
    fontFamily: variables.mainFont
  },
  itemIconContainer: {
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    height: '100%',
    justifyContent: 'center',
    marginRight: 11,
    width: 40
  },
  itemIndicator: {
    borderRadius: 5,
    height: '100%',
    width: 5
  },
  itemLoadSection: { paddingTop: 2 },
  itemLoadSubText: {
    fontFamily: variables.mainFontBold,
    fontSize: 14,
    marginTop: 3,
    textAlign: 'center'
  },
  itemLoadText: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 11
  },
  itemTimeText: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 11,
    marginLeft: 45,
    paddingTop: 2,
    textAlign: 'right',
    width: 35
  },
  list: { marginHorizontal: 24 },
  loadingOverlay: {
    backgroundColor: variables.realWhite,
    height: '100%',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1
  },
  menu: {
    height: variables.deviceHeight - 88,
    position: 'absolute',
    right: 0,
    top: 88,
    width: 395
  },
  menuHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E1E1E1',
    flexDirection: 'row',
    height: 88,
    justifyContent: 'flex-end',
    marginRight: 24
  },
  noDataContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  noDataText: { fontFamily: variables.mainFont },
  sectionHeader: {
    backgroundColor: variables.realWhite,
    height: 44,
    justifyContent: 'flex-end'
  },
  sectionHeaderText: {
    fontFamily: variables.mainFontMedium,
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  sectionList: { paddingBottom: 15, paddingHorizontal: 23 }
});
