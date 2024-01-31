import React from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';

import { variables } from '../../../utils/mixins';

interface GameCardPlaceholderProps {
  testID?: string;
}

const GameCardPlaceholder: React.FC<GameCardPlaceholderProps> = ({
  testID
}) => {
  return (
    <ContentLoader
      height={150}
      width={370}
      viewBox="0 0 370 150"
      backgroundColor={variables.lightestGrey}
      foregroundColor={variables.greyC3}
      testID={testID}
      // {...props}
    >
      <Circle cx="70.2" cy="73.2" r="41.3" />
      <Rect x="129.9" y="29.5" width="125.5" height="17" />
      <Rect x="129.9" y="64.7" width="296" height="17" />
      <Rect x="129.9" y="97.8" width="253.5" height="17" />

      <Circle cx="70.7" cy="243.5" r="41.3" />
      <Rect x="130.4" y="199.9" width="125.5" height="17" />
      <Rect x="130.4" y="235" width="296" height="17" />
      <Rect x="130.4" y="268.2" width="253.5" height="17" />

      <Circle cx="70.7" cy="412.7" r="41.3" />
      <Rect x="130.4" y="369" width="125.5" height="17" />
      <Rect x="130.4" y="404.2" width="296" height="17" />
      <Rect x="130.4" y="437.3" width="253.5" height="17" />
    </ContentLoader>
  );
};

export default GameCardPlaceholder;
