import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Player } from '../../../../types';
import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { color, commonStyles, palette } from '../../../theme';
import { variables } from '../../../utils/mixins';
import Avatar from '../../common/Avatar';
import { Icon } from '../../icon/icon';

interface Props {
  playerInfo: Player;
}

const WeeklyLoadPlayerHeader = ({ playerInfo }: Props) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';

  return (
    <View style={styles.container}>
      <View style={[styles.indicatorLayout, styles.avatarContainer]}>
        <Avatar style={styles.avatar} photoUrl={playerInfo.photoUrl} />

        <View style={{ alignSelf: 'flex-start' }}>
          <View style={commonStyles.flexRowCenter}>
            <Text numberOfLines={1} style={styles.playerName}>
              {playerInfo.name}
            </Text>
            <Icon icon="icon_connected" />
          </View>
          <Text style={styles.playerPosition}>
            {isHockey
              ? variables.playerPositionsAbbrHockey[playerInfo.ppos]
              : variables.playerPositionsAbbr[playerInfo.ppos]}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WeeklyLoadPlayerHeader;
const styles = StyleSheet.create({
  avatar: {
    borderColor: 'transparent',
    borderRadius: 2,
    height: 85,
    marginRight: 15,
    width: 85
  },
  avatarContainer: {
    alignItems: 'center',
    backgroundColor: color.palette.grey,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginRight: '2%',
    overflow: 'hidden',
    paddingLeft: 12,
    paddingVertical: 12,
    width: '100%'
  },
  container: {
    alignItems: 'center',
    backgroundColor: palette.black2,
    flexDirection: 'row',
    height: 125,
    justifyContent: 'space-between',
    paddingBottom: 30,
    paddingHorizontal: 30
  },
  indicatorLayout: {
    borderColor: color.palette.grey,
    borderRadius: 2,
    borderWidth: 1,
    marginVertical: 20
  },
  playerName: {
    color: color.palette.white,
    fontFamily: variables.mainFontBold,
    fontSize: 18,
    marginRight: 8,
    width: 100
  },
  playerPosition: {
    color: color.palette.lightBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 16
  }
});
