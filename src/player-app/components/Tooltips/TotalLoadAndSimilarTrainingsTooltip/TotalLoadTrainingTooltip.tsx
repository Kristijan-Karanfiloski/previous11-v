import React from 'react';
import { Image, Text, View } from 'react-native';

import TotalLoadImage from '../../../../assets/images/tooltip_total_load_training.png';
import { Icon } from '../../../../components/icon/icon';
import { variables } from '../../../../utils/mixins';
import { commonStylesTooltip } from '../commonStylesTooltip';

type Props = {
  setTooltipType: React.Dispatch<
    React.SetStateAction<'similarTrainings' | 'totalLoad' | 'weeklyEffort'>
  >;

  otherTooltipType: 'similarTrainings' | 'weeklyEffort';
};

const TotalLoadTooltip = ({ setTooltipType, otherTooltipType }: Props) => {
  return (
    <View>
      <Text style={commonStylesTooltip.title}>Total Load</Text>
      <Text style={commonStylesTooltip.text}>
        Total Load is a measure of your physical activity captured by the player
        tag. {'\n'}
        {'\n'}
        By tracking your movements during a training or a match, we can
        calculate a number that reflects the level of stress on your muscles,
        ligaments and bones.{'\n'}
        {'\n'}The more intense the movement, like sprinting, the higher the Load
        number. This helps coaches and players understand the physical demands
        of the game and tailor training accordingly.{'\n'}
        {'\n'}As every player is different, the Total Load can vary from one
        person to another depending on factors like height and body type.
        Therefore, you should only compare your own performance from one
        tracking session to the next by looking at your benchmark.
      </Text>
      <Text style={commonStylesTooltip.heading}>Benchmark - Trainings</Text>
      <Text style={commonStylesTooltip.text}>
        Consistency is key to achieving optimal performance and prevent
        injuries. {'\n'}
        {'\n'}That's why we help you aim to keep the Total Load consistent
        across{' '}
        <Text
          onPress={() => {
            if (otherTooltipType !== 'similarTrainings') return;
            setTooltipType(otherTooltipType);
          }}
          style={{ fontFamily: variables.mainFontBold }}
        >
          similar training sessions
          <Icon
            icon="info_icon"
            style={{ color: '#000', height: 14, width: 14, marginLeft: 3 }}
            containerStyle={{
              height: 14,
              width: 14,
              marginLeft: 3
            }}
          />
        </Text>{' '}
        by providing a benchmark next to your Total Load.
      </Text>
      <Image
        style={{ height: 203, width: '100%' }}
        source={TotalLoadImage}
        resizeMode="contain"
      />
      <Text style={commonStylesTooltip.text}>
        The benchmark shows how much higher or lower your Total Load is compared
        to the average of all your previous{' '}
        <Text
          onPress={() => {
            if (otherTooltipType !== 'similarTrainings') return;
            setTooltipType(otherTooltipType);
          }}
          style={{ fontFamily: variables.mainFontBold }}
        >
          similar training sessions
          <Icon
            icon="info_icon"
            style={{ color: '#000', height: 14, width: 14, marginLeft: 3 }}
            containerStyle={{
              height: 14,
              width: 14,
              marginLeft: 3
            }}
          />
        </Text>{' '}
        {'\n'}
        {'\n'}If the Total Load is between 25% lower and 25% higher it is within
        the optimal range. {'\n'}
        {'\n'}This allows you to easily see if your Total Load is within, above,
        or below your optimal range.{'\n'}
        {'\n'}By keeping an eye on your Total Load and working towards your
        benchmark, you can ensure that you are achieving your goals in a
        sustainable way.
      </Text>
    </View>
  );
};

export default TotalLoadTooltip;
