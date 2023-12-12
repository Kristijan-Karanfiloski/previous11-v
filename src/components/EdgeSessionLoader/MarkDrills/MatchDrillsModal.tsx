import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';
import ButtonNew from '../../common/ButtonNew';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (
    name: string,
    deletable: boolean,
    label?: string,
    isPeriod?: boolean
  ) => void;
};

type Drill = {
  drillName: string;
  label: string;
};

const footballPeriods = [
  { drillName: 'preMatch', label: 'Pre Match' },
  { drillName: 'firstHalf', label: '1st Half' },
  { drillName: 'Halftime', label: 'Halftime' },
  { drillName: 'secondHalf', label: '2nd Half' },
  { drillName: 'overtime', label: 'Overtime' }
];
const hockeyPeriods = [
  { drillName: 'preMatch', label: 'Pre Match' },
  { drillName: 'firstPeriod', label: '1st Period' },
  { drillName: 'secondPeriod', label: '2nd Period' },
  { drillName: 'thirdPeriod', label: '3rd Period' },
  { drillName: 'intermission', label: 'Intermission' },
  { drillName: 'overtime', label: 'Overtime' }
];

const MatchDrillsModal = ({ visible, onCancel, onSubmit }: Props) => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  const items = isHockey ? hockeyPeriods : footballPeriods;

  const [selectedPeriod, setSelectedPeriod] = useState<null | Drill>(null);

  return (
    <Modal
      animationIn="fadeIn"
      isVisible={visible}
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Period</Text>
        </View>
        <ScrollView style={styles.content}>
          {items.map((item, i) => (
            <Pressable key={i} onPress={() => setSelectedPeriod(item)}>
              <Text
                style={[
                  styles.text,
                  selectedPeriod &&
                    selectedPeriod.drillName === item.drillName && {
                    color: variables.red
                  }
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.buttons}>
          <ButtonNew
            style={styles.button}
            mode="secondary"
            text="Cancel"
            onPress={onCancel}
          />
          <ButtonNew
            disabled={!selectedPeriod}
            text="Mark Period"
            onPress={() => {
              if (selectedPeriod) {
                onSubmit(
                  selectedPeriod.drillName,
                  true,
                  selectedPeriod.label,
                  true
                );
              }
              onCancel();
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default MatchDrillsModal;

const styles = StyleSheet.create({
  button: { marginRight: 20 },
  buttons: { flexDirection: 'row', marginTop: 80 },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: 570
  },
  content: { height: 400, paddingVertical: 20 },
  header: {
    borderBottomColor: variables.white,
    borderBottomWidth: 1,
    paddingBottom: 35,
    width: '100%'
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 21,
    paddingVertical: 10,
    textAlign: 'center'
  },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 23,
    textAlign: 'center'
  }
});
