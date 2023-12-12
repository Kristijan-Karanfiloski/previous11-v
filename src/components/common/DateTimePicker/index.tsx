import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';

import { variables } from '../../../utils/mixins';

type Props = {
  value: Date | undefined;
  onConfirm: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime' | undefined;
  maximumDate?: Date;
  defaultValue?: boolean;
  customStyle?: ViewStyle;
  minimumDate?: Date;
  placeholderText?: TextStyle;
};

export default function DateTimePIcker({
  mode = 'date',
  value,
  onConfirm,
  maximumDate,
  defaultValue = true,
  customStyle,
  minimumDate,
  placeholderText
}: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const textValue =
    mode === 'date'
      ? moment(value).format('YYYY/MM/DD')
      : moment(value).format('HH:mm');

  const containerStyle = customStyle
    ? StyleSheet.flatten([styles.button, customStyle])
    : styles.button;

  return (
    <View>
      <Pressable
        style={containerStyle}
        onPress={() => setShowPicker(true)}
        testID="click"
      >
        <Text style={[styles.buttonText, placeholderText]}>
          {!defaultValue ? '-' : textValue}
        </Text>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={20}
          color={variables.textBlack}
        />
      </Pressable>
      <DateTimePickerModal
        testID="dateTimePicker"
        customHeaderIOS={() => (
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{`Pick a ${mode}`}</Text>
          </View>
        )}
        date={value || minimumDate || new Date()}
        isVisible={showPicker}
        mode={mode}
        locale="en_GB"
        onConfirm={(date) => {
          onConfirm(date);
          setShowPicker(false);
        }}
        onCancel={() => setShowPicker(false)}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: variables.white,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 10,
    width: 121
  },
  buttonText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium
  },
  pickerHeader: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  pickerTitle: {
    fontSize: 20,
    paddingVertical: 10
  }
});
