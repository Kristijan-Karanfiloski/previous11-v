import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';

import { selectSomePlayers } from '../../../redux/slices/playersSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import ButtonNew from '../ButtonNew';
import Dropdown from '../Dropdown';
interface SubstituteModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit?: (playerIn: string, playerOut: string) => void;
  inPitchPlayers: string[];
  onBenchPlayers: string[];
}

const SubstituteModal = (props: SubstituteModalProps) => {
  const {
    isVisible,
    onClose = () => undefined,
    onSubmit = () => undefined,
    inPitchPlayers = [],
    onBenchPlayers = []
  } = props;

  const [playerOut, setPlayerOut] = React.useState<string | null>(null);
  const [playerIn, setPlayerIn] = React.useState<string | null>(null);

  const playersOnBench = useAppSelector((state) =>
    selectSomePlayers(state, onBenchPlayers)
  );
  const playersInPitch = useAppSelector((state) =>
    selectSomePlayers(state, inPitchPlayers)
  );

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} animationIn="fadeIn">
      <View style={styles.container}>
        <Text style={styles.subTitle}>Substitute</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={styles.substituteIndicator}>OUT</Text>
            <Feather name="arrow-up-circle" size={24} color="red" />
          </View>

          <View style={styles.dropdownView}>
            <Dropdown
              uiType="two"
              placeholder="SELECT PLAYER"
              value={playerOut}
              options={playersInPitch.map((player) => {
                return { label: player?.name, value: player?.id };
              })}
              onChange={setPlayerOut}
              containerStyle={styles.dropdownContainer}
              dropdownHeight={200}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View>
            <Text style={styles.substituteIndicator}>IN</Text>
            <Feather
              name="arrow-down-circle"
              size={24}
              color={variables.matchGreen}
            />
          </View>

          <View style={styles.dropdownView}>
            <Dropdown
              uiType="two"
              placeholder="SELECT PLAYER"
              value={playerIn}
              options={playersOnBench.map((player) => {
                return { label: player?.name, value: player?.id };
              })}
              onChange={setPlayerIn}
              containerStyle={styles.dropdownContainer}
              dropdownHeight={200}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ButtonNew text="Cancel" mode="secondary" onPress={onClose} />
          <ButtonNew
            disabled={!playerIn || !playerOut}
            text="Substitute"
            onPress={() =>
              playerIn && playerOut && onSubmit(playerIn, playerOut)
            }
          />
        </View>
      </View>
    </Modal>
  );
};

export default SubstituteModal;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: 'white',
    height: 390,
    justifyContent: 'space-between',
    paddingHorizontal: 64,
    paddingVertical: 48,
    width: 520
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderColor: variables.textBlack,
    borderRadius: 4,
    borderWidth: 1
  },
  dropdownView: { marginLeft: 10, width: '90%' },
  subTitle: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 32
  },
  substituteIndicator: {
    fontFamily: variables.mainFontMedium,
    fontSize: 10,
    textAlign: 'center'
  }
});
