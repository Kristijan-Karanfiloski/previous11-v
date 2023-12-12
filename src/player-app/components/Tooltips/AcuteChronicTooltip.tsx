import React from 'react';
import { Image, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import AcuteChronicImage from '../../../assets/images/AcuteChronicTooltipImage.png';

import { commonStylesTooltip } from './commonStylesTooltip';

const AcuteChronicTooltip = () => {
  const textStyle = { ...commonStylesTooltip.text, marginBottom: 15 };
  return (
    <ScrollView style={{ paddingHorizontal: 20 }}>
      <Text style={commonStylesTooltip.title}>
        Acute:Chronic Workload Ratio
      </Text>
      <Text style={textStyle}>
        Gain a deeper understanding of your load-variety by tracking your
        acute:chronic workload ratio. ACWR compares your short-term and
        long-term training and match loads to help you assess your training
        intensity and potential injury risk.
      </Text>
      <Text style={{ ...commonStylesTooltip.heading, marginBottom: 25 }}>
        How it works
      </Text>
      <Text style={commonStylesTooltip.subHeading}>Acute Load</Text>
      <Text style={textStyle}>
        This represents your average workload over the past 7 days, reflecting
        the immediate training stress on your body.
      </Text>
      <Text style={commonStylesTooltip.subHeading}>Chronic Load</Text>
      <Text style={textStyle}>
        This is your long-term average workload measured over a 28-day period,
        providing a baseline for comparison and reflecting your overall load
        during that time.
      </Text>
      <Text style={commonStylesTooltip.subHeading}>
        A:C Ratio & Optimal Load
      </Text>
      <Text style={textStyle}>
        Your a:c workload ratio is calculated by dividing your short term
        (acute) load by your long term (chronic) load. {'\n'}
        The ideal range is between 0.75-1.25, as indicated by the green band in
        the graph. Staying within this range helps you maintain or improve your
        fitness without risking injury from overtraining.
      </Text>
      <Image
        style={{ height: 300, width: '100%', marginBottom: 20, marginTop: -40 }}
        source={AcuteChronicImage}
        resizeMode="contain"
      />
      <Text style={commonStylesTooltip.title}>Why it matters</Text>
      <Text style={textStyle}>
        Monitoring and managing the balance between your acute and chronic load
        is essential. It empowers you to make informed decisions about your
        training volume, intensity, and progression. By staying within the
        optimal load range, you can achieve your fitness goals while reducing
        the risk of injury.
      </Text>
    </ScrollView>
  );
};

export default AcuteChronicTooltip;
