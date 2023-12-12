import React, { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { GameType } from '../../../types';
import { TRAINING_CATEOGRY_OPTIONS, variables } from '../../utils/mixins';
import Card from '../common/Card';
import DateTimePIcker from '../common/DateTimePicker';
import Dropdown from '../common/Dropdown';
import LinearGradientView from '../LinearGradientView';

enum WhereIsPlaying {
  Home = 'Home',
  Away = 'Away'
}
type PickerData = {
  eventDate: Date;
  trainingCategory: string;
  whereIsPlaying: WhereIsPlaying | string;
  opponentName: string;
  matchResult: {
    home: string;
    away: string;
  };
};
interface SessionPickerProps {
  eventType: GameType | null;
  onTypeChange?: (type: GameType) => void;
  additionalPickers?: boolean;

  data?: PickerData | any;
  setData?: (data: PickerData) => void;
  typePickerDisabled?: boolean;
}

const SessionPicker = ({
  eventType,
  onTypeChange,
  additionalPickers = false,
  data = {},
  setData,
  typePickerDisabled = false
}: SessionPickerProps) => {
  const onTypeSave = (type: GameType) => {
    onTypeChange?.(type);
  };

  const colors = useMemo(() => {
    if (eventType) {
      const isMatch = eventType === GameType.Match;
      return [
        { offset: 0, color: isMatch ? '#C258FF' : '#58B1FF' },
        { offset: 1, color: isMatch ? '#654CF4' : '#00E591' }
      ];
    }
    return [{ offset: 0, color: variables.grey2 }];
  }, [eventType]);

  const renderDateSection = () => {
    if (!eventType) return null;
    return (
      <View>
        <Text
          style={[
            styles.sectionText,
            {
              color: variables.textBlack,
              marginBottom: 20,
              fontFamily: variables.mainFontMedium
            }
          ]}
        >
          Date
        </Text>
        <Text
          style={[
            styles.sectionText,
            {
              color: variables.grey2,
              marginBottom: 10
            }
          ]}
        >
          Selected Date
        </Text>

        <DateTimePIcker
          value={data.eventDate}
          onConfirm={(date) =>
            setData?.({
              ...data,
              eventDate: date
            })
          }
          customStyle={{
            height: 32,
            borderRadius: 8
          }}
          placeholderText={{
            fontSize: 12,
            fontFamily: variables.mainFont
          }}
        />
      </View>
    );
  };

  const renderTrainingEventCategory = () => {
    if (!eventType) return null;
    return (
      <View>
        <Text
          style={[
            styles.sectionText,
            {
              color: variables.textBlack,
              marginBottom: 20,
              fontFamily: variables.mainFontMedium
            }
          ]}
        >
          Training category
        </Text>
        <Text
          style={[
            styles.sectionText,
            {
              color: variables.grey2,
              marginBottom: 10
            }
          ]}
        >
          Select category
        </Text>
        <Dropdown
          uiType="two"
          placeholder="Select category"
          value={data.trainingCategory}
          options={TRAINING_CATEOGRY_OPTIONS}
          onChange={(value) =>
            setData?.({
              ...data,
              trainingCategory: value
            })
          }
          preventUnselect
          dropdownHeight={127}
          containerStyle={{
            width: 130,
            height: 32,
            borderRadius: 8
          }}
          labelStyle={{
            fontSize: 12,
            fontFamily: variables.mainFont
          }}
        />
      </View>
    );
  };

  const renderMatchEventCategory = () => {
    if (!eventType) return null;
    return (
      <React.Fragment>
        <View>
          <Text
            style={[
              styles.sectionText,
              {
                color: variables.textBlack,
                marginBottom: 20,
                fontFamily: variables.mainFontMedium
              }
            ]}
          >
            Where?
          </Text>
          <Text
            style={[
              styles.sectionText,
              {
                color: variables.grey2,
                marginBottom: 10
              }
            ]}
          >
            Select location
          </Text>
          <Dropdown
            uiType="two"
            placeholder="Select where you playing"
            value={data.whereIsPlaying}
            options={[
              { label: 'Home', value: WhereIsPlaying.Home },
              { label: 'Away', value: WhereIsPlaying.Away }
            ]}
            onChange={(value) => setData?.({ ...data, whereIsPlaying: value })}
            preventUnselect
            dropdownHeight={90}
            containerStyle={{
              width: 90,
              height: 32,
              borderRadius: 8
            }}
            labelStyle={{
              fontSize: 12,
              fontFamily: variables.mainFont,
              color: variables.middleGrey
            }}
          />
        </View>
        <View>
          <Text
            style={[
              styles.sectionText,
              {
                color: variables.textBlack,
                marginBottom: 5,
                fontFamily: variables.mainFontMedium
              }
            ]}
          >
            Opponent and Result
          </Text>

          <TextInput
            placeholder="Enter opponent name"
            value={data.opponentName}
            onChangeText={(value) =>
              setData?.({
                ...data,
                opponentName: value
              })
            }
            style={[
              styles.textInput,
              {
                width: 160
              }
            ]}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginTop: 8
            }}
          >
            <TextInput
              selectTextOnFocus
              keyboardType="numeric"
              value={data.matchResult.home.toString() || '0'}
              maxLength={2}
              onChangeText={(value) =>
                setData?.({
                  ...data,
                  matchResult: {
                    ...data.matchResult,
                    home: value || '0'
                  }
                })
              }
              style={[
                styles.textInput,
                {
                  width: 50
                }
              ]}
            />
            <Text> - </Text>
            <TextInput
              selectTextOnFocus
              keyboardType="numeric"
              maxLength={2}
              value={data.matchResult.away.toString() || '0'}
              onChangeText={(value) =>
                setData?.({
                  ...data,
                  matchResult: {
                    ...data.matchResult,
                    away: value || '0'
                  }
                })
              }
              style={[
                styles.textInput,
                {
                  width: 50
                }
              ]}
            />
          </View>
        </View>
      </React.Fragment>
    );
  };

  return (
    <Card style={styles.section}>
      <Text style={styles.heading}>Load Tracked Session</Text>

      <View style={styles.sectionContent}>
        <View
          style={{
            paddingLeft: 25
          }}
        >
          <LinearGradientView
            index={eventType}
            linearGradient={{ y2: '100%' }}
            colors={colors}
            style={styles.linearContainer}
          />

          <Text
            style={[
              styles.sectionText,
              {
                color: variables.textBlack,
                marginBottom: 20,
                fontFamily: variables.mainFontMedium
              }
            ]}
          >
            Type of event
          </Text>
          <Text
            style={[
              styles.sectionText,
              {
                color: variables.grey2,
                marginBottom: 10
              }
            ]}
          >
            Match or training?
          </Text>
          <Dropdown
            disabled={additionalPickers || typePickerDisabled}
            uiType="two"
            placeholder="Select"
            value={eventType}
            options={[
              { label: 'Match', value: GameType.Match },
              { label: 'Training', value: GameType.Training }
            ]}
            onChange={onTypeSave}
            preventUnselect
            dropdownHeight={120}
            containerStyle={{
              width: 110,
              height: 32,
              borderRadius: 8
            }}
            labelStyle={{
              fontSize: 12,
              fontFamily: variables.mainFont
            }}
          />
        </View>
        {additionalPickers && (
          <>
            {renderDateSection()}
            {eventType === 'training'
              ? renderTrainingEventCategory()
              : renderMatchEventCategory()}
          </>
        )}

        <View style={{ flex: 0.3 }} />
      </View>
    </Card>
  );
};

export default SessionPicker;

const styles = StyleSheet.create({
  heading: {
    fontFamily: variables.mainFontMedium,
    fontSize: 24
  },
  linearContainer: {
    borderRadius: 2,
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: 7
  },
  section: {
    backgroundColor: variables.realWhite,
    borderRadius: 20,
    marginBottom: 27,
    marginHorizontal: 21,
    overflow: 'hidden',
    paddingHorizontal: 27,
    paddingVertical: 34
  },
  sectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20
  },
  sectionText: {
    fontFamily: variables.mainFont,
    fontSize: 12
  },
  textInput: {
    backgroundColor: variables.white,
    borderRadius: 8,
    color: variables.middleGrey,
    fontFamily: variables.mainFont,
    fontSize: 12,
    height: 32,
    paddingHorizontal: 14,
    paddingVertical: 8
  }
});
