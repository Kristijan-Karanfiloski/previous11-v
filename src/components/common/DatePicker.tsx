import React, { useEffect, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import moment, { Moment } from 'moment';

import { color, typography } from '../../theme';
import { variables } from '../../utils/mixins';

import Button from './Button';

const height = variables.deviceHeight * 0.8;

interface DatePickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle;

  onSelect?: (date: Moment) => void;

  dismiss?: () => void;

  selectedDate: Date;

  showDaysPicker?: boolean;
}

const years = [...Array(10).keys()].map((num) => num + 2015 + '');

/**
 * Datepicker component for selecting a date or time
 */
const DatePicker = (props: DatePickerProps) => {
  const {
    style,
    onSelect,
    dismiss,
    selectedDate,
    showDaysPicker = false
  } = props;

  const date = selectedDate || new Date();

  const [selectedYear, setYearValue] = useState(date.getFullYear() + '');
  const [selectedMonth, setMonthValue] = useState(date.getMonth() + 1);
  const [selectedDay, setDayValue] = useState(
    selectedDate ? selectedDate.getDate() : null
  );
  const [daysInMonth, setDaysInMonthValue] = useState(
    moment(date).daysInMonth()
  );

  useEffect(() => {
    if (showDaysPicker) {
      const days = moment(
        `${selectedYear}/${selectedMonth}/01`,
        'YYYY/MM/DD'
      ).daysInMonth();
      setDaysInMonthValue(days);
      setDayValue(Math.min(selectedDay || 0, days));
    }
  }, [selectedYear, selectedMonth, showDaysPicker]);

  const [mounted, isMounted] = useState<boolean>(false);
  const [animation] = useState<Animated.Value>(new Animated.Value(height));

  if (!mounted) {
    Animated.timing(animation, {
      toValue: 0,
      useNativeDriver: true,
      duration: 500
    }).start();

    isMounted(true);
  }

  const hideCard = () => {
    Animated.timing(animation, {
      toValue: height,
      useNativeDriver: true
    }).start(() => dismiss && dismiss());
  };

  return (
    <View style={styles.fullScreen}>
      <TouchableWithoutFeedback onPress={hideCard}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                translateY: animation
              }
            ]
          },
          style
        ]}
      >
        <View style={styles.top}>
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            itemStyle={styles.pickerItem}
            onValueChange={(itemValue) => setYearValue(itemValue)}
          >
            {years.map((year) => (
              <Picker.Item label={year} value={year} key={year} />
            ))}
          </Picker>

          <Picker
            selectedValue={selectedMonth}
            itemStyle={{ fontFamily: typography.fontMedium }}
            style={styles.picker}
            onValueChange={(_itemValue, itemIndex) =>
              setMonthValue(itemIndex + 1)
            }
          >
            {variables.monthAbbr.map((month, index) => (
              <Picker.Item label={month} value={index + 1} key={month} />
            ))}
          </Picker>

          {showDaysPicker && (
            <Picker
              selectedValue={selectedDay}
              itemStyle={{ fontFamily: typography.fontMedium }}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setDayValue(itemIndex + 1)
              }
            >
              {Array.from({ length: daysInMonth }, (_, index) =>
                (index + 1).toString()
              ).map((day, index) => (
                <Picker.Item label={day} value={index + 1} key={day} />
              ))}
            </Picker>
          )}
        </View>
        <View style={styles.bottom}>
          <Button
            customStyle={styles.buttonText}
            content="Cancel"
            mode="outline"
            onPressed={() => hideCard()}
            marginStyle={{ marginRight: 10 }}
          />
          <Button
            customStyle={styles.buttonText}
            content="Select"
            mode="primary"
            onPressed={() => {
              onSelect &&
                onSelect(moment(`${selectedYear}/${selectedMonth}`, 'YYYY/MM'));
              hideCard();
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  bottom: {
    alignContent: 'space-around',
    backgroundColor: color.palette.realWhite,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    fontWeight: '600'
  },
  container: {
    backgroundColor: color.palette.realWhite,
    borderRadius: 10,
    margin: 20,
    paddingBottom: 24,
    paddingTop: 24,
    zIndex: 12
  },
  fullScreen: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
    bottom: 0,
    height: variables.deviceHeight,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: variables.deviceWidth,
    zIndex: 10
  },
  overlay: {
    bottom: 0,
    height: variables.deviceHeight,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: variables.deviceWidth
  },
  picker: {
    backgroundColor: color.palette.realWhite,
    flex: 1,
    height: '70%'
  },
  pickerItem: {
    color: color.palette.grey,
    fontFamily: typography.fontMedium,
    fontSize: 20
  },
  top: {
    alignContent: 'space-around',
    backgroundColor: color.palette.realWhite,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
