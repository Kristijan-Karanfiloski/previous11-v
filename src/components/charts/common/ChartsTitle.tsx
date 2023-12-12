import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

import { variables } from '../../../utils/mixins';
import ExplanationModalContainer from '../../common/explanations/ExplanationModalContainer';
import { Icon } from '../../icon/icon';

import ChartTitleLegend from './ChartTitleLegend';

type ChartsTitleProps = {
  title: string;
  subTitle?: string;
  hasTitleLegend?: boolean;
  titleLegend?: {
    legendTitle: string;
    legends: { color: string; text: string }[];
  };
  modalType: string;
  hasAdditionalLegend?: boolean;
  hasRealTimeToggle?: boolean;
  isRealTime?: boolean;
  handleRealTime?: () => void;
};

function ChartsTitle({
  title,
  subTitle,
  hasTitleLegend,
  titleLegend = {
    legendTitle: '',
    legends: [{ color: '', text: '' }]
  },
  modalType,
  hasAdditionalLegend = false,
  hasRealTimeToggle = false,
  isRealTime = false,
  handleRealTime = () => {}
}: ChartsTitleProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const handleShowExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  if (hasRealTimeToggle) {
    return (
      <View
        style={[
          styles.titleWithLegendContainer,
          hasAdditionalLegend && { marginBottom: 45 }
        ]}
      >
        {hasAdditionalLegend && (
          <View style={styles.additionalLegend}>
            <Text style={styles.additionalLegendText}>INTENSITY</Text>
          </View>
        )}
        <View>
          <View style={styles.titleContainerV2}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subTitle}>{subTitle}</Text>
            {modalType !== 'none' && (
              <TouchableOpacity onPress={handleShowExplanation}>
                <Icon
                  icon="info_icon"
                  style={{
                    color: variables.lighterGrey,
                    fill: 'currentColor',
                    marginLeft: 10
                  }}
                />
              </TouchableOpacity>
            )}
            <ExplanationModalContainer
              isVisible={showExplanation}
              toggleModal={handleShowExplanation}
              showModal={modalType}
            />
          </View>
          <View style={styles.marginTop10}>
            {hasTitleLegend && <ChartTitleLegend titleLegend={titleLegend} />}
          </View>
        </View>

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Real Time</Text>
          <Switch
            value={isRealTime}
            onValueChange={handleRealTime}
            trackColor={{
              true: variables.batterieGreen,
              false: variables.lightGrey
            }}
            ios_backgroundColor={variables.lightGrey}
            style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}
          />
        </View>
      </View>
    );
  }

  if (hasTitleLegend) {
    return (
      <View
        style={[
          styles.titleWithLegendContainer,
          hasAdditionalLegend && { marginBottom: 45 }
        ]}
      >
        {hasAdditionalLegend && (
          <View style={styles.additionalLegend}>
            <Text style={styles.additionalLegendText}>INTENSITY</Text>
          </View>
        )}
        <View style={styles.titleContainerV2}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
          {modalType !== 'none' && (
            <TouchableOpacity onPress={handleShowExplanation}>
              <Icon
                icon="info_icon"
                style={{
                  color: variables.lighterGrey,
                  fill: 'currentColor',
                  marginLeft: 10
                }}
              />
            </TouchableOpacity>
          )}
          <ExplanationModalContainer
            isVisible={showExplanation}
            toggleModal={handleShowExplanation}
            showModal={modalType}
          />
        </View>
        {hasTitleLegend && <ChartTitleLegend titleLegend={titleLegend} />}
      </View>
    );
  }
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
      {modalType !== 'none' && (
        <TouchableOpacity onPress={handleShowExplanation}>
          <Icon
            icon="info_icon"
            style={{
              color: variables.lighterGrey,
              fill: 'currentColor',
              marginLeft: 10
            }}
          />
        </TouchableOpacity>
      )}
      <ExplanationModalContainer
        isVisible={showExplanation}
        toggleModal={handleShowExplanation}
        showModal={modalType}
      />
    </View>
  );
}
export default ChartsTitle;
const styles = StyleSheet.create({
  additionalLegend: {
    position: 'absolute',
    right: 0,
    top: '120%'
  },
  additionalLegendText: {
    color: variables.chartLightGrey,
    fontFamily: variables.mainFont
  },
  marginTop10: {
    marginTop: 10
  },
  subTitle: {
    color: variables.textLightBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 14,
    marginLeft: 8,
    textTransform: 'uppercase'
  },
  title: {
    color: variables.textBlack,
    fontFamily: variables.mainFontMedium,
    fontSize: 14,
    textTransform: 'uppercase'
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12
  },
  titleContainerV2: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  titleWithLegendContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    width: '100%'
  },
  toggleContainer: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  toggleText: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 12
  }
});
