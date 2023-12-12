import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { GameType } from '../../../../types';
import { selectAuth } from '../../../redux/slices/authSlice';
import { selectAllGames } from '../../../redux/slices/gamesSlice';
import { useAppSelector } from '../../../redux/store';
import {
  gradientColorsMatch,
  gradientColorsTraining,
  variables
} from '../../../utils/mixins';
import DateTimePicker from '../../common/DateTimePicker';
import InputCell from '../../common/InputCell';
import LinearGradientView from '../../LinearGradientView';
import {
  defaultCategoryPicker,
  getDefaultTrainingCategoryOption
} from '../helpers';
import {
  EventDetailsType,
  LocationOptions,
  RepeatOptions,
  TrainingCategory,
  TypeOptions
} from '../types';

import EventModalDropdown from './EventModalDropdown';

interface Props {
  eventDetails: EventDetailsType;
  handleEventDetails: (data: string | Date, key: string) => void;
}

const EventDetails = ({ eventDetails, handleEventDetails }: Props) => {
  const isMatch = eventDetails.type === GameType.Match;
  const allGames = useAppSelector(selectAllGames);
  const { customerName } = useAppSelector(selectAuth);

  useEffect(() => {
    if (
      eventDetails.type === GameType.Training &&
      eventDetails.category === ''
    ) {
      handleEventDetails(
        defaultCategoryPicker(
          getDefaultTrainingCategoryOption(allGames, eventDetails)
        ),
        'category'
      );
    }
  }, [eventDetails, allGames]);

  const renderGradientLine = () => {
    if (!eventDetails.type) return <View style={styles.gradientContainer} />;
    return (
      <LinearGradientView
        colors={isMatch ? gradientColorsMatch : gradientColorsTraining}
        linearGradient={{ y2: '100%' }}
        style={styles.gradientContainer}
      />
    );
  };

  const renderAditionalData = () => {
    if (isMatch) {
      return (
        <>
          <View style={styles.dataContainerSmall}>
            <Text style={styles.dataHeading}>Location</Text>
            <Text style={styles.dataSubHeading}>Home or Away</Text>
            <EventModalDropdown
              value={eventDetails.location}
              type="location"
              options={LocationOptions}
              handleEventDetails={handleEventDetails}
              height={360}
              style={{ borderRadius: 8, width: 90 }}
            />
          </View>
          <View style={styles.dataContainerBig}>
            <Text style={styles.dataHeading}>Opponent</Text>
            <Text style={styles.dataSubHeading}>{customerName} vs.</Text>
            <InputCell
              placeholder="Enter opponent"
              value={eventDetails.opponent}
              onTextInput={(val) => {
                handleEventDetails(val, 'opponent');
              }}
              maxLength={40}
              style={{ marginTop: 0 }}
              inputStyle={styles.inputStyle}
            />
          </View>
        </>
      );
    }
    return (
      <>
        <View style={styles.dataContainer}>
          <Text style={styles.dataHeading}>Training category</Text>
          <Text style={styles.dataSubHeading}>Select Category</Text>
          <EventModalDropdown
            value={eventDetails.category}
            type="category"
            options={TrainingCategory}
            handleEventDetails={handleEventDetails}
            height={360}
            style={{ borderRadius: 8, width: 167 }}
          />
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.dataHeading}>Repeat event</Text>
          {eventDetails.repeat === 'Never' && (
            <Text style={styles.dataSubHeading}>Select Repitition</Text>
          )}
          <EventModalDropdown
            value={eventDetails.repeat}
            type="repeat"
            options={RepeatOptions}
            handleEventDetails={handleEventDetails}
            height={200}
            style={{ borderRadius: 8, width: 137 }}
          />
          {eventDetails.repeat !== 'Never' && (
            <DateTimePicker
              value={
                eventDetails.repeatDate
                  ? new Date(eventDetails.repeatDate)
                  : new Date()
              }
              maximumDate={moment(new Date()).add(1, 'y').toDate()}
              onConfirm={(date) => handleEventDetails(date, 'repeatDate')}
              customStyle={{ width: 120, borderRadius: 8 }}
            />
          )}
        </View>
      </>
    );
  };

  const mainContainerStyle = StyleSheet.flatten([
    styles.mainContainer,
    eventDetails.type === '' ? { width: 352 } : {}
  ]);

  return (
    <View style={mainContainerStyle}>
      <View>{renderGradientLine()}</View>
      <View style={styles.dataContainerSmall}>
        <Text style={styles.dataHeading}>Type of event</Text>
        <Text style={styles.dataSubHeading}>Match or Training</Text>
        <EventModalDropdown
          value={eventDetails.type}
          type="type"
          options={TypeOptions}
          handleEventDetails={handleEventDetails}
          height={90}
          style={{ borderRadius: 8, width: 101 }}
        />
      </View>
      <View style={styles.dataContainerBig}>
        <Text style={styles.dataHeading}>When?</Text>
        <Text style={styles.dataSubHeading}>Select Date and Time</Text>
        <View style={{ flexDirection: 'row' }}>
          <DateTimePicker
            value={eventDetails.date ? new Date(eventDetails.date) : new Date()}
            onConfirm={(date) => handleEventDetails(date, 'date')}
            customStyle={{ width: 120, borderRadius: 8 }}
          />
          <DateTimePicker
            value={eventDetails.time ? new Date(eventDetails.time) : new Date()}
            mode="time"
            onConfirm={(date) => handleEventDetails(date, 'time')}
            customStyle={{ width: 88, borderRadius: 8, marginLeft: 10 }}
          />
        </View>
      </View>
      {eventDetails.type && renderAditionalData()}
    </View>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  dataContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    maxWidth: 167
  },
  dataContainerBig: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    maxWidth: 218
  },
  dataContainerSmall: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    maxWidth: 101
  },
  dataHeading: {
    fontFamily: variables.mainFontMedium,
    fontSize: 12
  },
  dataSubHeading: {
    fontFamily: variables.mainFontLight,
    fontSize: 12
  },
  gradientContainer: {
    backgroundColor: variables.lightGrey,
    borderRadius: 2,
    height: '100%',
    width: 7
  },
  inputStyle: {
    backgroundColor: variables.white,
    borderColor: variables.white,
    borderRadius: 8,
    height: 41,
    width: 167
  },
  mainContainer: {
    flexDirection: 'row',
    height: 112,
    justifyContent: 'space-between',
    marginTop: 20
  }
});
