import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

import { Icon } from '../../../../components/icon/icon';
import { selectAuth } from '../../../../redux/slices/authSlice';
import {
  selectActiveClub,
  updateActiveClubAction
} from '../../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../../redux/store';
import { variables } from '../../../../utils/mixins';

import { WELLNESS_DATA, WellnessCategories } from './helpers';
import Slider from './Slider';
import Sucess from './Sucess';

type PlayerWellness = {
  fatigued: number;
  sleepQuality: number;
  sleepDuration: number;
  muscleSoreness: number;
  comment?: string;
};

const Wellness = () => {
  const activeClub = useAppSelector(selectActiveClub);
  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const dispatch = useDispatch();
  const today = moment().format('YYYY/MM/DD');

  const [playerWellness, setPlayerWellness] = useState<PlayerWellness>({
    fatigued: 1,
    sleepQuality: 1,
    sleepDuration: 0,
    muscleSoreness: 1,
    comment: ''
  });

  const wellness = activeClub.wellness ? { ...activeClub.wellness } : {};
  const wellnessCurrentDay = wellness[today] ? { ...wellness[today] } : {};
  const hasPlayerSubmitedWellness = wellnessCurrentDay[playerId];

  const onSubmit = () => {
    const data = { ...playerWellness };
    if (!data.comment) {
      delete data.comment;
    }
    wellnessCurrentDay[playerId] = data;
    wellness[today] = wellnessCurrentDay;

    dispatch(updateActiveClubAction({ wellness }));
  };

  const onChange = (key: string, value: string | number) => {
    setPlayerWellness((prevState) => ({ ...prevState, [key]: value }));
  };

  const Sliders = useMemo(
    () =>
      Object.keys(WELLNESS_DATA).map((name) => (
        <View style={styles.box} key={name}>
          <Slider
            name={name}
            onChange={onChange}
            data={WELLNESS_DATA[name as WellnessCategories]}
          />
        </View>
      )),
    []
  );

  if (hasPlayerSubmitedWellness) return <Sucess />;

  return (
    <KeyboardAwareScrollView extraScrollHeight={150} style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>
            {'Let your trainer know before training\nstarts today'}
          </Text>
        </View>
        {Sliders}
        <View style={[styles.box, styles.textAreaBox]}>
          <MaterialCommunityIcons
            name="message-processing-outline"
            size={16}
            color={variables.grey2}
            style={{ marginRight: 10, marginTop: 6 }}
          />
          <TextInput
            scrollEnabled={false}
            multiline
            maxLength={200}
            onChangeText={(text) =>
              setPlayerWellness((prevState) => ({
                ...prevState,
                comment: text
              }))
            }
            value={playerWellness.comment}
            style={styles.inputText}
            placeholder="Add comment"
            blurOnSubmit
            returnKeyType="done"
          />
        </View>
        <Pressable onPress={onSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Send</Text>
          <Icon style={styles.buttonIcon} icon="arrow_forward" />
        </Pressable>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default Wellness;

const styles = StyleSheet.create({
  box: {
    backgroundColor: variables.realWhite,
    borderRadius: 8,
    marginBottom: 4,
    paddingHorizontal: 20,
    paddingVertical: 32
  },
  button: {
    alignItems: 'center',
    backgroundColor: variables.red,
    borderRadius: 4,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    marginBottom: 40,
    marginHorizontal: 20,
    marginTop: 20
  },
  buttonIcon: {
    color: variables.realWhite
  },
  buttonText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontBold,
    marginRight: 4
  },
  container: {
    flex: 1
  },
  inputText: {
    color: variables.textBlack,
    fontSize: 14,
    height: 'auto',
    paddingRight: 40
  },
  subtitle: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 14
  },
  textAreaBox: {
    flexDirection: 'row',
    paddingVertical: 20
  },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 22,
    marginBottom: 4
  },
  topContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32
  }
});
