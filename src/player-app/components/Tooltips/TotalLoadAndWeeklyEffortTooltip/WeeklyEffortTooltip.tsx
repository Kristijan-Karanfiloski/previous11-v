import React from 'react';
import { Image, ScrollView, Text } from 'react-native';

import WeeklyEffortImage from '../../../../assets/images/tooltip_weekly_effort.png';
import { Icon } from '../../../../components/icon/icon';
import { variables } from '../../../../utils/mixins';
import { commonStylesTooltip } from '../commonStylesTooltip';

type Props = {
  setTooltipType: React.Dispatch<
    React.SetStateAction<'similarTrainings' | 'totalLoad' | 'weeklyEffort'>
  >;
};
const WeeklyEffortTooltip = ({ setTooltipType }: Props) => {
  return (
    <ScrollView>
      <Text style={commonStylesTooltip.title}>Weekly Effort</Text>
      <Text style={commonStylesTooltip.text}>
        The Weekly Effort view is a helpful tool that shows you an accumulation
        of your{' '}
        <Text
          onPress={() => {
            setTooltipType('totalLoad');
          }}
          style={{ fontFamily: variables.mainFontBold }}
        >
          Total Load
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
        for this week so far. You can also navigate to any of the past 12 weeks
        by using the arrows.
      </Text>

      <Text style={commonStylesTooltip.heading}>Weekly range</Text>
      <Text style={commonStylesTooltip.text}>
        It also compares your current effort to your past 12 weeks of exercise,
        giving you an idea of how you're doing. This is represented by the green
        band in the middle of the graph.{'\n'}
        {'\n'}This band represents your optimal range, which is the amount of
        exercise you should aim for if you want to maintain or improve your
        fitness without risking injury from overtraining.
      </Text>
      <Image
        style={{
          height: 180,
          marginBottom: 40,
          // backgroundColor: 'red',
          width: '100%'
        }}
        source={WeeklyEffortImage}
        resizeMode="contain"
      />

      <Text style={commonStylesTooltip.text}>
        <Text style={{ fontFamily: variables.mainFontBold }}>
          {'\u2022'} Within range:
        </Text>{' '}
        If you're exercising within this range, then you're right on track with
        your average amount of training over the past 12 weeks.{'\n'}
        {'\n'}
        <Text style={{ fontFamily: variables.mainFontBold }}>
          {'\u2022'} Below range:
        </Text>{' '}
        If you're exercising below the range, then you're doing less than your
        average amount of exercise from the past 12 weeks. This can be
        beneficial for your body to recover and rest. {'\n'}
        {'\n'}
        <Text style={{ fontFamily: variables.mainFontBold }}>
          {'\u2022'} Above range:
        </Text>{' '}
        If you're exercising above the range, then you're doing more than your
        average amount of exercise from the past 12 weeks. This may indicate
        that you're increasing your exercise efforts too quickly and potentially
        increasing the risk of injury. It's important to be mindful of this and
        adjust your exercise routine accordingly to stay safe and healthy.
      </Text>
    </ScrollView>
  );
};

export default WeeklyEffortTooltip;
