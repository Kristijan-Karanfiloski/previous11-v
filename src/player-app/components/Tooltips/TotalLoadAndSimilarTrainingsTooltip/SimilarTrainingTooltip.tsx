import React from 'react';
import { Image, Text, View } from 'react-native';

import SimilarTrainingsImage from '../../../../assets/images/tooltip_similar_trainings.png';
import SimilarTrainingsHockeyImage from '../../../../assets/images/tooltip_similar_trainings_hockey.png';
import { selectActiveClub } from '../../../../redux/slices/clubsSlice';
import { useAppSelector } from '../../../../redux/store';
import { variables } from '../../../../utils/mixins';
import { commonStylesTooltip } from '../commonStylesTooltip';

const SimilarTrainingTooltip = () => {
  const activeClub = useAppSelector(selectActiveClub);
  const isHockey = activeClub.gameType === 'hockey';
  return (
    <View>
      <Text style={commonStylesTooltip.title}>Similar Trainings</Text>
      <Text style={commonStylesTooltip.text}>
        At Next11, we name the sessions based on their proximity to a match.
        {'\n'}
        {'\n'}If a training session happens 2 days{' '}
        <Text style={{ fontFamily: variables.mainFontBold }}>after</Text> a
        match, it’s called a '+2' training session. On the other hand, if it
        happens 2 days{' '}
        <Text style={{ fontFamily: variables.mainFontBold }}>before</Text> a
        match, it’s called a '-2' training session.
        {'\n'}
        {'\n'}By using this naming convention, it's easy to compare similar
        types of training sessions and ensure that you are preparing for matches
        in the most effective way possible.{'\n'}
        {'\n'}So, whether it's a +2 or -2 session, we're always working towards
        optimal performance.
      </Text>
      <Text style={commonStylesTooltip.heading}>Example</Text>
      <Image
        style={{ width: '100%', height: 150, marginBottom: 40, marginTop: 20 }}
        source={isHockey ? SimilarTrainingsHockeyImage : SimilarTrainingsImage}
        resizeMode="contain"
      />
      <Text style={commonStylesTooltip.text}>
        Let's say you have three matches scheduled in a two-week period. The
        first match is on a Sunday, the second match is on a Friday, and the
        third match is also on a Friday.{'\n'}
        {'\n'}To make it easier to keep track of training and recovery days, we
        use a naming convention based on the proximity to each match.{'\n'}
        {'\n'}The day immediately following a match is called "+1," and the
        second day after the match is called "+2."{'\n'}
        {'\n'}All other days leading up to the next match are designated with a
        minus sign (-), indicating the number of days until the next match.
        {'\n'}
        {'\n'}This system helps us plan training and recovery activities in a
        way that optimizes performance and minimizes the risk of injury.
      </Text>
    </View>
  );
};

export default SimilarTrainingTooltip;
