import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { variables } from '../../../utils/mixins';

interface Props {
  playerFeedback: number | null;
  hasText?: boolean;
}

const RPECircles = ({ playerFeedback, hasText = false }: Props) => {
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => {
        return i + 1;
      }).map((circle, index) => {
        let circleStyle;
        let circleNumberStyle;
        if (playerFeedback === null || playerFeedback === circle) {
          switch (circle) {
            case 8:
              circleStyle = StyleSheet.flatten([
                styles.circle,
                styles.circlePurple
              ]);
              circleNumberStyle = StyleSheet.flatten([
                styles.circleNumber,
                styles.circleWhiteNumber
              ]);
              break;
            case 9:
              circleStyle = StyleSheet.flatten([
                styles.circle,
                styles.circleYellow
              ]);
              circleNumberStyle =
                playerFeedback === 9
                  ? styles.circleNumber
                  : StyleSheet.flatten([
                    styles.circleNumber,
                    styles.circleWhiteNumber
                  ]);
              break;
            case 10:
              circleStyle = StyleSheet.flatten([
                styles.circle,
                styles.circleRed
              ]);
              circleNumberStyle = StyleSheet.flatten([
                styles.circleNumber,
                styles.circleWhiteNumber
              ]);
              break;
            default:
              circleStyle = StyleSheet.flatten([
                styles.circle,
                styles.circleBlack
              ]);
              circleNumberStyle = StyleSheet.flatten([
                styles.circleNumber,
                styles.circleWhiteNumber
              ]);
              break;
          }
        } else {
          circleStyle = styles.circle;
          circleNumberStyle = styles.circleNumber;
        }
        const generateText = () => {
          if (index < 3) return 'Very Light';
          if (index < 5) return 'Light';
          if (index < 7) return 'Moderate';
          if (index < 9) return 'Hard';
          return 'Maximum efford';
        };

        return (
          <View
            key={index}
            style={[
              styles.circleContainer,
              hasText
                ? {
                    alignItems: 'center',
                    flex: 1,
                    height: 80,
                    marginTop: 10,
                    flexDirection: 'column'
                  }
                : {}
            ]}
          >
            <View
              style={[
                circleStyle,
                playerFeedback === null || hasText
                  ? { width: 45, height: 45 }
                  : {}
              ]}
            >
              <Text
                style={[
                  circleNumberStyle,
                  playerFeedback === null || hasText ? { fontSize: 16 } : {}
                ]}
              >
                {circle}
              </Text>
            </View>
            {playerFeedback === circle && hasText
              ? (
              <Text style={styles.feedbackText}>{generateText()}</Text>
                )
              : (
              <Text></Text>
                )}
          </View>
        );
      })}
    </>
  );
};

export default RPECircles;

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    borderColor: variables.backgroundColor,
    borderRadius: 25,
    borderWidth: 1,
    height: 25,
    justifyContent: 'center',
    marginRight: 12,
    width: 25
  },
  circleBlack: {
    backgroundColor: variables.black
  },
  circleContainer: {
    flexDirection: 'row'
  },
  circleNumber: {
    fontFamily: variables.mainFontSemiBold,
    fontSize: 12
  },
  circlePurple: {
    backgroundColor: variables.chartHigh
  },
  circleRed: {
    backgroundColor: variables.chartExplosive
  },
  circleWhiteNumber: {
    color: variables.realWhite
  },
  circleYellow: {
    backgroundColor: variables.yellowDark
  },
  feedbackText: {
    fontSize: 14,
    marginTop: 6
  }
});
