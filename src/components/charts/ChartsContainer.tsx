import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ZoneSelector } from '../../types';
import { variables } from '../../utils/mixins';

import ChartIntensityZonesSelector from './common/ChartIntensityZonesSelector';
import ChartsTitle from './common/ChartsTitle';

type ChartsContainerProps = {
  title: string;
  subTitle?: string;
  children: ReactNode;
  hasTwoCharts?: boolean;
  secondTitle?: string;
  secondSubTitle?: string;
  hasTitleLegend?: boolean;
  titleLegend?: {
    legendTitle: string;
    legends: { color: string; text: string }[];
  };
  hasZoneSelector?: boolean;
  typeOfZoneSelector?: string;
  activeSelector?: {
    label: string;
    color: string;
    key: string;
    aboveAverageColor: string;
    sort?: number;
  };
  onSelectHandler?: (zone: ZoneSelector) => void;
  modalType?: string;
  secondModalType?: string;
  onMonthChangeHandler?: (indicator?: boolean) => void;
  eventDate?: string;
  hasAdditionalLegend?: boolean;
  hasRealTimeToggle?: boolean;
  isRealTime?: boolean;
  handleRealTime?: () => void;
};

const ChartsContainer = ({
  title,
  subTitle,
  children,
  hasTwoCharts,
  secondTitle = '',
  secondSubTitle = '',
  hasTitleLegend = false,
  titleLegend = {
    legendTitle: '',
    legends: [{ color: '', text: '' }]
  },
  hasZoneSelector,
  typeOfZoneSelector = '',
  activeSelector = {
    label: '',
    color: '',
    key: '',
    aboveAverageColor: '',
    sort: 0
  },
  onSelectHandler = () => {},
  modalType = 'none',
  secondModalType = 'none',
  onMonthChangeHandler = () => {},
  eventDate = '',
  hasAdditionalLegend = false,
  hasRealTimeToggle = false,
  isRealTime = false,
  handleRealTime = () => {}
}: ChartsContainerProps) => {
  const renderChildren = (index: number) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return children && children[index];
  };

  if (hasTwoCharts) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.chartContainer}>
          <ChartsTitle
            title={title}
            subTitle={subTitle}
            hasTitleLegend={hasTitleLegend}
            titleLegend={titleLegend}
            modalType={modalType}
          />

          {renderChildren(0)}
          <ChartsTitle
            title={secondTitle}
            subTitle={secondSubTitle}
            modalType={secondModalType}
          />
          {renderChildren(1)}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.chartContainer}>
        <ChartsTitle
          title={title}
          subTitle={subTitle}
          hasTitleLegend={hasTitleLegend}
          titleLegend={titleLegend}
          modalType={modalType}
          hasAdditionalLegend={hasAdditionalLegend}
          hasRealTimeToggle={hasRealTimeToggle}
          isRealTime={isRealTime}
          handleRealTime={handleRealTime}
        />
        {hasZoneSelector && (
          <ChartIntensityZonesSelector
            type={typeOfZoneSelector}
            onSelectHandler={onSelectHandler}
            activeSelector={activeSelector}
            onMonthChangeHandler={onMonthChangeHandler}
            eventDate={eventDate}
          />
        )}
        {children}
      </View>
    </View>
  );
};

export default ChartsContainer;

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: variables.realWhite,
    elevation: 3,
    marginBottom: 20,
    padding: 20,
    shadowColor: variables.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22
  },
  mainContainer: {
    padding: 10,
    width: '100%'
  }
});
