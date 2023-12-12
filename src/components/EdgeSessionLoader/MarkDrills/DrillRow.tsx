import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import { DrillsModalType } from '../../../../types';
import { variables } from '../../../utils/mixins';
import DateTimePIcker from '../../common/DateTimePicker';
import { Icon } from '../../icon/icon';
import { MarkedDrill, MarkedPeriod } from '../SetupEdgeSession';

import DeleteDrillModal from './DeleteDrillModal';
import MatchDrillsModal from './MatchDrillsModal';

function toHoursAndMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

type StartEndMinMaxDate = {
  start: {
    min: Date;
    max: Date;
  };
  end: {
    min: Date;
    max: Date;
  };
};

type Props = {
  data: MarkedDrill | MarkedPeriod;
  onUpdateDrill: any;
  startEndMinMaxDate: StartEndMinMaxDate;
  onDelete: (id: number) => void;
  disable?: boolean;
  isMatch: boolean;
};

const DrillRow = ({
  data,
  onUpdateDrill,
  startEndMinMaxDate,
  onDelete,
  disable,
  isMatch
}: Props) => {
  const navigation = useNavigation();
  const { name, startTimestamp, endTimestamp, locked, deletable, label } = data;

  const startTime = moment(startTimestamp).toDate();
  const endTime = moment(endTimestamp).toDate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPeriodsModal, setShowPeriodsModal] = useState(false);

  const { start, end } = startEndMinMaxDate;

  const onSaveAndUpdate = () => {
    onUpdateDrill({ ...data, locked: !data.locked });
  };

  const onDatePickerConfirm = (
    date: Date,
    type: 'startTimestamp' | 'endTimestamp'
  ) => {
    onUpdateDrill({ ...data, [type]: date.getTime() });
  };

  const renderDuration = () => {
    if (!startTimestamp || !endTimestamp) return null;
    const start = moment(startTime).format('HH:mm');
    const end = moment(endTime).format('HH:mm');
    const minutesDiff = moment(end, 'HH:mm').diff(
      moment(start, 'HH:mm'),
      'minutes'
    );
    const { hours, minutes } = toHoursAndMinutes(minutesDiff);

    return `${hours ? `${hours}h ` : ''}${minutes}m`;
  };

  const renderDrillName = () => {
    if (!locked && deletable) {
      return (
        <Pressable
          onPress={() =>
            navigation.navigate('DrillsModal', {
              type: isMatch
                ? DrillsModalType.extraTime
                : DrillsModalType.drills,
              onSubmit: (name) => onUpdateDrill({ ...data, name })
            })
          }
          style={[styles.column1, styles.drillNameEditBtn]}
        >
          <Text numberOfLines={1} style={[styles.text, { width: '80%' }]}>
            {label || name}
          </Text>
          <Icon style={{ transform: [{ rotateX: '180deg' }] }} icon="grey_up" />
        </Pressable>
      );
    }
    return <Text style={[styles.text, styles.column1]}>{label || name}</Text>;
  };

  return (
    <View style={styles.drillRow}>
      {showDeleteModal && (
        <DeleteDrillModal
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onDelete={() => {
            onDelete(data.id);
            setShowDeleteModal(false);
          }}
        />
      )}
      {showPeriodsModal && (
        <MatchDrillsModal
          visible={showPeriodsModal}
          onCancel={() => setShowPeriodsModal(false)}
          onSubmit={(name, _, label) => onUpdateDrill({ ...data, name, label })}
        />
      )}
      {renderDrillName()}
      <Text
        style={[
          styles.text,
          styles.column2,
          !locked && { color: variables.grey }
        ]}
      >
        {renderDuration()}
      </Text>
      <View style={[styles.wrapper, styles.column3]}>
        <Text style={styles.textSecondary}>Start</Text>
        {locked && (
          <Text style={styles.text}>
            {moment(startTimestamp).format('HH:mm')}
          </Text>
        )}
        {!locked && !disable && (
          <DateTimePIcker
            defaultValue={!!startTimestamp}
            value={startTimestamp ? startTime : undefined}
            mode="time"
            onConfirm={(date) => onDatePickerConfirm(date, 'startTimestamp')}
            customStyle={styles.dropdown}
            minimumDate={start.min}
            maximumDate={start.max}
          />
        )}
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.textSecondary}>End</Text>
        {locked && (
          <Text style={styles.text}>
            {moment(endTimestamp).format('HH:mm')}
          </Text>
        )}
        {!locked && !disable && (
          <DateTimePIcker
            defaultValue={!!endTimestamp}
            value={endTimestamp ? endTime : undefined}
            mode="time"
            onConfirm={(date) => onDatePickerConfirm(date, 'endTimestamp')}
            customStyle={styles.dropdown}
            minimumDate={end.min}
            maximumDate={end.max}
          />
        )}
      </View>
      <View style={styles.button}>
        {!locked && deletable && (
          <Pressable onPress={() => setShowDeleteModal(true)}>
            <Icon style={styles.delteIcon} icon="delete" />
          </Pressable>
        )}
      </View>
      <View style={styles.button}>
        {locked && (
          <Pressable onPress={onSaveAndUpdate}>
            <Icon style={styles.editIcon} icon="pen" />
          </Pressable>
        )}
        {!locked && startTimestamp && endTimestamp && (
          <Pressable onPress={onSaveAndUpdate}>
            <Icon style={styles.editIcon} icon="checkmark" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default DrillRow;

const styles = StyleSheet.create({
  button: {
    marginLeft: 30,
    width: 25
  },
  column1: { flex: 1, marginRight: 10 },
  column2: {
    marginRight: 70,
    textAlign: 'right',
    width: 75
  },
  column3: { marginRight: 80 },
  delteIcon: {
    color: variables.red
  },
  drillNameEditBtn: {
    alignItems: 'center',
    backgroundColor: variables.white,
    borderRadius: 8,
    flexDirection: 'row',
    height: 32,
    justifyContent: 'space-between',
    paddingHorizontal: 14
  },
  drillRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: variables.white,
    flexDirection: 'row',
    height: 42
  },
  dropdown: {
    backgroundColor: variables.white,
    borderRadius: 8,
    height: 32,
    width: 88
  },
  editIcon: {
    color: variables.chartLightGrey
  },
  text: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont
  },
  textSecondary: {
    color: variables.chartLightGrey,
    fontFamily: variables.mainFont,
    marginRight: 20
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    width: 130
  }
});
