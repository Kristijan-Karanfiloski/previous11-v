import React from 'react';
import { ScrollView, Text } from 'react-native';

import { selectActiveClub } from '../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../redux/store';
import { variables } from '../../../utils/mixins';

import { commonStylesTooltip } from './commonStylesTooltip';

const IntensityTooltip = () => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  return (
    <ScrollView style={{ paddingHorizontal: 20 }}>
      <Text style={commonStylesTooltip.title}>Time in Intensity Zones</Text>
      <Text style={commonStylesTooltip.text}>
        At Next11, we know that maximizing your potential requires tracking your
        performance in detail. That's why we use an intensity tracking system to
        help you get the most out of your training.{'\n'}
        {'\n'}We divide your intensity into five categories: Explosive, Very
        High, High, Moderate, and Low. By tracking how long you spend in each
        intensity zone, we can help you understand your performance. {'\n'}
        {'\n'}
        {'\u2022'}{' '}
        <Text style={{ fontFamily: variables.mainFontBold, color: '#EC407A' }}>
          Explosive
        </Text>{' '}
        activities require all-out movements, like sprinting as fast as possible
        or making very hard accelerations and decelerations. They demand maximal
        intensity and effort.
        {'\n'}
        {'\n'}
        {'\u2022'}{' '}
        <Text style={{ fontFamily: variables.mainFontBold, color: '#FFC107' }}>
          Very High
        </Text>{' '}
        activities are performed with near-maximal intensity, like{' '}
        {isHockey ? 'skating' : 'running'} at very high speeds or making quick
        cuts and changes of direction. {'\n'}
        {'\n'}
        {'\u2022'}{' '}
        <Text style={{ fontFamily: variables.mainFontBold, color: '#7E57C2' }}>
          High
        </Text>{' '}
        activities are performed at a high intensity, such as{' '}
        {isHockey ? 'skating' : 'running'} at high speeds for extended periods
        of time. {'\n'}
        {'\n'}
        {'\u2022'}{' '}
        <Text style={{ fontFamily: variables.mainFontBold, color: '#26C6DA' }}>
          Moderate
        </Text>{' '}
        activities are performed at a moderate intensity, like{' '}
        {isHockey ? 'skating' : 'running'} at a regular pace. {'\n'}
        {'\n'}
        {'\u2022'}{' '}
        <Text style={{ fontFamily: variables.mainFontBold, color: '#78909C' }}>
          Low
        </Text>{' '}
        activities are performed at a low intensity, like{' '}
        {isHockey ? 'slow skating or coasting' : 'jogging or walking'}. {'\n'}
        {'\n'}By tracking your intensity levels and durations, we can help you
        fine-tune your training to reach your full potential.
      </Text>
    </ScrollView>
  );
};

export default IntensityTooltip;
