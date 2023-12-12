import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { selectPlayerById } from '../../redux/slices/playersSlice';
import { selectTrackingEvent } from '../../redux/slices/trackingEventSlice';
import { useAppSelector } from '../../redux/store';
import { commonStyles, palette } from '../../theme';
import { variables } from '../../utils/mixins';
import { Icon } from '../icon/icon';

interface LiveIntensityTileProps {
  containerStyle?: ViewStyle;
  playerStats: any;
  playerId: string;
  isDontCompare: boolean;
  onPress?: (playerId: string) => void;
}

const LiveIntensityTile = (props: LiveIntensityTileProps) => {
  const {
    containerStyle,
    playerStats,
    playerId,
    isDontCompare,
    onPress = () => undefined
  } = props;
  const activeEvent = useAppSelector(selectTrackingEvent);
  const player = useAppSelector((state) => selectPlayerById(state, playerId));

  if (!player || !activeEvent) return null;

  const renderSubIcon = () => {
    const subs = activeEvent.preparation?.substitutions;
    if (subs && subs[player.id]) {
      return subs[player.id][subs[player.id].length - 1].subbed === 'in'
        ? (
        <Icon icon="sub_in" />
          )
        : null;
    }

    return null;
  };

  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={() => onPress(player.id)}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: playerStats.liveIntensityColor
          }
        ]}
      >
        <View style={styles.headerCircle}>
          <Text style={styles.headerText}>{player.tag}</Text>
        </View>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {player.name}
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.primaryDataContainer}>
          <View style={styles.primaryDataTitleContainer}>
            <Text style={styles.primaryDataTitle}>Total Load</Text>
            {renderSubIcon()}
          </View>
          <View style={commonStyles.flexRowCenter}>
            <Text style={styles.primaryDataContent}>
              {isDontCompare
                ? playerStats?.teamLoad
                : `${playerStats?.percentageLoad}%`}
            </Text>

            {playerStats.comparisonLoad > 0 &&
              playerStats.percentageLoad > 100 && (
                <Icon
                  icon="heat_icon"
                  containerStyle={{
                    marginLeft: 7,
                    width: 22,
                    height: 22
                  }}
                />
            )}
          </View>
        </View>
        <View style={styles.secondaryDataContainer}>
          <View
            style={[
              styles.innerDataContainer,
              {
                borderRightWidth: 1,
                borderColor: palette.greyE1
              }
            ]}
          >
            <Text style={styles.secondaryDataTitle}>EXP.</Text>
            <Text style={styles.secondaryDataContent}>
              {isDontCompare
                ? playerStats?.explosivePercentage
                : `${playerStats?.explosivePercentage}%`}
            </Text>
            <View style={styles.progressBarMainContainer}>
              <View
                style={{
                  width: `${
                    playerStats.explosivePercentage > 100
                      ? 100
                      : playerStats.explosivePercentage
                  }%`,
                  height: 2,
                  backgroundColor: palette.angry
                }}
              />
            </View>
          </View>
          <View
            style={[
              styles.innerDataContainer,
              {
                paddingLeft: 7
              }
            ]}
          >
            <Text style={styles.secondaryDataTitle}>VH.</Text>
            <Text style={styles.secondaryDataContent}>
              {isDontCompare
                ? playerStats?.veryHighPercentage
                : `${playerStats?.veryHighPercentage}%`}
            </Text>
            <View style={styles.progressBarMainContainer}>
              <View
                style={{
                  left: 7,
                  height: 2,
                  width: `${
                    playerStats.veryHighPercentage > 100
                      ? 100
                      : playerStats.veryHighPercentage
                  }%`,
                  backgroundColor: palette.orangeDarker
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default LiveIntensityTile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.realWhite,
    borderRadius: 2,
    elevation: 2,
    minHeight: 150,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 1,
    shadowRadius: 1.41
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 12,
    paddingHorizontal: 12,
    paddingTop: 8
  },
  header: {
    alignItems: 'center',
    backgroundColor: variables.intensityZoneColors.explosive,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    flex: 0.231,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 8
  },
  headerCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.3)',
    borderRadius: 9,
    height: 18,
    justifyContent: 'center',
    marginRight: 4,
    width: 18
  },
  headerText: {
    color: palette.black2,
    fontFamily: variables.mainFontMedium,
    fontSize: 9,
    lineHeight: 18,
    textAlign: 'center'
  },
  headerTitle: {
    color: palette.black2,
    fontFamily: variables.mainFontMedium,
    fontSize: 12,
    maxWidth: '90%',
    textTransform: 'uppercase'
  },
  innerDataContainer: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  primaryDataContainer: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: palette.greyE1,
    flex: 1,
    justifyContent: 'center'
  },
  primaryDataContent: {
    fontFamily: variables.mainFont,
    fontSize: 32
  },
  primaryDataTitle: {
    color: palette.tipGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    textTransform: 'uppercase'
  },
  primaryDataTitleContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  progressBarMainContainer: {
    backgroundColor: palette.white,
    bottom: 2,
    height: 2,
    position: 'absolute',
    width: '100%'
  },
  secondaryDataContainer: {
    flex: 0.769,
    flexDirection: 'row'
  },
  secondaryDataContent: {
    fontSize: 16
  },
  secondaryDataTitle: {
    color: palette.tipGrey,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 10
  }
});
