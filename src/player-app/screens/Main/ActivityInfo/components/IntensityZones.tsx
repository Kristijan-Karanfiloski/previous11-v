import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { IntensityZones as IntensityZonesType } from '../../../../../../types';
import { Icon } from '../../../../../components/icon/icon';
import { variables } from '../../../../../utils/mixins';
import ProgressBarGraph from '../../../../components/ProgressBarGraph';
import { getZonesData } from '../../../../heleprs';

type Props = {
  zones: IntensityZonesType | undefined;
};

const IntensityZones = ({ zones }: Props) => {
  const navigation = useNavigation();
  const { explosive, veryHigh, high, low, moderate } = getZonesData(zones);

  if (!zones) return null;
  return (
    <>
      <View>
        <Pressable
          style={styles.infoIcon}
          onPress={() =>
            navigation.navigate('TooltipModal', {
              modal: 'intensity'
            })
          }
        >
          <Icon icon="info_icon" style={{ color: '#DADADA' }} />
        </Pressable>
        <Text style={styles.title}>Time in Intensity Zones</Text>
      </View>

      <ProgressBarGraph
        title="explosive"
        time={explosive.time}
        color={'#EC407A'}
        percentage={explosive.percentageFromTotal}
      />
      <ProgressBarGraph
        title="VERY HIGH"
        time={veryHigh.time}
        color={'#FFC107'}
        percentage={veryHigh.percentageFromTotal}
      />
      <ProgressBarGraph
        title="HIGH"
        time={high.time}
        color={'#7E57C2'}
        percentage={high.percentageFromTotal}
      />
      <ProgressBarGraph
        title="MODERATE"
        time={moderate.time}
        color={'#26C6DA'}
        percentage={moderate.percentageFromTotal}
      />
      <ProgressBarGraph
        title="LOW"
        time={low.time}
        color={'#78909C'}
        percentage={low.percentageFromTotal}
      />
    </>
  );
};

export default IntensityZones;

const styles = StyleSheet.create({
  infoIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },

  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 18,
    marginBottom: 28
  }
});
