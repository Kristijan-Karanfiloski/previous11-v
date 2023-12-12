import React from 'react';
import { G, Rect, Svg } from 'react-native-svg';

import { variables } from '../../../../utils/mixins';

type Props = {
  dashes: null[];
  spacing: number;
  index: number;
};

const TwelveWeekOverviewDashLine = ({ dashes, spacing, index }: Props) => {
  return (
    <Svg key={index} height="1" width="100%">
      <G>
        {dashes.map((_, index) => (
          <Rect
            key={index}
            x="0"
            y="0"
            width="10"
            height="1"
            fill={variables.lineGrey}
            translateX={spacing * index}
          />
        ))}
      </G>
    </Svg>
  );
};

export default TwelveWeekOverviewDashLine;
