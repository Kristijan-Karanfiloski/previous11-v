import React, { useContext } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment, { Moment } from 'moment';

import { GameType } from '../../../types';
import { SocketContext } from '../../hooks/socketContext';
import { color, commonStyles } from '../../theme';
import { variables } from '../../utils/mixins';
import Button from '../common/Button';
import Dropdown from '../common/Dropdown';
import { Icon } from '../icon/icon';

interface CalendarHeaderProps {
  currentDate: Moment;
  setCurrentDate: (date: Moment) => void;
  toggleDatePicker?: () => void;
  onEventTypeChange?: (value: string) => void;
  eventType?: string;
}

const CalendarHeader = (props: CalendarHeaderProps) => {
  const {
    currentDate,
    setCurrentDate,
    toggleDatePicker = () => undefined,
    onEventTypeChange,
    eventType = 'all'
  } = props;

  const navigation = useNavigation() as any;
  const { edgeConnected } = useContext(SocketContext);

  return (
    <View style={styles.calendarHeader}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: 15
        }}
      >
        <TouchableOpacity
          onPress={toggleDatePicker}
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Text style={styles.dateTitle}>
            {currentDate.format('MMMM YYYY')}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={29} color="black" />
        </TouchableOpacity>
      </View>
      <View
        style={[
          commonStyles.flexRowCenter,
          { justifyContent: 'space-between', columnGap: 15 }
        ]}
      >
        <Button
          customStyle={{ marginRight: 10 }}
          content="Today"
          mode="white"
          onPressed={() => setCurrentDate(moment())}
        />
        <View style={{ width: 120 }}>
          <Dropdown
            uiType="two"
            placeholder="Select event type"
            value={eventType}
            options={[
              { label: 'See All', value: 'all' },
              { label: 'Matches', value: GameType.Match },
              { label: 'Trainings', value: GameType.Training }
            ]}
            onChange={(value) => onEventTypeChange && onEventTypeChange(value)}
            preventUnselect
            dropdownHeight={120}
          />
        </View>

        <Pressable
          onPress={() => {
            if (!edgeConnected) {
              return navigation.navigate('LostConnectionModal', {
                isStartingEvent: true,
                presentational: true
              });
            }

            navigation.navigate('LoadEdgeSessionsModal');
          }}
        >
          <MaterialCommunityIcons
            name="upload-outline"
            size={29}
            color={variables.red}
          />
        </Pressable>
        <Pressable
          style={{ marginHorizontal: 10 }}
          onPress={() => navigation.navigate('CreateEventModal', {})}
        >
          <Icon icon="plus" style={{ color: variables.red }} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('SessionsMenu')}>
          <Icon icon="menu_closed" />
        </Pressable>
      </View>
    </View>
  );
};

export default CalendarHeader;

const styles = StyleSheet.create({
  calendarHeader: {
    alignItems: 'center',
    backgroundColor: color.palette.realWhite,
    flexDirection: 'row',
    height: variables.headerHeight,
    justifyContent: 'space-between',
    paddingHorizontal: 24
  },
  dateTitle: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24
  }
});
