import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

import Button from '../../Button';

import SimilarTrainingTooltip from './SimilarTrainingTooltip';
import TotalLoadTrainingTooltip from './TotalLoadTrainingTooltip';

type Props = {
  tooltipType: 'similarTrainings' | 'totalLoad' | 'weeklyEffort';
};

const TotalLoadAndSimilarTrainingsTooltip = (props: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const [tooltipType, setTooltipType] = useState(props.tooltipType);

  const buttonText =
    tooltipType === 'similarTrainings' ? 'Total Load' : 'Similar Trainings';

  const onButtonPress = () => {
    setTooltipType((prevState) =>
      prevState === 'similarTrainings' ? 'totalLoad' : 'similarTrainings'
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
          otherTooltipType="similarTrainings"
        />
      )}
      {tooltipType === 'similarTrainings' && <SimilarTrainingTooltip />}
      <Button onPress={onButtonPress} label="LEARN ABOUT" text={buttonText} />
    </ScrollView>
  );
};

export default TotalLoadAndSimilarTrainingsTooltip;
