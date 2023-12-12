import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import Button from '../../Button';
// import SimilarTrainingTooltip from './SimilarTrainingTooltip';
import TotalLoadTrainingTooltip from '../TotalLoadAndSimilarTrainingsTooltip/TotalLoadTrainingTooltip';

import WeeklyEffortTooltip from './WeeklyEffortTooltip';

type Props = {
  tooltipType: 'similarTrainings' | 'totalLoad' | 'weeklyEffort';
};

const TotalLoadAndSimilarTrainingsTooltip = (props: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const [tooltipType, setTooltipType] = useState(props.tooltipType);

  const buttonText =
    tooltipType === 'weeklyEffort' ? 'Total Load' : 'Weekly Effort';

  const onButtonPress = () => {
    setTooltipType((prevState) =>
      prevState === 'weeklyEffort' ? 'totalLoad' : 'weeklyEffort'
    );
  };
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      y: 0,
      animated: false
    });
  }, [tooltipType]);

  return (
    <ScrollView style={{ paddingHorizontal: 20 }} ref={scrollRef}>
      {tooltipType === 'totalLoad' && (
        <TotalLoadTrainingTooltip
          setTooltipType={setTooltipType}
          otherTooltipType="weeklyEffort"
        />
      )}
      {tooltipType === 'weeklyEffort' && (
        <WeeklyEffortTooltip setTooltipType={setTooltipType} />
      )}
      <Button onPress={onButtonPress} label="LEARN ABOUT" text={buttonText} />
    </ScrollView>
  );
};

export default TotalLoadAndSimilarTrainingsTooltip;
