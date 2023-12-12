import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { PlayerWellness as PlayerWellnessType } from '../../converters/club';
import { selectActiveClub } from '../../redux/slices/clubsSlice';
import { selectAllPlayers } from '../../redux/slices/playersSlice';
import { useAppSelector } from '../../redux/store';
import { variables } from '../../utils/mixins';

import Comment from './Comment';
import PlayerWellness from './PlayerWellness';
const Wellness = () => {
  const { wellness } = useAppSelector(selectActiveClub);
  const allPlayers = useAppSelector(selectAllPlayers);
  const navigation = useNavigation();
  const [date, setDate] = useState(moment().format('MMM DD YYYY'));
  const [showPicker, setShowPicker] = useState(false);
  const isToday = moment(date, 'MMM DD YYYY')
    .startOf('day')
    .isSame(moment().startOf('day'));

  const dateFormated = moment(date, 'MMM DD YYYY').format('YYYY/MM/DD');
  const wellnessData =
    !!wellness && wellness[dateFormated] ? wellness[dateFormated] : {};

  const getDateText = (date: string) => {
    if (isToday) {
      return `Today, ${date}`;
    }

    return moment(date, 'MMM DD YYYY').format('MMMM DD YYYY');
  };

  const getWellnessDataArray = (data: Record<string, PlayerWellnessType>) => {
    return allPlayers
      .map(({ id, name }) => {
        const playerWellness = data[id];

        return {
          name,
          fatigued: playerWellness?.fatigued || 0,
          sleepQuality: playerWellness?.sleepQuality || 0,
          sleepDuration: playerWellness?.sleepDuration || 0,
          muscleSoreness: playerWellness?.muscleSoreness || 0,
          comment: playerWellness?.comment,
          noData: !playerWellness
        };
      })
      .sort((a, b) => (a.noData === b.noData ? 0 : a.noData ? 1 : -1));
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: variables.textBlack }}>
        <View style={styles.header}>
          <Pressable
            onPress={navigation.goBack}
            style={{ height: 30, width: 30 }}
          >
            <Ionicons name="caret-back-sharp" size={17} color={variables.red} />
          </Pressable>
          <View style={styles.dateContainer}>
            <Pressable
              onPress={() => {
                setDate((prevState) => {
                  return moment(prevState, 'MMM DD YYYY')
                    .subtract(1, 'd')
                    .format('MMM DD YYYY');
                });
              }}
              style={styles.button}
            >
              <Ionicons
                name="caret-back-sharp"
                size={17}
                color={variables.red}
              />
            </Pressable>
            <Pressable
              onPress={() => setShowPicker(true)}
              style={styles.dateWrapper}
            >
              <Text style={styles.dateText}>{getDateText(date)}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="white"
              />
            </Pressable>
            <Pressable
              disabled={isToday}
              onPress={() => {
                setDate((prevState) => {
                  return moment(prevState, 'MMM DD YYYY')
                    .add(1, 'd')
                    .format('MMM DD YYYY');
                });
              }}
              style={styles.button}
            >
              <Ionicons
                name="caret-forward-sharp"
                size={17}
                color={variables.red}
                style={{ opacity: isToday ? 0.23 : 1 }}
              />
            </Pressable>
          </View>
        </View>
        {showPicker && (
          <DateTimePickerModal
            testID="dateTimePicker"
            customHeaderIOS={() => (
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Pick a date</Text>
              </View>
            )}
            date={moment(date, 'MMM DD YYYY').toDate()}
            isVisible={showPicker}
            mode="date"
            locale="en_GB"
            onConfirm={(date) => {
              setDate(moment(date).format('MMM DD YYYY'));
              setShowPicker(false);
            }}
            onCancel={() => setShowPicker(false)}
            maximumDate={moment().toDate()}
          />
        )}
      </SafeAreaView>

      <>
        <View style={{ height: 200 }}>
          <ScrollView
            contentContainerStyle={styles.commentSections}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {getWellnessDataArray(wellnessData)
              .filter(({ comment }) => !!comment)
              .map((item, index) => (
                <Comment
                  key={index}
                  name={item.name}
                  text={item.comment || ''}
                  date={
                    isToday
                      ? 'Today'
                      : moment(date, 'MMM DD YYYY').format('MMM DD')
                  }
                />
              ))}
          </ScrollView>
        </View>

        <FlatList
          contentContainerStyle={styles.wellnessSection}
          data={getWellnessDataArray(wellnessData)}
          renderItem={({ item }) => (
            <PlayerWellness
              data={item}
              date={
                isToday ? 'Today' : moment(date, 'MMM DD YYYY').format('MMM DD')
              }
            />
          )}
        />
      </>
    </View>
  );
};

export default Wellness;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30
  },
  commentSections: {
    padding: 20
  },
  container: {
    flex: 1
  },
  dateContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 22,
    marginTop: 'auto'
  },
  dateText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontMedium,
    fontSize: 24,
    marginRight: 5,
    textTransform: 'uppercase'
  },
  dateWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: 270
  },
  header: {
    backgroundColor: variables.textBlack,
    height: 162,
    paddingHorizontal: 22,
    paddingTop: 22
  },
  pickerHeader: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  pickerTitle: {
    fontSize: 20,
    paddingVertical: 10
  },
  wellnessSection: {
    paddingBottom: 100,
    paddingHorizontal: 20
  }
});
