import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { variables } from '../../../utils/mixins';

import PlayersList from './PlayersList';

interface Props {
  playersView: boolean;
  setPlayersView: () => void;
  selectedPlayers: {
    [key: string]: boolean;
  };
  setSelectedPlayers: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >;
}

const ChoosePlayers = ({
  playersView,
  setPlayersView,
  selectedPlayers,
  setSelectedPlayers
}: Props) => {
  return (
    <View>
      {playersView && (
        <PlayersList
          selectedPlayers={selectedPlayers}
          setSelectedPlayers={setSelectedPlayers}
        />
      )}
      <TouchableOpacity
        style={[
          styles.iconPosition,
          playersView
            ? {}
            : { borderTopWidth: 1, borderTopColor: variables.white }
        ]}
        onPress={setPlayersView}
      >
        <MaterialIcons
          name={playersView ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={variables.red}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChoosePlayers;

const styles = StyleSheet.create({
  iconPosition: {
    alignItems: 'center',
    height: 52,
    justifyContent: 'center',

    marginTop: 20,
    paddingTop: 20
  }
});
