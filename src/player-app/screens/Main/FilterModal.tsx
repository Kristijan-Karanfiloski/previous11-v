import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { Icon } from '../../../components/icon/icon';
import { selectAuth } from '../../../redux/slices/authSlice';
import { selectFinishedGamesByPlayer } from '../../../redux/slices/gamesSlice';
import {
  progressFilterState,
  setProgressFilter
} from '../../../redux/slices/progressFilter';
import { useAppSelector } from '../../../redux/store-player';
import { variables } from '../../../utils/mixins';
import {
  generateMatchComparisonArray,
  generateTrainingComparisonArray,
  getFilterOption,
  getFilterOptionTraining,
  initialProgressFilter,
  matchOptions,
  progressFilterFiltration,
  TrainingOptionsMinus,
  TrainingOptionsPlus
} from '../../heleprs';

const FilterModal = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const progressFilter = useAppSelector(progressFilterState);
  const [progressOptions, setProgressOptions] = useState(
    progressFilter?.filterOptions || initialProgressFilter
  );

  const auth = useAppSelector(selectAuth);
  const playerId = auth?.playerId || '';
  const playerGames = [
    ...useAppSelector((state) => selectFinishedGamesByPlayer(state, playerId))
  ].reverse();

  const filterNumber = useMemo(() => {
    return progressFilterFiltration(progressOptions, playerGames).length;
  }, [progressOptions]);

  const matchOptionsNumber = useMemo(() => {
    return progressOptions.allMatches
      ? 1
      : generateMatchComparisonArray(progressOptions).length;
  }, [progressOptions]);

  const trainingOptionsNumber = useMemo(() => {
    let trainingOptionsNumber = progressOptions.allTrainings
      ? 1
      : generateTrainingComparisonArray(progressOptions).length;
    if (progressOptions.individual) {
      trainingOptionsNumber++;
    }
    if (progressOptions.noCategory) {
      trainingOptionsNumber++;
    }
    return trainingOptionsNumber;
  }, [progressOptions]);

  const setFilter = (newFilter: any) => {
    const newProgressOptions = { ...progressOptions };
    const matchFilters = ['won', 'lost', 'tied'];

    const trainingFilters = [
      'matchday',
      'plusOne',
      'plusTwo',
      'plusThree',
      'minusOne',
      'minusTwo',
      'minusThree',
      'minusFour',
      'minusFive',
      'minusSix',
      'minusSeven',
      'minusEight'
    ];

    if (newFilter === 'individual') {
      newProgressOptions.individual = !newProgressOptions.individual;
      if (newProgressOptions.allTrainings) {
        newProgressOptions.allTrainings = !newProgressOptions.allTrainings;
      }
    }
    if (newFilter === 'noCategory') {
      newProgressOptions.noCategory = !newProgressOptions.noCategory;
      if (newProgressOptions.allTrainings) {
        newProgressOptions.allTrainings = !newProgressOptions.allTrainings;
      }
    }
    if (newFilter === 'allMatches') {
      if (newProgressOptions.allMatches) {
        newProgressOptions.allMatches = !newProgressOptions.allMatches;
      } else {
        matchFilters.forEach((filter) => {
          newProgressOptions[filter as keyof typeof newProgressOptions] = false;
        });
        newProgressOptions.allMatches = !newProgressOptions.allMatches;
      }
    }
    if (matchFilters.some((filter) => filter.includes(newFilter))) {
      newProgressOptions[newFilter] = !newProgressOptions[newFilter];
      if (newProgressOptions.allMatches) {
        newProgressOptions.allMatches = !newProgressOptions.allMatches;
      }
    }

    if (newFilter === 'allTrainings') {
      if (newProgressOptions.allTrainings) {
        newProgressOptions.allTrainings = !newProgressOptions.allTrainings;
      } else {
        trainingFilters.forEach((filter) => {
          newProgressOptions[filter as keyof typeof newProgressOptions] = false;
        });
        if (newProgressOptions.individual) {
          newProgressOptions.individual = !newProgressOptions.individual;
        }
        if (newProgressOptions.noCategory) {
          newProgressOptions.noCategory = !newProgressOptions.noCategory;
        }
        newProgressOptions.allTrainings = !newProgressOptions.allTrainings;
      }
    }
    if (trainingFilters.some((filter) => filter.includes(newFilter))) {
      newProgressOptions[newFilter] = !newProgressOptions[newFilter];
      if (newProgressOptions.allTrainings) {
        newProgressOptions.allTrainings = !newProgressOptions.allTrainings;
      }
    }

    setProgressOptions(newProgressOptions);
  };

  const saveFilter = () => {
    dispatch(setProgressFilter({ filterOptions: progressOptions }));
  };

  const resetFilter = () => {
    dispatch(setProgressFilter({ filterOptions: initialProgressFilter }));
    setProgressOptions(initialProgressFilter);
  };

  const isResetButtonDisabled = () => {
    const noOfFilters = Object.values(progressOptions).filter(
      (val) => val
    ).length;
    return !noOfFilters;
  };

  const renderMatchFilterOptions = () => {
    return matchOptions.map((option) => {
      const filterOption = getFilterOption(option);
      return (
        <Pressable
          key={option}
          onPress={() => setFilter(filterOption)}
          style={[
            styles.btnFilterOption,
            progressOptions[filterOption] && styles.activeBorder
          ]}
        >
          <Text
            style={[
              styles.btnFilterText,
              progressOptions[filterOption] && styles.activeText
            ]}
          >
            {option}
          </Text>
        </Pressable>
      );
    });
  };

  const renderTrainingFilterOptions = (isPlusTrainings: boolean) => {
    return (isPlusTrainings ? TrainingOptionsPlus : TrainingOptionsMinus).map(
      (option) => {
        const filterOption = getFilterOptionTraining(option);
        return (
          <Pressable
            key={option}
            onPress={() => setFilter(filterOption)}
            style={[
              styles.btnFilterOption,
              progressOptions[filterOption] && styles.activeBorder
            ]}
          >
            <Text
              style={[
                styles.btnFilterText,
                progressOptions[filterOption] && styles.activeText
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      }
    );
  };

  const renderButtons = (isMatch: boolean) => {
    if (isMatch) {
      return (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.scrollViewContent}
        >
          {renderMatchFilterOptions()}
        </ScrollView>
      );
    }
    return (
      <View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.scrollViewContent}
        >
          <Pressable
            onPress={() => setFilter('allTrainings')}
            style={[
              styles.btnFilterOption,
              progressOptions.allTrainings && styles.activeBorder,
              { alignSelf: 'flex-start' }
            ]}
          >
            <Text
              style={[
                styles.btnFilterText,
                progressOptions.allTrainings && styles.activeText
              ]}
            >
              All Trainings
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilter('individual')}
            style={[
              styles.btnFilterOption,
              progressOptions.individual && styles.activeBorder,
              { alignSelf: 'flex-start' }
            ]}
          >
            <Text
              style={[
                styles.btnFilterText,
                progressOptions.individual && styles.activeText
              ]}
            >
              Individual
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setFilter('noCategory')}
            style={[
              styles.btnFilterOption,
              progressOptions.noCategory && styles.activeBorder,
              { alignSelf: 'flex-start' }
            ]}
          >
            <Text
              style={[
                styles.btnFilterText,
                progressOptions.noCategory && styles.activeText
              ]}
            >
              No Category
            </Text>
          </Pressable>
        </ScrollView>

        <Text style={styles.tertiaryHeading}>
          Training sessions 0-3 days after a match
        </Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.scrollViewContent}
        >
          {renderTrainingFilterOptions(true)}
        </ScrollView>
        <Text style={styles.tertiaryHeading}>
          Training sessions 1-8 days before a match
        </Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerStyle={styles.scrollViewContent}
        >
          {renderTrainingFilterOptions(false)}
        </ScrollView>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.rectangle}></View>
        <Text style={styles.title}>Filter</Text>
        <Pressable onPress={navigation.goBack} style={styles.closeBtnContainer}>
          <Text style={styles.closeBtn}>Cancel</Text>
        </Pressable>
      </View>
      <ScrollView>
        <View style={styles.optionsContainer}>
          <View style={styles.optionsHeaderContainer}>
            <Icon icon={'football'} style={styles.iconContainer} />
            <Text style={styles.filterHeadersText}>
              Matches {matchOptionsNumber > 0 ? `(${matchOptionsNumber})` : ''}
            </Text>
          </View>
          <View style={{ marginVertical: 30 }}>{renderButtons(true)}</View>
        </View>
        <View style={styles.optionsContainer}>
          <View style={styles.optionsHeaderContainer}>
            <Icon icon={'footballBoot'} style={styles.iconContainer} />
            <Text style={styles.filterHeadersText}>
              Trainings{' '}
              {trainingOptionsNumber > 0 ? `(${trainingOptionsNumber})` : ''}
            </Text>
          </View>
          <View style={{ marginVertical: 30 }}>{renderButtons(false)}</View>
        </View>
      </ScrollView>
      <View style={styles.btnsContainer}>
        <Pressable
          disabled={isResetButtonDisabled()}
          onPress={() => {
            resetFilter();
          }}
          style={[
            styles.btnFilterOption,
            styles.activeBorder,
            isResetButtonDisabled() && { borderColor: variables.lightGrey }
          ]}
        >
          <Text
            style={[
              styles.btnFilterText,
              styles.activeText,
              isResetButtonDisabled() && { color: variables.lightGrey }
            ]}
          >
            Reset
          </Text>
        </Pressable>
        <View>
          <Pressable
            onPress={() => {
              if (filterNumber) {
                saveFilter();
                return navigation.goBack();
              }
              return null;
            }}
            style={[
              styles.btnApplyOption,
              filterNumber === 0 ? styles.disabledBorder : styles.activeBorder
            ]}
          >
            <Text style={styles.btnApplyText}>Apply Filter</Text>
          </Pressable>
          <Text style={styles.btnApplySubText}>
            {filterNumber} matching sessions
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  activeBorder: { borderColor: variables.red },

  activeText: { color: variables.red },

  btnApplyOption: {
    backgroundColor: variables.red,
    borderRadius: 5,
    height: 42,
    justifyContent: 'center',
    marginRight: 15,
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  btnApplySubText: {
    bottom: -15,
    fontFamily: variables.mainFontLight,
    fontSize: 10,
    position: 'absolute'
  },
  btnApplyText: {
    color: variables.realWhite,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 14
  },
  btnFilterOption: {
    borderColor: variables.greyC3,
    borderRadius: 5,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    marginRight: 15,
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  btnFilterText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontSemiBold,
    fontSize: 14
  },
  btnsContainer: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    bottom: 0,
    flexDirection: 'row',
    height: 120,
    justifyContent: 'center',
    marginTop: 50,
    position: 'absolute',
    width: '100%'
  },
  closeBtn: {
    color: variables.red,
    fontFamily: variables.mainFontBold,
    fontSize: 14,
    letterSpacing: 0.7
  },
  closeBtnContainer: {
    bottom: 15,
    left: 10,
    position: 'absolute',
    zIndex: 1
  },
  container: {
    backgroundColor: variables.backgroundColor,
    flex: 1,
    paddingBottom: 120
  },
  disabledBorder: {
    backgroundColor: variables.lightestGrey
  },
  filterHeadersText: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 16
  },
  header: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    paddingVertical: 15
  },
  iconContainer: {
    color: variables.black,
    height: 20,
    marginRight: 10,
    width: 20
  },
  optionsContainer: {
    backgroundColor: variables.realWhite,
    marginTop: 10,
    paddingVertical: 25
  },
  optionsHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 25
  },
  rectangle: {
    backgroundColor: 'rgba(24, 24, 24, 0.24)',
    borderRadius: 10,
    height: 5,
    marginBottom: 18,
    width: 36
  },
  scrollViewContent: {
    paddingHorizontal: 25
  },
  tertiaryHeading: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 10,
    marginBottom: 10,
    marginTop: 25,
    paddingLeft: 25
  },
  title: {
    color: '#181818',
    fontFamily: variables.mainFontSemiBold,
    fontSize: 17,
    textTransform: 'uppercase'
  }
});
