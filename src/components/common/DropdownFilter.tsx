import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Modal as NativeModal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';

import { DropdownFilterKeys, FilterStateType } from '../../../types';
import {
  selectComparisonFilter,
  setComparisonFilter
} from '../../redux/slices/filterSlice';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  DROPDOWN_DATA_MATCH,
  DROPDOWN_DATA_TRAINING,
  DROPDOWN_DATA_TRAINING_NO_BENCHMARK,
  DROPDOWN_DATA_WEEKLY_LOAD,
  variables
} from '../../utils/mixins';
import { Icon } from '../icon/icon';
import { IconTypes } from '../icon/icons';

import ExplanationModalContainer from './explanations/ExplanationModalContainer';
import DropdownFilterSelectWeek, {
  WeekSelectItem
} from './DropdownFilterSelectWeek';

type DataItem = {
  label: string;
  value: string;
  text: string;
  icon: string;
  disabled?: boolean;
  key: string;
};

interface Props {
  filterType: FilterStateType;
  label?: string;
  buttonStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

/**
 * DropdownFilter component
 * @param label - label for the dropdown
 * @param containerStyle - Style for the dropdown container
 * @param buttonStyle - style for the dropdown button
 * @param filterType - type to determine which dropdown data to use
 * redux data driven filter component uses "comparisonFilter"
 */

const DropdownFilter: FC<Props> = ({
  filterType = FilterStateType.training,
  label = '',
  buttonStyle,
  containerStyle
}) => {
  const dispatch = useAppDispatch();

  const data = useMemo(() => {
    switch (filterType) {
      case FilterStateType.match:
        return DROPDOWN_DATA_MATCH;
      case FilterStateType.training:
        return DROPDOWN_DATA_TRAINING;
      case FilterStateType.noBenchmark:
        return DROPDOWN_DATA_TRAINING_NO_BENCHMARK;
      case FilterStateType.weeklyLoad:
        return DROPDOWN_DATA_WEEKLY_LOAD;
      case FilterStateType.landing:
        return DROPDOWN_DATA_TRAINING;
      default:
        return DROPDOWN_DATA_TRAINING;
    }
  }, [filterType]);

  const DropdownButton = useRef<TouchableOpacity>(null);
  const comparisonFilter = useAppSelector((store) =>
    selectComparisonFilter(store, filterType)
  );

  const [visible, setVisible] = useState(false);
  const [weekSelectionVisible, setWeekSelectionVisible] = useState<boolean>(
    comparisonFilter.key === DropdownFilterKeys.SELECTED_WEEK
  );
  const [dropdownTop, setDropdownTop] = useState<number>(0);
  const [dropdownRight, setDropdownRight] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleShowExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  const toggleDropdown = (): void => {
    visible ? setVisible(false) : openDropdown();
  };

  useEffect(() => {
    setWeekSelectionVisible(
      comparisonFilter.key === DropdownFilterKeys.SELECTED_WEEK
    );
  }, [comparisonFilter.key]);

  const openDropdown = (): void => {
    if (DropdownButton.current) {
      DropdownButton.current?.measure(
        (
          _fx: any,
          _fy: any,
          width: number,
          height: any,
          px: number,
          py: any
        ) => {
          const widthAdjuster = width / 4;
          setDropdownTop(py + height + 5);
          setDropdownRight(px - width - widthAdjuster);
        }
      );
      setVisible(true);
    }
  };

  const onItemPress = (item: {
    label: string;
    value: string;
    text: string;
    icon: string;
    key: string;
    disabled?: boolean;
    selectedWeek?: WeekSelectItem;
  }): void => {
    if (
      item.key === DropdownFilterKeys.SELECTED_WEEK &&
      !weekSelectionVisible
    ) {
      setWeekSelectionVisible(true);
    } else {
      dispatch(
        setComparisonFilter({
          filter: filterType,
          value: item
        })
      );
      setVisible(false);
    }
  };

  const mainIconStyle = StyleSheet.flatten([
    { height: 15, width: 15, color: variables.realWhite },
    comparisonFilter.icon === 'last_4_weeks' ||
    comparisonFilter.icon === 'selected_week'
      ? { height: 22, width: 22 }
      : {}
  ]);

  const mainContainerStyle = StyleSheet.flatten([
    styles.mainContainer,
    containerStyle
  ]);
  const mainButtonStyle = StyleSheet.flatten([styles.button, buttonStyle]);

  const getItemStyles = (selectedItem: boolean, item: DataItem) => {
    const itemContainerStyle = StyleSheet.flatten([
      styles.item,
      selectedItem && {
        backgroundColor: 'black',
        borderRadius: 4
      }
    ]);

    const itemIconStyle = StyleSheet.flatten([
      styles.icon,
      item.icon === 'last_4_weeks' || item.icon === 'selected_week'
        ? { height: 40, width: 40 }
        : {}
    ]);

    const itemTitleStyle = StyleSheet.flatten([
      styles.itemTitle,
      selectedItem && {
        color: 'white'
      }
    ]);

    const itemSubTitleStyle = StyleSheet.flatten([
      styles.itemSubtitle,
      selectedItem && {
        color: 'white'
      }
    ]);

    return {
      itemContainerStyle,
      itemIconStyle,
      itemTitleStyle,
      itemSubTitleStyle
    };
  };

  const renderItem = ({ item }: { item: DataItem }) => {
    const selectedItem = comparisonFilter.key === item.key;

    const {
      itemContainerStyle,
      itemIconStyle,
      itemTitleStyle,
      itemSubTitleStyle
    } = getItemStyles(selectedItem, item);

    return (
      <TouchableOpacity
        style={itemContainerStyle}
        onPress={() => {
          onItemPress(item);
        }}
      >
        {item.icon && (
          <View style={styles.itemIcon}>
            <Icon style={itemIconStyle} icon={item.icon as IconTypes} />
          </View>
        )}
        <View style={styles.dropdownItemText}>
          <Text style={itemTitleStyle}>{item.label}</Text>
          <Text style={itemSubTitleStyle}>{item.text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDropdown = () => {
    if (!dropdownTop) return null;
    return (
      <NativeModal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.dropdown,
            {
              top: dropdownTop,
              left: dropdownRight
            }
          ]}
        >
          <Text style={styles.titleText}>
            Compare your data to:{' '}
            <Text style={styles.subtitleText}>
              {'\n'}Select your preferred comparison method.
            </Text>
          </Text>

          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.flatlistContainer}
          />
          <TouchableOpacity
            style={styles.explanationBtn}
            onPress={() =>
              comparisonFilter.key !== DropdownFilterKeys.DONT_COMPARE
                ? handleShowExplanation()
                : null
            }
          >
            <Icon
              icon="info_icon"
              style={{ color: '#979797', height: 20, width: 20 }}
            />
            <Text style={{ textAlign: 'center', fontSize: 12, marginLeft: 7 }}>
              Learn more about comparison
            </Text>
          </TouchableOpacity>
        </View>
        {comparisonFilter.key !== DropdownFilterKeys.DONT_COMPARE && (
          <ExplanationModalContainer
            isVisible={showExplanation}
            toggleModal={handleShowExplanation}
            showModal={
              comparisonFilter.key === DropdownFilterKeys.BENCHMARK
                ? 'benchmark'
                : 'bestMatch'
            }
          />
        )}
      </NativeModal>
    );
  };

  const renderSelectWeekDropdown = () => {
    if (!dropdownTop) return null;

    const titleStyle = StyleSheet.flatten([
      styles.titleText,
      { fontFamily: variables.mainFontBold }
    ]);

    const subTitleStyle = StyleSheet.flatten([
      styles.subtitleText,
      { marginLeft: 10 }
    ]);
    return (
      <NativeModal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.dropdown,
            {
              top: dropdownTop,
              left: dropdownRight
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setWeekSelectionVisible(false);
            }}
            style={styles.selectWeekHeader}
          >
            <Icon icon="arrow_left" />
            <Text style={titleStyle}>Back</Text>
          </TouchableOpacity>
          <Text style={subTitleStyle}>
            {'\n'}Select week to benchmark against.
          </Text>
          <DropdownFilterSelectWeek onItemPress={onItemPress} />
          <TouchableOpacity
            style={styles.explanationBtn}
            onPress={() =>
              comparisonFilter.key !== DropdownFilterKeys.DONT_COMPARE
                ? handleShowExplanation()
                : null
            }
          >
            <Icon
              icon="info_icon"
              style={{ color: '#979797', height: 20, width: 20 }}
            />
            <Text style={{ textAlign: 'center', fontSize: 12, marginLeft: 7 }}>
              Learn more about comparison
            </Text>
          </TouchableOpacity>
        </View>
        {comparisonFilter.key !== DropdownFilterKeys.DONT_COMPARE && (
          <ExplanationModalContainer
            isVisible={showExplanation}
            toggleModal={handleShowExplanation}
            showModal={
              comparisonFilter.key === DropdownFilterKeys.BENCHMARK
                ? 'benchmark'
                : 'bestMatch'
            }
          />
        )}
      </NativeModal>
    );
  };

  const renderMainButton = () => {
    return (
      <View style={styles.container}>
        <View style={styles.selectedItemIcon}>
          <Icon
            icon={comparisonFilter.icon as IconTypes}
            style={mainIconStyle}
          />
        </View>
        <Text style={[styles.buttonText, { flex: undefined }]}>
          {label || comparisonFilter.label}
        </Text>
        <Icon icon="dropdown" />
      </View>
    );
  };

  return (
    <View style={mainContainerStyle}>
      <Text>VS</Text>
      <TouchableOpacity
        ref={DropdownButton}
        style={mainButtonStyle}
        onPress={toggleDropdown}
      >
        <React.Fragment>
          {weekSelectionVisible ? renderSelectWeekDropdown() : renderDropdown()}
          {renderMainButton()}
        </React.Fragment>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 74,
    justifyContent: 'flex-start',
    width: 174,
    zIndex: 1
  },
  buttonText: {
    flex: 0.2,
    fontSize: 12,
    textAlign: 'center'
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 2,
    flexDirection: 'row',
    flex: 1,
    height: 48,
    justifyContent: 'space-evenly'
  },
  dropdown: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 14,
    position: 'absolute',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: 418
  },
  dropdownItemText: {
    flex: 1,
    paddingRight: 12
  },
  explanationBtn: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: 25,
    justifyContent: 'center'
  },
  flatlistContainer: {
    borderBottomColor: variables.lineGrey,
    borderBottomWidth: 1,
    marginTop: 18
  },
  icon: {
    color: variables.realWhite
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 85,
    justifyContent: 'center',
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  itemIcon: {
    alignItems: 'center',
    backgroundColor: variables.red,
    borderRadius: 50,
    height: 48,
    justifyContent: 'center',
    marginRight: 20,
    width: 48
  },
  itemSubtitle: {
    color: variables.grey2,
    fontFamily: variables.mainFont,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17.86
  },
  itemTitle: {
    fontFamily: variables.mainFont,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22.97
  },
  mainContainer: {
    alignItems: 'center',
    backgroundColor: variables.backgroundColor,
    borderRadius: 4,
    flexDirection: 'row',
    flex: 0.315,
    justifyContent: 'space-evenly',
    padding: 12
  },
  overlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0
  },
  selectWeekHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 12
  },
  selectedItemIcon: {
    alignItems: 'center',
    backgroundColor: variables.red,
    borderRadius: 50,
    height: 24,
    justifyContent: 'center',
    width: 24
  },
  subtitleText: {
    color: variables.grey2,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20.42
  },
  titleText: {
    fontFamily: variables.mainFont,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25.52,
    paddingHorizontal: 12
  }
});

export default DropdownFilter;
