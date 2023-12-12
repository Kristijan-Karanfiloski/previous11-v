import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { Icon } from '../../../../components/icon/icon';
import { variables } from '../../../../utils/mixins';

type DataType = {
  date: string;
  acuteLoad: number;
  chronicLoad: number;
  acuteChronicRatio: number;
};

type Props = {
  data: DataType;
  selectedItem: DataType;
  type: string;
};

const ListItem = ({ data, selectedItem, type }: Props) => {
  const icon =
    data.acuteChronicRatio > 1.25
      ? 'arrow_upward'
      : data.acuteChronicRatio < 0.75
        ? 'arrow_downward'
        : 'spot_on';

  const iconStyle = icon === 'spot_on' ? styles.iconSpotOn : styles.iconArrow;
  return (
    <View style={styles.container}>
      {selectedItem && selectedItem.date === data.date && (
        <View style={styles.redBar} />
      )}
      <Text style={[styles.text, styles.column1]}>
        {moment(data.date, 'YYYY/MM/DD').format('MMMM DD')}
      </Text>
      <Text numberOfLines={1} style={[styles.text, styles.column2]}>
        {type}
      </Text>
      <Text style={[styles.text, styles.column3]}>
        {data.acuteLoad.toFixed()} : {data.chronicLoad.toFixed()}
      </Text>
      <View style={styles.column4}>
        <Text style={styles.textSecondary}>
          {data.acuteChronicRatio.toFixed(2)}
        </Text>
        <View style={styles.iconContainer}>
          <Icon
            containerStyle={icon !== 'spot_on' ? styles.icon : {}}
            style={iconStyle}
            icon={icon}
          />
        </View>
      </View>
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  column1: {
    width: 100
  },
  column2: { flex: 1 },
  column3: { flex: 1, textAlign: 'center' },
  column4: { flexDirection: 'row', justifyContent: 'flex-end', width: 50 },
  container: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    borderBottomWidth: 1,
    borderColor: variables.lineGrey,
    flexDirection: 'row',
    height: 44,
    paddingHorizontal: 16
  },
  icon: {
    marginRight: 2
  },
  iconArrow: {
    height: 12,
    width: 12
  },
  iconContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 20
  },
  iconSpotOn: {
    height: 16,
    width: 16
  },
  redBar: {
    backgroundColor: variables.red,
    borderRadius: 5,
    height: '100%',
    left: 0,
    position: 'absolute',
    width: 6
  },
  text: {
    color: variables.textBlack,
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  textSecondary: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 12
  }
});
