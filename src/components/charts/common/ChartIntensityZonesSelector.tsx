import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import moment from 'moment';

import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { ZoneSelector } from '../../../types';
import {
  PLAYER_LIST_CHART_ZONE_SELECTOR,
  PLAYER_LIST_CHART_ZONE_SELECTOR_HOCKEY,
  TYPE_OF_ZONE_SELECTOR,
  variables,
  WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR
} from '../../../utils/mixins';
import { Icon } from '../../icon/icon';

type ChartIntensityZonesSelectorProps = {
  type: string;
  activeSelector: {
    label: string;
    color: string;
    key: string;
    aboveAverageColor: string;
    sort?: number;
  };
  onSelectHandler: (zone: ZoneSelector) => void;
  onMonthChangeHandler: (indicator?: boolean) => void;
  eventDate: string;
};

const ChartIntensityZonesSelector = ({
  type,
  activeSelector,
  onSelectHandler,
  onMonthChangeHandler,
  eventDate
}: ChartIntensityZonesSelectorProps) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isLowIntensityDisabled = activeClub.lowIntensityDisabled;
  const isModerateIntensityDisabled = activeClub.moderateIntensityDisabled;

  const getPlayerListChartZoneSelectors = (isHockey = false) => {
    const zones = isHockey
      ? PLAYER_LIST_CHART_ZONE_SELECTOR_HOCKEY
      : PLAYER_LIST_CHART_ZONE_SELECTOR;
    return zones.filter(({ key }) => {
      if (key === 'low' && isLowIntensityDisabled) return false;
      if (key === 'moderate' && isModerateIntensityDisabled) return false;
      return true;
    });
  };

  const getListOfZones = () => {
    switch (type) {
      case TYPE_OF_ZONE_SELECTOR.playersList:
        return getPlayerListChartZoneSelectors();
      case TYPE_OF_ZONE_SELECTOR.weeklyOverview:
        return WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR;
      case TYPE_OF_ZONE_SELECTOR.playersHockeyList:
        return getPlayerListChartZoneSelectors(true);
      default:
        return [];
    }
  };

  if (TYPE_OF_ZONE_SELECTOR.pastMatches === type) {
    return (
      <View style={styles.pastMatchesContainer}>
        <TouchableOpacity onPress={() => onMonthChangeHandler(false)}>
          <Icon icon="arrow_next" style={styles.monthArrowLeft} />
        </TouchableOpacity>
        <View>
          <Text style={styles.monthName}>
            {moment(eventDate, 'MM').format('MMMM YYYY')}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onMonthChangeHandler()}>
          <Icon icon="arrow_next" style={styles.monthArrowRight} />
        </TouchableOpacity>
      </View>
    );
  }

  if (TYPE_OF_ZONE_SELECTOR.weeklyOverview === type) {
    return (
      <View style={styles.mainContainer}>
        {getListOfZones().map((zone, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectHandler({ ...zone })}
              style={StyleSheet.flatten([
                styles.zonesButton,
                {
                  backgroundColor:
                    activeSelector.key === zone.key
                      ? zone.color
                      : variables.realWhite,
                  width: `${100 / getListOfZones().length}%`
                }
              ])}
            >
              <View style={styles.zoneButtonContainer}>
                {activeSelector.key === zone.key &&
                activeSelector.sort !== 3
                  ? (
                  <></>
                    )
                  : (
                  <View
                    style={[
                      styles.zoneButtonIcon,
                      { backgroundColor: zone.color }
                    ]}
                  />
                    )}
                <Text
                  style={[
                    styles.zoneButtonText,
                    {
                      color:
                        activeSelector.key === zone.key &&
                        zone.key === PLAYER_LIST_CHART_ZONE_SELECTOR[0].key
                          ? variables.realWhite
                          : variables.textBlack
                    }
                  ]}
                >
                  {zone.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      style={{ width: '100%' }}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.mainContainer}>
        {getListOfZones().map((zone, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (zone.key === activeSelector.key) {
                  return onSelectHandler({
                    ...zone,
                    sort:
                      activeSelector.sort && activeSelector.sort + 1 > 3
                        ? 1
                        : activeSelector.sort && activeSelector.sort + 1
                  });
                }
                onSelectHandler({ ...zone, sort: 1 });
              }}
              style={[
                styles.zonesButton,
                {
                  backgroundColor:
                    activeSelector.key === zone.key
                      ? zone.color
                      : variables.realWhite
                }
              ]}
            >
              <View style={styles.zoneButtonContainer}>
                {activeSelector.key === zone.key &&
                activeSelector.sort !== 3
                  ? (
                  <Icon
                    icon={
                      activeSelector.color === variables.textBlack
                        ? 'arrow_down'
                        : 'arrow_down_black'
                    }
                    style={{ fill: 'white' }}
                    containerStyle={{
                      marginRight: 8,
                      transform: [
                        {
                          rotate: `${
                            activeSelector.sort === 2 ? '0deg' : '180deg'
                          }`
                        }
                      ]
                    }}
                  />
                    )
                  : (
                  <View
                    style={[
                      styles.zoneButtonIcon,
                      { backgroundColor: zone.color }
                    ]}
                  />
                    )}
                <Text
                  style={[
                    styles.zoneButtonText,
                    {
                      color:
                        activeSelector.key === zone.key &&
                        zone.color === variables.textBlack
                          ? variables.realWhite
                          : variables.textBlack
                    }
                  ]}
                >
                  {zone.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ChartIntensityZonesSelector;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 35,
    marginTop: 15,
    width: '100%'
  },
  monthArrowLeft: {
    color: variables.textBlack,
    height: 28,
    transform: [{ rotate: '180deg' }],
    width: 28
  },
  monthArrowRight: {
    color: variables.textBlack,
    height: 28,
    width: 28
  },
  monthName: {
    color: variables.textBlack,
    fontSize: 16
  },
  pastMatchesContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    width: '100%'
  },
  zoneButtonContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  zoneButtonIcon: {
    borderRadius: 100,
    height: 8,
    marginRight: 8,
    width: 8
  },
  zoneButtonText: {
    fontFamily: variables.mainFontMedium,
    fontSize: 12
  },
  zonesButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 130
  }
});
