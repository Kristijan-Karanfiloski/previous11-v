import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';

import { DropdownFilterKeys, FilterStateType } from '../../../types';
import { selectComparisonFilter } from '../../redux/slices/filterSlice';
import { useAppSelector } from '../../redux/store';
import { color, typography } from '../../theme';
import { variables } from '../../utils/mixins';

interface IndicatorTabProps {
  number?: number | string;
  label?: string;
  isActive?: boolean;
  onClick?(): void;
  locked?: boolean;
  isSmall?: boolean;
  badge?: string;
  isMatch?: boolean;
  style?: ViewStyle;
  filterType?: FilterStateType;
}

const IndicatorTab = (props: IndicatorTabProps) => {
  const {
    label,
    isActive,
    isSmall,
    onClick = () => undefined,
    locked,
    number,
    badge,
    style,
    filterType = FilterStateType.training
  } = props;

  const numberDisplay = number || 0;

  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, filterType)
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        !locked && onClick();
      }}
    >
      <View
        style={[
          style,
          styles.indicatorTab,
          isActive && styles.indicatorTabActive
        ]}
      >
        {label === 'INTENSITY'
          ? (
          <View
            style={[styles.indicatorTop, !isSmall && { alignItems: 'center' }]}
          >
            <Text
              style={[
                styles.indicatorNumber,
                isSmall ? styles.indicatorNumberSmall : {},
                {
                  color: variables.red,
                  fontFamily: variables.mainFontBold,
                  fontSize: 30,
                  marginTop: 18,
                  marginBottom: 5
                }
              ]}
            >
              LIVE
            </Text>
          </View>
            )
          : (
          <View
            style={[styles.indicatorTop, !isSmall && { alignItems: 'center' }]}
          >
            <Text
              style={[
                styles.indicatorNumber,
                isSmall ? styles.indicatorNumberSmall : {},
                {
                  color: locked
                    ? color.palette.tipGrey
                    : color.palette.realWhite
                }
              ]}
            >
              {locked
                ? `--`
                : `${numberDisplay}${
                    comparisonFilter.key === DropdownFilterKeys.DONT_COMPARE
                      ? ''
                      : '%'
                  }`}
            </Text>
          </View>
            )}
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.indicatorText,
              {
                color: locked ? color.palette.tipGrey : color.palette.realWhite
              }
            ]}
          >
            {label}
          </Text>
        </View>
        {isActive && !locked && <View style={styles.bottomActiveLine} />}
        {badge && <Text style={styles.badge}>{badge}</Text>}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default IndicatorTab;

const styles = StyleSheet.create({
  badge: {
    color: color.palette.tipGrey,
    fontFamily: typography.fontMedium,
    fontSize: 12,
    left: 12,
    lineHeight: 16,
    position: 'absolute',
    top: 6
  },
  bottomActiveLine: {
    backgroundColor: color.palette.orange,
    bottom: 0,
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0
  },
  indicatorNumber: {
    color: color.palette.realWhite,
    fontFamily: typography.fontMedium,
    fontSize: 55
  },
  indicatorNumberSmall: {
    fontSize: 50
  },
  indicatorTab: {
    alignItems: 'center',
    minHeight: 112
  },
  indicatorTabActive: {
    backgroundColor: color.palette.grey,
    borderRadius: 4,
    overflow: 'hidden'
  },
  indicatorText: {
    color: color.palette.realWhite,
    fontFamily: typography.fontMedium,
    fontSize: 12,
    textTransform: 'uppercase'
  },
  indicatorTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
