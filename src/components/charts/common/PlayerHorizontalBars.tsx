import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ZoneSelector } from '../../../types';
import {
  PLAYER_LIST_CHART_ZONE_SELECTOR,
  utils,
  variables
} from '../../../utils/mixins';
import { Icon } from '../../icon/icon';

type PlayerHorizontalBarsProps = {
  player: {
    playerName: string;
    playerPercentage: number;
    playerLoad: number;
    playerBestMatchLoad: number;
    maxPercentageValue: number | undefined;
    id: string;
    wasSubbed: string | null;
  };
  isDontCompare: boolean;
  zoneSelector: ZoneSelector;
  widthPercentage: number;
  isPlayerLoadSelected: boolean;
  isNoBenchmark: boolean;
  isBestMatchCompare: boolean;
};

const PlayerHorizontalBars = ({
  player,
  isDontCompare,
  zoneSelector,
  widthPercentage,
  isPlayerLoadSelected,
  isNoBenchmark,
  isBestMatchCompare
}: PlayerHorizontalBarsProps) => {
  const {
    playerPercentage,
    playerName,
    playerLoad,
    playerBestMatchLoad,
    wasSubbed
  } = player;

  const { color, aboveAverageColor } = zoneSelector;

  const [playerTextWidth, setPlayerTextWidth] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);
  const [playerPercentageWidth, setPlayerPercentageWidth] = useState(0);
  const isLoadPerMin =
    zoneSelector.key === PLAYER_LIST_CHART_ZONE_SELECTOR[1].key;
  const textWidthPercentage = useMemo(() => {
    if (
      playerTextWidth === 0 ||
      viewWidth === 0 ||
      playerPercentageWidth === 0
    ) {
      return 0;
    }

    return (
      ((playerTextWidth + playerPercentageWidth + (wasSubbed ? 25 : 3)) /
        viewWidth) *
      100
    );
  }, [playerTextWidth, viewWidth, playerPercentageWidth, wasSubbed]);

  const percentageLeftPos = useMemo(() => {
    if (textWidthPercentage > widthPercentage) {
      return textWidthPercentage;
    }
    return widthPercentage;
  }, [textWidthPercentage, widthPercentage]);

  const playerPercentageleftPos = useMemo(() => {
    if (playerPercentageWidth === 0) return 0;
    return (playerPercentageWidth / viewWidth) * 100;
  }, [playerPercentageWidth, viewWidth]);

  const textColor =
    color === PLAYER_LIST_CHART_ZONE_SELECTOR[0].color
      ? variables.chartLightGrey
      : variables.textBlack;

  const renderNoDataText = () => {
    if (isNoBenchmark && !isDontCompare) {
      return (
        <Text
          style={[
            styles.barText,
            {
              color: textColor,
              fontFamily: variables.mainFontBold
            }
          ]}
        >
          {isBestMatchCompare
            ? 'No best match recorded'
            : `No benchmark recorded`}
        </Text>
      );
    }
    return null;
  };

  const renderPlayerName = () => {
    return (
      <>
        <View
          style={styles.nameAndIconContainer}
          onLayout={(evt) =>
            setPlayerTextWidth(evt.nativeEvent.layout.width + 8)
          }
        >
          <Text
            numberOfLines={1}
            style={[
              styles.barText,
              {
                color: textColor,
                maxWidth: 250
              }
            ]}
          >
            {playerName}
          </Text>
          {renderNoDataText()}
          {wasSubbed && (
            <Icon
              icon={wasSubbed === 'in' ? 'sub_in' : 'sub_out'}
              containerStyle={{ width: 10, height: 10, marginBottom: 11 }}
            />
          )}
        </View>
      </>
    );
  };

  const renderPlayerPercentage = () => {
    const leftPercentage = `${
      percentageLeftPos - playerPercentageleftPos - 1
    }%`;

    if (!isDontCompare) {
      if (isNoBenchmark) return null;
      if (widthPercentage < 101) {
        return (
          <Text
            style={[
              styles.barNumber,
              {
                color: textColor,
                left: leftPercentage
              }
            ]}
            onLayout={(evt) =>
              setPlayerPercentageWidth(evt.nativeEvent.layout.width)
            }
          >
            {playerPercentage}%
          </Text>
        );
      }
      return null;
    }
    return (
      <Text
        style={[
          styles.barNumber,
          {
            color: textColor,
            left: leftPercentage
          }
        ]}
        onLayout={(evt) =>
          setPlayerPercentageWidth(evt.nativeEvent.layout.width)
        }
      >
        {isPlayerLoadSelected
          ? isLoadPerMin
            ? playerLoad.toFixed(2)
            : playerLoad
          : utils.convertMilisecondsToTime(playerLoad * 1000)}
      </Text>
    );
  };

  const renderPlayerPercentageAbove = () => {
    if (isDontCompare) return null;
    if (isNoBenchmark) return null;
    if (widthPercentage > 100) {
      return (
        <View
          style={[
            styles.aboveAverageContainer,
            { backgroundColor: aboveAverageColor }
          ]}
        >
          <Icon
            icon="flame_icon"
            style={{
              height: 10,
              width: 12,
              fill: variables.textBlack,
              marginBottom: 2
            }}
          />
          <Text style={styles.missingBarTextFilled}>
            {`${playerPercentage}%`}
          </Text>
        </View>
      );
    }
    return renderPlayerComparison();
  };

  const renderPlayerComparison = () => {
    if (!isPlayerLoadSelected) return null;
    return (
      <View style={styles.aboveAverageContainer}>
        <Text
          style={[
            styles.missingBarTextFilled,
            {
              color: textColor
            }
          ]}
        >
          {`${isLoadPerMin ? playerLoad.toFixed(2) : playerLoad}/${
            isLoadPerMin ? playerBestMatchLoad.toFixed(2) : playerBestMatchLoad
          }`}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{ width: '100%' }}
      onLayout={(evt) => setViewWidth(evt.nativeEvent.layout.width)}
    >
      <View
        style={[
          styles.mainContainer,
          {
            width: !isDontCompare ? '90%' : '100%'
          }
        ]}
      >
        <View
          style={{
            width: widthPercentage > 100 ? '100%' : `${widthPercentage}%`,
            backgroundColor: color,
            height: '100%'
          }}
        />
        {renderPlayerName()}
        {renderPlayerPercentage()}
      </View>
      {renderPlayerPercentageAbove()}
    </View>
  );
};

export default PlayerHorizontalBars;

const styles = StyleSheet.create({
  aboveAverageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 28,
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '10%',
    zIndex: 10
  },
  barNumber: {
    color: variables.chartLightGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    letterSpacing: 1,
    position: 'absolute',
    textAlign: 'right'
  },
  barText: {
    fontFamily: variables.mainFont,
    fontSize: 12,
    letterSpacing: 1,
    marginRight: 10,
    paddingLeft: 8,
    textTransform: 'capitalize'
  },
  mainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 28,
    justifyContent: 'space-between'
  },
  missingBarTextFilled: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 12,
    letterSpacing: 1,
    marginRight: 5
  },
  nameAndIconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute'
  }
});
