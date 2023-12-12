import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { palette } from '../../../theme';
import { variables } from '../../../utils/mixins';
import { Icon } from '../../icon/icon';
import Avatar from '../Avatar';

type Option = {
  label: string;
  value: string | number;
  icon?: string;
  data?: any;
  group?: string;
};
type IconType = string | number;
type Value = string | number | null;
type Props = {
  uiType?: 'one' | 'two';
  value: Value;
  onChange: (val: any) => void;
  options: Option[];
  placeholder: string;
  label?: string;
  labelStyle?: TextStyle;
  preventUnselect?: boolean;
  dropdownPositon?: 'left' | 'right';
  dropdownWidth?: number;
  dropdownHeight?: number;
  containerStyle?: ViewStyle;
  customDropdownStyle?: ViewStyle;
  disabled?: boolean;
};

const Dropdown = ({
  uiType = 'one',
  value,
  onChange,
  options,
  placeholder,
  label,
  labelStyle,
  preventUnselect = false,
  dropdownPositon = 'left',
  dropdownWidth,
  dropdownHeight = 275,
  containerStyle,
  customDropdownStyle,
  disabled = false
}: Props) => {
  const DROPDOWN_HEIGHT =
    uiType === 'two'
      ? Math.min(Math.max(options.length, 1) * 40, dropdownHeight)
      : dropdownHeight;

  const windowHeight = Dimensions.get('window').height;
  const DropdownButton = useRef<TouchableOpacity>(null);
  const [selectedItem, setSelectedItem] = useState<Option | null>(null);
  const [open, setOpen] = useState(false);
  const [dropdownDimensions, setDropdownDimensions] = useState({
    dropdownTop: 0,
    dropdownLeft: 0,
    inputWidth: 0
  });

  useEffect(() => {
    const selected = options.find((option) => option.value === value) || null;
    setSelectedItem(selected);
  }, [value]);

  const inputStyle = {
    one: styles.inputOne,
    two: styles.inputTwo
  };

  const textStyle = {
    one: styles.textOne,
    two: styles.textTwo
  };

  const dropdownStyle = {
    one: styles.dropdownOne,
    two: styles.dropdownTwo
  };
  const listStyle = {
    one: styles.listOne,
    two: styles.listTwo
  };
  const itemStyle = {
    one: styles.itemOne,
    two: styles.itemTwo
  };

  const itemTextStyle = {
    one: styles.itemTextOne,
    two: styles.itemTextTwo
  };

  const itemSelectedStyle = {
    one: styles.itemSelectedOne,
    two: styles.itemSelectedTwo
  };

  const itemTextSelectedStyle = {
    one: styles.itemTextSelectedOne,
    two: styles.itemTextSelectedTwo
  };

  const toggleDropdown = () => {
    if (disabled) return;
    if (open) {
      setOpen(false);
    } else {
      openDropdown();
    }
  };

  const openDropdown = () => {
    if (DropdownButton && DropdownButton.current) {
      DropdownButton.current.measureInWindow((fx, _fy, w) => {
        setDropdownDimensions((prevState) => ({
          ...prevState,
          dropdownLeft: dropdownPositon === 'right' ? fx + w : fx
        }));
      });

      DropdownButton.current.measure((_fx, _fy, w, h, _px, py) => {
        const isAndroid = Platform.OS === 'android';

        if (275 + py + h > windowHeight) {
          setDropdownDimensions((prevState) => ({
            ...prevState,
            inputWidth: dropdownWidth || w,
            dropdownTop: isAndroid
              ? py - 24 - DROPDOWN_HEIGHT
              : py - DROPDOWN_HEIGHT + h
          }));
        } else {
          setDropdownDimensions((prevState) => ({
            ...prevState,
            inputWidth: dropdownWidth || w,
            dropdownTop: isAndroid ? py + h - 24 : py
          }));
        }
        setOpen(() => true);
      });
    }
  };

  const getIconSource = (icon: IconType) => {
    if (typeof icon === 'string') return { uri: icon };
    return icon;
  };

  const groupBy = (arr: any[], key: string | number) =>
    arr.reduce((acc, curr) => {
      let value = curr[key];
      if (!value) {
        value = 'Other';
      }
      if (!acc[value]) {
        acc[value] = { title: value, data: [] };
      }
      acc[value].data.push(curr);
      return acc;
    }, {});

  const renderItem = ({ item }: { item: Option; index: number }) => {
    const isSelected = item.value === selectedItem?.value;

    return (
      <Pressable
        style={[
          styles.item,
          itemStyle[uiType],
          isSelected && itemSelectedStyle[uiType]
        ]}
        onPress={() => {
          if (isSelected && !preventUnselect) {
            onChange(null);
          } else {
            onChange(item.data ? item.data : item.value);
          }
          setOpen(false);
        }}
      >
        {item.icon && (
          <View style={styles.optionIconWrapper}>
            <Avatar style={styles.optionIcon} photoUrl={item.icon} />
          </View>
        )}
        <Text
          numberOfLines={1}
          style={[
            styles.itemText,
            itemTextStyle[uiType],
            isSelected && itemTextSelectedStyle[uiType]
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const isSectionList = useMemo(() => {
    return options.some((it) => !!it.group);
  }, [options]);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.input, inputStyle[uiType], containerStyle]}
        ref={DropdownButton}
        onPress={toggleDropdown}
      >
        {selectedItem && (
          <View style={styles.valueWrapper}>
            {selectedItem.icon && (
              <Image
                style={styles.icon}
                source={getIconSource(selectedItem.icon)}
              />
            )}
            <Text
              numberOfLines={1}
              style={[styles.text, textStyle[uiType], labelStyle]}
            >
              {selectedItem.label}
            </Text>
          </View>
        )}
        {!selectedItem && (
          <Text style={[styles.text, textStyle[uiType]]}>{placeholder}</Text>
        )}
        <MaterialIcons
          name="keyboard-arrow-down"
          size={20}
          color={variables.textBlack}
        />
        {open && (
          <Modal visible={open} transparent animationType="none">
            <Pressable
              style={styles.dropdownModal}
              onPress={() => setOpen(false)}
            >
              <View
                style={[
                  styles.dropdown,
                  { height: DROPDOWN_HEIGHT },
                  dropdownStyle[uiType],
                  dropdownPositon === 'left'
                    ? {
                        top: dropdownDimensions.dropdownTop,
                        left: dropdownDimensions.dropdownLeft,
                        width: dropdownDimensions.inputWidth
                      }
                    : {
                        top: dropdownDimensions.dropdownTop,
                        left: dropdownDimensions.dropdownLeft,
                        width: dropdownDimensions.inputWidth,
                        transform: [
                          { translateX: -dropdownDimensions.inputWidth }
                        ]
                      },
                  customDropdownStyle
                ]}
              >
                <View>
                  {uiType === 'one' && (
                    <View style={styles.dropdownPlaceholderContainer}>
                      <Text style={styles.dropdownPlaceholder}>
                        {placeholder}
                      </Text>
                      <Icon icon="grey_up" />
                    </View>
                  )}
                  <View>
                    {isSectionList
                      ? (
                      <SectionList
                        style={[styles.list, listStyle[uiType]]}
                        contentContainerStyle={{
                          paddingHorizontal: 12.5
                        }}
                        sections={
                          Object.values(groupBy(options, 'group')) as any
                        }
                        renderItem={renderItem}
                        renderSectionHeader={({ section: { title } }) => (
                          <View>
                            <Text
                              style={{
                                fontSize: 14,
                                fontFamily: variables.mainFontMedium,
                                color: palette.tipGrey,
                                backgroundColor: 'white',
                                borderTopWidth: 1,
                                borderTopColor: variables.lineGrey
                              }}
                            >
                              {title}
                            </Text>
                          </View>
                        )}
                        keyExtractor={(_item, index) => index.toString()}
                      />
                        )
                      : (
                      <FlatList
                        style={[styles.list, listStyle[uiType]]}
                        contentContainerStyle={{
                          paddingHorizontal: 12.5
                        }}
                        data={options}
                        renderItem={renderItem}
                        keyExtractor={(_item, index) => index.toString()}
                      />
                        )}
                  </View>
                </View>
              </View>
            </Pressable>
          </Modal>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    elevation: 1,
    zIndex: 1
  },
  dropdown: {
    backgroundColor: variables.realWhite,
    borderRadius: 4,
    position: 'absolute'
  },
  dropdownModal: {
    height: '100%',
    width: '100%'
  },
  dropdownOne: {
    paddingTop: 33,
    shadowColor: variables.black,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 20
  },
  dropdownPlaceholder: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 14,
    letterSpacing: 0.65
  },
  dropdownPlaceholderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 14
  },
  dropdownTwo: {
    backgroundColor: variables.white,
    borderColor: variables.lightGrey,
    borderWidth: 1,
    paddingVertical: 4
  },
  icon: { height: 30, marginRight: 10, resizeMode: 'contain', width: 30 },
  input: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: 9
  },
  inputOne: {
    height: 30
  },
  inputTwo: {
    backgroundColor: variables.white,
    height: 40,
    paddingLeft: 14
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  itemOne: {
    backgroundColor: variables.realWhite,
    borderRadius: 4,
    height: 60,
    marginBottom: 10,
    paddingHorizontal: 12
  },
  itemSelectedOne: {
    backgroundColor: variables.black
  },
  itemSelectedTwo: {
    backgroundColor: 'transparent'
  },
  itemText: {
    color: variables.textBlack,
    flex: 1
  },
  itemTextOne: { fontFamily: variables.mainFontBold, fontSize: 18 },
  itemTextSelectedOne: {
    color: variables.realWhite
  },
  itemTextSelectedTwo: {
    color: variables.red
  },
  itemTextTwo: { fontFamily: variables.mainFont },
  itemTwo: {
    paddingHorizontal: 2,
    paddingVertical: 10
  },
  label: {
    color: variables.lightGrey,
    fontFamily: variables.mainFontMedium,
    fontSize: 16,
    marginBottom: 22
  },
  list: {
    height: '100%'
  },
  listOne: {
    height: 200
  },
  listTwo: {
    height: '100%'
  },
  optionIcon: { borderWidth: 1, height: 24, resizeMode: 'contain', width: 24 },
  optionIconWrapper: {
    alignItems: 'center',
    backgroundColor: variables.realWhite,
    borderRadius: 100,
    height: 35,
    justifyContent: 'center',
    marginRight: 10,
    width: 35
  },
  text: {
    flex: 1
  },
  textOne: {
    color: variables.textBlack,
    fontFamily: variables.mainFontBold,
    fontSize: 18
  },
  textTwo: {
    color: variables.lightGrey,
    fontFamily: variables.mainFont,
    fontSize: 16
  },
  valueWrapper: { alignItems: 'center', flexDirection: 'row', flex: 1 }
});
