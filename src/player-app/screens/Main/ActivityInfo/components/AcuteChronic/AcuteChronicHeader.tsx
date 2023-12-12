import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Icon } from '../../../../../../components/icon/icon';
import { variables } from '../../../../../../utils/mixins';

interface Props {
  acuteChronicRatio?: number | null;
  acuteLoad?: number | null;
  chronicLoad?: number | null;
}

const AcuteChronicHeader = ({
  acuteChronicRatio,
  acuteLoad,
  chronicLoad
}: Props) => {
  const navigation = useNavigation();

  const getIcon = () => {
    if (acuteChronicRatio && acuteChronicRatio > 1.25) {
      return 'arrow_upward';
    }
    if (acuteChronicRatio && acuteChronicRatio < 0.75) {
      return 'arrow_downward';
    }
    return 'spot_on';
  };

  return (
    <View style={styles.mainContainer}>
      <Pressable
        style={styles.infoIcon}
        onPress={() =>
          navigation.navigate('TooltipModal', {
            modal: 'acuteChronic'
          })
        }
      >
        <Icon icon="info_icon" style={{ color: '#DADADA' }} />
      </Pressable>
      <Text style={styles.title}>Acute:Chronic Workload Ratio</Text>
      <View style={styles.container}>
        <View style={styles.acuteChronicContainer}>
          <Text style={styles.acRatioText}>
            {acuteChronicRatio?.toFixed(2) || '-'}
          </Text>
          {acuteChronicRatio && (
            <Icon icon={getIcon()} containerStyle={{ marginLeft: 5 }} />
          )}
        </View>
        <View style={styles.marginRight10}>
          <View style={styles.acuteChronicContainer}>
            <Text
              style={StyleSheet.flatten([styles.marginRight10, styles.text])}
            >
              {acuteLoad?.toFixed(0) || '-'}
            </Text>
            <Text style={styles.subText}>
              Acute <Text style={styles.lightFont}>{`(7 day avg.)`}</Text>
            </Text>
          </View>

          <View style={styles.acuteChronicContainer}>
            <Text
              style={StyleSheet.flatten([styles.marginRight10, styles.text])}
            >
              {chronicLoad?.toFixed(0) || '-'}
            </Text>
            <Text style={styles.subText}>
              Chronic <Text style={styles.lightFont}>{`(28 day avg.)`}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AcuteChronicHeader;

const styles = StyleSheet.create({
  acRatioText: {
    fontFamily: variables.mainFontBold,
    fontSize: 40
  },
  acuteChronicContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  lightFont: {
    fontFamily: variables.mainFontLight
  },
  mainContainer: {
    marginBottom: 10
  },
  marginRight10: {
    marginRight: 10
  },
  subText: {
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  text: {
    fontFamily: variables.mainFontBold,
    fontSize: 12
  },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 18,
    marginBottom: 28
  }
});
