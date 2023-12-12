import React, { useMemo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { GameAny, GameType } from '../../../types';
import { variables } from '../../utils/mixins';
import LinearGradientView from '../LinearGradientView';

type Props = {
  event: GameAny;
  customStyle?: ViewStyle;
  linGradIndex?: number;
};

const LeftIndicator = ({ event, customStyle, linGradIndex = 0 }: Props) => {
  const isMatch = event.type === GameType.Match;
  const isFinal = event.status?.isFinal;

  const containerStyle = useMemo(
    () => StyleSheet.flatten([styles.container, customStyle]),
    [customStyle]
  );

  const colors = useMemo(() => {
    if (isFinal) {
      return [
        { offset: 0, color: isMatch ? '#C258FF' : '#58B1FF' },
        { offset: 1, color: isMatch ? '#654CF4' : '#00E591' }
      ];
    }
    return [{ offset: 0, color: variables.grey2 }];
  }, [isFinal, isMatch]);

  return (
    <LinearGradientView
      index={`${event.id}${linGradIndex}`}
      linearGradient={{ y2: '100%' }}
      colors={colors}
      style={containerStyle}
    />
  );
};

export default LeftIndicator;

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.grey2,
    height: '100%',
    width: 7
  }
});
