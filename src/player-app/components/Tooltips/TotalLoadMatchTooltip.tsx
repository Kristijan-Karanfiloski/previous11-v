import React from 'react';
import { Image, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import TotalLoadImage from '../../../assets/images/tooltip_total_load_match.png';

import { commonStylesTooltip } from './commonStylesTooltip';

const TotalLoadMatchTooltip = () => {
  return (
    <ScrollView style={{ paddingHorizontal: 20 }}>
      <Text style={commonStylesTooltip.title}>Total Load</Text>
      <Text style={commonStylesTooltip.text}>
        Total Load is a measure of your physical activity captured by the player
        tag.{'\n'}
        {'\n'}By tracking your movements during a training or a match, we can
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
      <Image
        style={{ height: 176, width: '100%', marginBottom: 40 }}
        source={TotalLoadImage}
        resizeMode="contain"
      />
      <Text style={commonStylesTooltip.heading}>Benchmark - Matches</Text>
      <Text style={commonStylesTooltip.text}>
        During matches, we use your highest physical match performance as a
        benchmark to track your progress and help you improve your game.{'\n'}
        {'\n'}We compare your performance to the match with the highest Total
        Load, so you can see where you stand and set your sights on reaching new
        heights.
      </Text>
    </ScrollView>
  );
};

export default TotalLoadMatchTooltip;
