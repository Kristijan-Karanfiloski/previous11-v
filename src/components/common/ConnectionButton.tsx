import React, { useContext } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { GameAny } from '../../../types';
import { EventTopics, SocketContext } from '../../hooks/socketContext';
import { selectConfig } from '../../redux/slices/configSlice';
import { selectOnlineTags } from '../../redux/slices/onlineTagsSlice';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import {
  selectTrackingEvent,
  updateTrackingEvent
} from '../../redux/slices/trackingEventSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { getNumberOfOnlineTags, getPlayersMacIds } from '../../utils';
import { variables } from '../../utils/mixins';
import { Icon } from '../icon/icon';

interface Props {
  disabled?: boolean;
  textColor?: string;
}

const ConnectionButton = ({ disabled = false, textColor }: Props) => {
  const dispatch = useAppDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const { isReady, sendEvent } = useContext(SocketContext);
  const activeEvent = useAppSelector(selectTrackingEvent);
  const players = useAppSelector(selectAllPlayers);
  const config = useAppSelector(selectConfig);
  const onlineTags = useAppSelector(selectOnlineTags);

  const onPress = () => {
    if (disabled) return;
    const isLiveScreen =
      route.name === 'TeamLive' || route.name === 'PlayerLive';

    if (isLiveScreen) {
      return navigation.navigate('PlayersOverviewModal', {
        event: activeEvent,
        onSave,
        isLive: isLiveScreen
      });
    }
    navigation.navigate('TagsOverviewModal');
  };

  const onSave = (event: GameAny) => {
    const playerIds = event?.preparation?.playersInPitch || [];
    const macIds = getPlayersMacIds(playerIds, players, config.tags);

    dispatch(updateTrackingEvent(event));
    sendEvent(EventTopics.CONNECTED_PLAYERS, { players: macIds });
    navigation.goBack();
  };

  const renderText = () => {
    if (!isReady) return 'Disconnected';

    const numberOfOnlineTags = getNumberOfOnlineTags(
      players,
      config.tags,
      onlineTags
    );

    if (players.length > 0 && numberOfOnlineTags === players.length) {
      return 'All Connected';
    }
    return 'Connected';
  };

  return (
    <>
      <Pressable onPress={onPress} style={styles.container}>
        <Text
          style={[
            styles.text,
            textColor
              ? {
                  color: textColor
                }
              : null
          ]}
        >
          {renderText()}
        </Text>
        <Icon icon={isReady ? 'icon_connected' : 'icon_disconnected'} />
      </Pressable>
    </>
  );
};

export default ConnectionButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  text: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    marginRight: 10,
    marginTop: 3,
    textTransform: 'uppercase'
  }
});
