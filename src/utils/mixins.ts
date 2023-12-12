import { Dimensions, NativeModules, Platform } from 'react-native';
import moment, { Moment } from 'moment';

import { DropdownFilterKeys, GameAny, GameType } from '../../types';

const deviceDimensions = Dimensions.get('window');

export const utils = {
  getLocale() {
    let locale = 'en';
    if (Platform.OS === 'ios') {
      locale =
        NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0];
    } else {
      locale = NativeModules.I18nManager.localeIdentifier;
    }
    return locale.substr(0, 2);
  },

  addLeadingZero(val: any, targetLength = 2) {
    if (val === undefined) {
      return val;
    }

    const roundedVal = Math.abs(Math.round(val)).toString();
    const valString = parseInt(roundedVal, 10).toString();
    const neededPadding = targetLength - valString.length + 1;
    let prefix = val < 0 ? '-' : '';
    if (neededPadding > 0) {
      prefix += new Array(neededPadding).join('0');
    }
    return `${prefix}${valString}`;
  },
  addTrailingZero(val: string | undefined, targetLength = 2) {
    if (val === undefined) {
      return val;
    }
    const valString = val.toString();
    const neededPadding = targetLength - valString.length + 1;
    let suffix = '';
    if (neededPadding > 0) {
      suffix = new Array(neededPadding).join('0');
    }
    return `${val}${suffix}`;
  },
  formatTimestamp(timestamp: number) {
    let seconds = Math.round(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${this.addLeadingZero(minutes)}:${this.addLeadingZero(seconds)}`;
  },

  removeCommaFromNumber(num: string) {
    if (typeof num === 'string' && num.includes(',')) {
      num = num.split(',').join('');
    }
    return num;
  },

  rgba(color: any, opacity: number) {
    const opacityInHex = Math.round(255 * opacity).toString(16);
    return `${color}${opacityInHex}`;
  },
  rgbaHex(red: any, green: any, blue: any, opacity: number) {
    return `#${Number(red).toString(16)}${Number(green).toString(16)}${Number(
      blue
    ).toString(16)}${Math.round(255 * opacity).toString(16)}`;
  },
  UCFirst(str: string) {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
  },

  getFormattedMonth(datetime: any) {
    const date = this.forceDate(datetime);
    return variables.monthNames[date.getMonth()];
  },
  getFormattedDate(datetime: any) {
    const date = this.forceDate(datetime);

    return date.getDate();
  },
  getFormattedWeekday(datetime: any) {
    const date = this.forceDate(datetime);
    let dayOfWeek = date.getDay();
    if (dayOfWeek === 0) {
      dayOfWeek = 7;
    }
    return variables.weekdaysAbbr[dayOfWeek - 1];
  },
  getFormattedCalendarWholeDate(datetime: any) {
    return `${this.getFormattedWeekday(datetime)}, ${this.getFormattedMonth(
      datetime
    )} ${this.getFormattedDate(datetime)}`;
  },
  getDateFormattedString(time: string | number | Date) {
    const date = new Date(time);
    return `${date.getUTCFullYear()}-${this.addLeadingZero(
      date.getUTCMonth() + 1
    )}-${this.addLeadingZero(date.getUTCDate())}`;
  },
  getTrainingTitleFromString(str: string) {
    if (str === 'no_category') return 'No Category';
    if (str === 'individual') return 'Individual';
    return str;
  },
  getTrainingDescription(indicator: number | string | null) {
    if (indicator === null) return 'Training';
    if (typeof indicator === 'string') {
      return this.getTrainingTitleFromString(indicator);
    }
    const trainingNumber = indicator > 0 ? indicator : indicator * -1;
    const trainingIsBehindMatch = indicator > 0;
    const isFiniteNumber = isFinite(trainingNumber);
    if (!isFiniteNumber) {
      return 'Training';
    }

    if (indicator === 0) {
      return 'Matchday';
    }

    return `Matchday ${trainingIsBehindMatch ? '+' : '-'} ${trainingNumber}`;
  },
  forceDate(date: any) {
    if (typeof date === 'string') {
      const dateBits: any = date.split('-');
      return this.createUtcDate(dateBits[0], dateBits[1] - 1, dateBits[2]);
    }

    // compatiable for JS date and FirestoreTimestamp
    return date.toDate ? date.toDate() : date;
  },
  createUtcDate(year: number, month: number, day: number | undefined) {
    return new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  },
  getRandomNumber(min: number, max: number, rounded = false) {
    const num = Math.random() * (max - min) + min;
    return rounded ? Math.round(num) : num;
  },
  removeFromArray(arr: any[], checkFunc: (arg0: any) => any) {
    for (let c = 0; c < arr.length; c += 1) {
      if (checkFunc(arr[c])) arr.splice(c, 1);
    }
  },
  forceArray(input: any) {
    return !Array.isArray(input) ? [input] : input;
  },
  getDelta(previousValue: number, currentValue: number) {
    // Because we don't want to divide by zero
    if (previousValue === 0) {
      currentValue += 1;
      previousValue += 1;
    }
    const diff = currentValue - previousValue;
    const percentage = (diff / previousValue) * 100;
    if (percentage > 50) {
      return 2;
    } else if (percentage > 25) {
      return 1;
    } else if (percentage > -25) {
      return 0;
    } else if (percentage > -50) {
      return -1;
    } else if (percentage <= -50) {
      return -2;
    }
  },
  formatEventDate(year: any, month: any, date: any) {
    return [year, this.addLeadingZero(month), this.addLeadingZero(date)].join(
      '-'
    );
  },
  generateEventDate(date: {
    getFullYear: () => any;
    getMonth: () => number;
    getDate: () => any;
  }) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return this.formatEventDate(year, month, day);
  },
  parseHexToDemcial(hex: any) {
    try {
      return parseInt(`0x${hex}`);
    } catch (e) {
      return hex;
    }
  },
  // Name Abbreviation Function which shows first and last name with only one letter for the middle name and disregards if Jr. or Sr. is included after the name
  abbreviateName(name: string) {
    const [first, ...rest] =
      name.split(' ').length > 2
        ? name
          .split(' ')
          .filter(
            (n) =>
              n.toLowerCase() !== 'senior' && n.toLowerCase() !== 'junior'
          )
        : name.split(' ');
    let last = rest.pop();
    if (last && last?.length > 10) {
      last = last.slice(0, 8) + '...';
    }
    return [
      first,
      ...rest.filter((n, i) => i === 0).map((n) => n[0] + '.'),
      last
    ].join(' ');
  },
  log: (desc: string, color = 'red', rest: any = null) => {
    console.log(`%c${desc}`, `color:${color}`, rest);
  },
  msToTimeUnits: (duration: number) => {
    const milliseconds = Math.floor((duration % 1000) / 100);
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const secondsPercent = Math.round((seconds / 60) * 100);
    const minutesWithSecondsPercent = Number(
      `${hours * 60 + minutes}.${secondsPercent}`
    );

    return {
      hours,
      minutes,
      seconds,
      milliseconds,
      secondsPercent,
      minutesWithSecondsPercent
    };
  },
  pad: (num: string | number) => (+num < 10 ? '0' + num : num),
  convertMilisecondsToTime: (miliseconds = 0) => {
    const seconds = Math.floor((miliseconds / 1000) % 60);
    const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((miliseconds / (1000 * 60 * 60)) % 24);

    return `${hours > 0 ? `${utils.pad(hours)}:` : ''}${utils.pad(
      minutes
    )}:${utils.pad(seconds)}`;
  },
  // timestamp to hh, mm, ss
  convertTimestampToTime: (timestamp = 0) => {
    const seconds = Math.floor((timestamp / 1000) % 60);
    const minutes = Math.floor((timestamp / (1000 * 60)) % 60);
    const hours = Math.floor((timestamp / (1000 * 60 * 60)) % 24);

    return {
      hours,
      minutes,
      seconds
    };
  },
  convertMilisecondsToWeeklyLoadTime: (miliseconds = 0) => {
    const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((miliseconds / (1000 * 60 * 60)) % 24);

    return `${hours}h ${minutes}m`;
  },
  convertMilisecondsLandingPage: (miliseconds = 0) => {
    const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((miliseconds / (1000 * 60 * 60)) % 24);
    const seconds = Math.floor((miliseconds / (1000 * 60 * 60 * 60)) % 24);

    return `${hours ? `${hours}h` : ''} ${
      minutes ? `${minutes}m` : ''
    } ${seconds}s`;
  },
  generateDaysBetweenDates: (start: any, end: any, format = 'DD') => {
    const startDate = moment(start);
    const endDate = moment(end);

    const dateArray = [];
    const currentDate = startDate.clone();
    // eslint-disable-next-line no-unmodified-loop-condition
    while (currentDate.isSameOrBefore(endDate)) {
      dateArray.push(currentDate.format(format));
      currentDate.add(1, 'day');
    }

    return dateArray;
  },
  // generate months between dates
  generateMonthsBetweenDates: (start: any, end: any): Moment[] => {
    const startDate = moment(start);
    const endDate = moment(end);

    const dateArray = [];
    const currentDate = startDate.clone();
    // eslint-disable-next-line no-unmodified-loop-condition
    while (currentDate.isSameOrBefore(endDate)) {
      dateArray.push(currentDate.clone());
      currentDate.add(1, 'month');
    }

    return dateArray;
  },
  generateCalendarDays: (month: number, year: number) => {
    const daysArray: { day: number; month: number; isCurrentMonth: boolean }[] =
      [];
    const firstDayOfMonth = moment()
      .month(month - 1)
      .year(year)
      .startOf('month');
    const firstDayOfCal = firstDayOfMonth.clone().startOf('week');
    const lastDayOfMonth = firstDayOfMonth.clone().endOf('month');

    const prevDays: string[] = [];
    if (firstDayOfCal.isBefore(firstDayOfMonth)) {
      prevDays.push(
        ...utils.generateDaysBetweenDates(
          firstDayOfCal.clone(),
          firstDayOfMonth.clone().subtract(1, 'days')
        )
      );
    }
    const currDays = utils.generateDaysBetweenDates(
      firstDayOfMonth.clone(),
      lastDayOfMonth.clone()
    );

    const nextDays = utils.generateDaysBetweenDates(
      lastDayOfMonth.clone().add(1, 'days'),
      lastDayOfMonth
        .clone()
        .add(42 - (prevDays.length + currDays.length), 'days')
    );

    prevDays.forEach((day) => {
      daysArray.push({
        day: +day,
        month: +firstDayOfMonth.clone().subtract(1, 'month').format('MM'),
        isCurrentMonth: false
      });
    });
    currDays.forEach((day) => {
      daysArray.push({
        day: +day,
        month: +firstDayOfMonth.clone().format('MM'),
        isCurrentMonth: true
      });
    });
    nextDays.forEach((day) => {
      daysArray.push({
        day: +day,
        month: +firstDayOfMonth.clone().add(1, 'month').format('MM'),
        isCurrentMonth: false
      });
    });

    return daysArray;
  },
  getEventDuration: (event: GameAny) => {
    if (!event.status?.isFinal) {
      return Date.now() - (event.status?.startTimestamp || 1);
    }

    return event?.report?.stats?.team?.fullSession.duration
      ? event?.report?.stats?.team?.fullSession.duration || 0
      : event?.status?.duration || 0;
  },
  getPPOS: (role: number, position: number, isHockey: boolean) => {
    return isHockey
      ? role === 3 || role === 0
        ? -1
        : position
      : role !== 3
        ? position
        : -1;
  },
  getEventDescription: (event: GameAny) => {
    const isMatch = event.type === GameType.Match;

    if (isMatch) {
      return {
        description: event.versus,
        isBold: true
      };
    }

    const indicator = event?.benchmark?.indicator;

    if (typeof indicator === 'number' && isFinite(indicator)) {
      const trainingCategorySign = indicator > 0 ? '+' : '';
      const description =
        indicator === 0
          ? 'MD Training'
          : `${trainingCategorySign}${indicator} Training`;

      return { description, isBold: false };
    }

    if (typeof indicator === 'string') {
      const text = utils.getTrainingTitleFromString(indicator);
      return {
        description: text,
        isBold: false
      };
    }

    return {
      description: 'Training',
      isBold: false
    };
  },
  getMatchData: (matchGames: GameAny[]) => {
    let totalLoad = 0;
    const bestMatch: {
      vs: string;
      load: number;
      game: GameAny | null;
      id: string;
    } = {
      vs: '',
      load: 0,
      game: null,
      id: ''
    };
    matchGames.forEach((game) => {
      const load =
        game?.report?.stats?.team?.fullSession?.playerLoad?.total || 0;
      totalLoad += load || 0;
      if (bestMatch.load < (load || 0)) {
        bestMatch.vs = game.versus || '';
        bestMatch.load = load;
        bestMatch.game = game;
        bestMatch.id = game.id;
      }
    });
    return {
      matchAverage: totalLoad / Math.max(1, matchGames.length),
      bestMatch
    };
  },
  findClosestDateToToday: (
    dates: string[],
    dateOverride?: string
  ): string | null => {
    const currentDate: Moment = dateOverride
      ? moment(dateOverride, 'YYYY/MM/DD')
      : moment();
    let closestDate: string | null = null;

    for (let i = dates.length - 1; i >= 0; i--) {
      const dateMoment: Moment = moment(dates[i], 'YYYY/MM/DD');

      if (dateMoment.isBefore(currentDate)) {
        closestDate = dates[i];
        break;
      }
    }

    return closestDate;
  },
  checkAndFormatUtcDate: (
    utcDate: string | undefined,
    date: string,
    startTime: string
  ): { date: string; dateFormat: string; isUtcDate: boolean } => {
    return {
      date:
        utcDate && moment(utcDate).isValid()
          ? utils.UTCtoLocale(utcDate)
          : `${date} ${startTime}`,
      dateFormat: 'YYYY/MM/DD HH:mm',
      isUtcDate: !!(utcDate && moment(utcDate).isValid())
    };
  },
  localeToUTC: (
    date: string | Date | undefined,
    time?: string | Date,
    timeFormated?: boolean
  ) => {
    return moment(
      `${moment(date || new Date()).format('YYYY/MM/DD')} ${
        timeFormated ? time : moment(time).format('HH:mm')
      }`,
      'YYYY/MM/DD hh:mm'
    )
      .utc()
      .format('YYYY/MM/DD HH:mm');
  },
  UTCtoLocale: (date: string, formatter = 'YYYY/MM/DD HH:mm') => {
    return moment.utc(date, 'YYYY/MM/DD HH:mm').local().format(formatter);
  },
  encodeBase64: (input: string) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const str = input;
    let output = '';

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = '='), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        console.log(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  }
};
export const variables = {
  // Colors
  white: '#F2F2F4',
  realWhite: '#FFF',
  backgroundColor: '#F2F2F4',
  grey: '#26272A',
  grey2: '#686868',
  lineGrey: '#F2F2F2',
  lightestGrey: '#DADADA',
  moreGrey: '#eae7e7',
  lightGrey: '#9899A0',
  anotherGrey: '#DFDFE2',
  lighterGrey: '#DADADA',
  lightishGrey: '#EBEFF2',
  indicatorGrey: '#9899A0',
  middleGrey: '#9899A0',
  darkGrey: '#9899A0',
  darkerGrey: '#9899A0',
  chartGrey: '#9899A0',
  chartYellow: '#f8d479',
  chartBlue: '#c4d9f3',
  chartAxisLine: '#596480',
  black: '#000000',
  red: '#E5004D',
  pinkishRed: '#ff015c',
  lightBlue: '#d1e1f7',
  blue: '#2f80ed',
  yellow: '#fee128',
  textBlack: '#17181A',
  placeHolderGrey: '#7a7a7a',
  inputBottomGrey: '#e5e9eb',
  transparent: 'transparent',
  lighterBlue: '#E2ECFA',
  textLightBlack: '#545151',
  textAnotherBlack: '#454545',
  lighterBlack: 'rgba(0,0,0,.7)',
  littleGrey: '#737373',
  greyC7: '#c7c7c7',
  greyD9: '#d9d9d9',
  greyC3: '#C3C3C3',
  yellowCard: '#FEE128',
  yellowDark: '#FFC107',
  redCard: '#ff0000',
  darkBlue: '#0060FF',
  lightishBlue: '#6AC4F8',
  gradientBlue: '#58B1FF',
  purple: '#7E57C2',
  gradientPink: '#C258FF',
  gradientPurple: '#654CF4',
  batterieGreen: '#47A86E',
  matchGreen: '#69D17C',
  gradientGreen: '#00E591',
  intensityZoneColors: {
    low: '#78909C',
    moderate: '#26C6DA',
    high: '#7E57C2',
    veryHigh: '#FFC107',
    explosive: '#EC407A'
  },
  chartLightGrey: `#AFB5C0`,
  chartExplosive: '#EC407A',
  chartVeryHigh: '#FFC107',
  chartHigh: '#7E57C2',
  chartModerate: '#26C6DA',
  chartLow: '#78909C',
  chartExplosiveAboveAverage: '#C63465',
  chartVeryHightAboveAverage: '#DEA703',
  chartHightAboveAverage: '#66469D',
  chartModerateAboveAverage: '#1FA9BA',
  chartLowAboveAverage: '#637882',
  // time on ice player app colors
  timeOnIceDarkerBlue: '#2286BF',
  timeOnIceLighterBlue: '#6AC4F8',

  // Fonts
  // weight: 300,
  mainFontLight: Platform.select({
    ios: 'SpaceGrotesk-Light',
    android: 'SpaceGrotesk-Light'
  }),
  // weight: 400,
  mainFont: Platform.select({
    ios: 'SpaceGrotesk-Regular',
    android: 'SpaceGrotesk-Regular'
  }),
  // weight: 500,
  mainFontMedium: Platform.select({
    ios: 'SpaceGrotesk-Medium',
    android: 'SpaceGrotesk-Medium'
  }),
  // weight: 600,
  mainFontSemiBold: Platform.select({
    ios: 'SpaceGrotesk-SemiBold',
    android: 'SpaceGrotesk-SemiBold'
  }),
  // weight: 700,
  mainFontBold: Platform.select({
    ios: 'SpaceGrotesk-Bold',
    android: 'SpaceGrotesk-Bold'
  }),

  // Numbers
  deviceHeight: deviceDimensions.height,
  deviceWidth: deviceDimensions.width,
  headerHeight: 87,
  mainPadding: 24,
  calendarCellHeight: 116,
  playerWidth: 48,
  benchPlayerWidth: 44,
  weekDayHeaderHeight: 44,
  loginHeaderHeight: 110,

  // Locale things
  degrees: '°C',
  DAYS_IN_WEEK: 7,
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  monthAbbr: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  weekdays: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ],
  weekdaysAbbr: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  playerPositions: ['Striker', 'Midfielder', 'Defender', 'Goalkeeper'],
  playerPositionsHockey: ['Center', 'Wing', 'Back', 'Goalie'],
  playerPositionsPlural: [
    'Strikers',
    'Midfielders',
    'Defenders',
    'Goalkeepers'
  ],
  playerPositionsPluralHockey: ['Centers', 'Wings', 'Backs', 'Goalies'],
  playerPositionsAbbr: ['ST', 'MF', 'DF', 'GK'],
  playerPositionsAbbrHockey: ['Center', 'Wing', 'Back', 'Goalie'],
  strategies: ['3 lines', '4 lines defensive', '4 lines offensive', '5 lines'],
  preferPosition: [
    ['LF', 'CF', 'CF', 'CF', 'RF'],
    ['LM', 'CM', 'CM', 'CM', 'RM'],
    ['LB', 'CB', 'CB', 'CB', 'RB'],
    ['GK', 'GK', 'GK', 'GK', 'GK']
  ],
  preferPositionMapping: {
    LF: 'Left Striker',
    CF: 'Center Striker',
    RF: 'Right Striker',
    LM: 'Left Midfielder',
    CM: 'Center Midfielder',
    RM: 'Right Midfielder',
    LB: 'Left Defender',
    CB: 'Center Defender',
    RB: 'Right Defender',
    GK: 'Goalkeeper',
    CDM: 'Center DM',
    LDM: 'Left DM',
    RDM: 'Right DM',
    LAM: 'Left AM',
    CAM: 'Center AM',
    RAM: 'Right AM'
  },
  positionMapping: ['Left', 'Center', 'Right'],
  positionMappingHockey: ['Left', 'Right'],
  positionOptions: [
    {
      label: 'Left',
      value: 0
    },
    {
      label: 'Center',
      value: 1
    },
    {
      label: 'Right',
      value: 2
    }
  ],
  positionOptionsHockey: [
    {
      label: 'Left',
      value: 0
    },

    {
      label: 'Right',
      value: 1
    }
  ]
};

export const MatchReportFilter = {
  FULL_GAME: 'Full Game',
  FIRST_HALF: '1st Half',
  SECOND_HALF: '2nd Half',
  DRILLS: 'Drills'
};

export const TrainingGroupFilter = {
  REGULAR_GROUP: 'Regular group',
  RECOVERY_GROUP: 'Recovery group'
};

export const TrainingGroupFiltersArray = [
  TrainingGroupFilter.REGULAR_GROUP,
  TrainingGroupFilter.RECOVERY_GROUP
];

export const INTENSITY_ZONES = [
  {
    label: 'Explosive',
    color: variables.intensityZoneColors.explosive,
    key: 'explosive'
  },
  {
    label: 'Very high',
    color: variables.intensityZoneColors.veryHigh,
    key: 'veryHigh'
  },
  {
    label: 'High',
    color: variables.intensityZoneColors.high,
    key: 'high'
  },
  {
    label: 'Moderate',
    color: variables.intensityZoneColors.moderate,
    key: 'moderate'
  },
  {
    label: 'Low',
    color: variables.intensityZoneColors.low,
    key: 'low'
  }
];

// OLD Thresholds currently on Production
// export const INTENSITY_ZONES_MALE_TRESHOLD = [25.27, 19.94, 11.36, 0.9];

// export const INTENSITY_ZONES_FEMALE_TRESHOLD = [20.75, 14.78, 8.54, 0.9];

export const INTENSITY_ZONES_MALE_TRESHOLD_HOCKEY = [
  19.617, 15.258, 8.917, 0.3
];
export const INTENSITY_ZONES_FEMALE_TRESHOLD_HOCKEY = [
  19.617, 15.258, 8.917, 0.3
];
export const INTENSITY_ZONES_TEAM_TRESHOLD_HOCKEY = [3.96, 1.59, 0.52, 0.07];

export const INTENSITY_ZONES_MALE_TRESHOLD = [66.749, 48.223, 25.274, 1.6];
export const INTENSITY_ZONES_FEMALE_TRESHOLD = [55.088, 39.5, 20.688, 1.6];
export const INTENSITY_ZONES_TEAM_TRESHOLD = [16.04, 10.59, 4.93, 0.53];

export const TIME_IN_ZONE_EXPLANATION =
  ' The players’ intensity is divided into categories of Explosive, Very High, High, Moderate and Low. For these categories the duration within each zone is tracked. This provides deeper insight into the performance of the team as into the individual and positional differences.';

export const EXPLOSIVE_PERFORMANCE_EXPLANATION =
  'For the categories Explosive and Very High intensity both the amount of efforts as well as duration within the zone is tracked. This provides deeper insight into the performance of the player as well as into the individual positional differences within the team.';

export const LOAD_GOAL_EXPLANATION = [
  {
    text: 'Coaching Aspects',
    style: 1
  },
  {
    text: 'The Load Goal provides a guideline for the coach in planning and assessing trainings to ensure that the players reach their individual goals.',
    style: 0
  },
  {
    text: 'The Load Points of the player’s best match becomes the reference point for calculating the player’s weekly Load Goal. The Load Points of the team’s best match becomes the reference point for calculating the team’s weekly Load Goal.',
    style: 0
  },
  {
    text: 'Technical Aspects',
    style: 1
  },
  {
    text: 'The best match is multiplied with a factor ranging from 0-4 depending on the amount of training days and your personal goal settings.',
    style: 0
  },
  {
    text: 'The weekly Load Goal is distributed across training days to recommend the optimal load for each training, depending on the type of training day between two matchdays.',
    style: 0
  }
];

export const BENCHMARK_EXPLANATION = [
  {
    text: 'Coaching Aspects',
    style: 1
  },
  {
    text: 'The Benchmark comparison applies benchmark values to the different training days between two matchdays (MD).',
    style: 0
  },
  {
    text: 'The benchmark is applied both at team level and individual player level.',
    style: 0
  },
  {
    text: ' Thereby, the coach can compare the team and players to their previus efforts.',
    style: 0
  },
  {
    text: 'Technical Aspects',
    style: 1
  },
  {
    text: 'The Benchmark is an average of all similar previous training sessions (MD+-). In this way, the same type of training is compared. This is applicable both to the Load Points as well as the amount of efforts and time spent in the zones.',
    style: 0
  },
  {
    text: 'The two days following the match is termed MD+1 and MD+2, respectively, while days before the match are termed MD-4, MD-3, MD-2, MD-1.',
    style: 0
  }
];

export const BEST_MATCH_EXPLANATION = [
  {
    text: 'Coaching Aspects',
    style: 1
  },
  {
    text: 'Best Match compares match values to the Teams or players best physical match performance.',
    style: 0
  },
  {
    text: 'The comparison is applied both at team and individual player level.',
    style: 0
  },
  {
    text: 'Technical Aspects',
    style: 1
  },
  {
    text: 'The best physical match is defined as the match with the highest Load Points',
    style: 0
  }
];

export const PLAYER_LOAD_EXPLANATION = [
  {
    text: 'Player Load is the sum of movements that the accelerometer in the player tag has recorded. Due to the positioning of the tag on the calf, the mechanical load of a player can be tracked. Thus, Player Load are collected throughout a training or match to provide a number for the physical performance, which, in turn, reflects the magnitude of stress that tissue such as muscle, ligaments and bones has been exposed to.',
    style: 0
  },
  {
    text: 'Player Load are calculated with the following formula: ',
    style: 0
  },
  {
    image: 'formula.png',
    style: 2
  },
  {
    text: 'All-out movements, such as sprinting, providing a greater number than low-intense movements, such as walking.',
    style: 0
  }
];

export const PLAYER_LOAD_EXPLANATION_HOCKEY = [
  {
    text: 'Player Load is the sum of movements that the accelerometer in the player tag has recorded. Due to the positioning of the tag on the calf, the mechanical load of a player can be tracked. Thus, Player Load are collected throughout a training or match to provide a number for the physical performance, which, in turn, reflects the magnitude of stress that tissue such as muscle, ligaments and bones has been exposed to.',
    style: 0
  },
  {
    text: 'Player Load are calculated with the following formula: ',
    style: 0
  },
  {
    image: 'formula.png',
    style: 2
  },
  {
    text: 'All-out movements, such as sprinting, providing a greater number than low-intense movements, such as skating.',
    style: 0
  }
];

export const INTENSITY_ZONES_EXPLANATION = [
  {
    text: 'Explosive: maximal intensity, i.e. all-out movements such as sprinting as fast as possible or very hard accelerations and decelerations.',
    style: 0
  },
  {
    text: 'Very High: activities that are performed with near-maximal intensity such as very high speed running or cuts and changes of direction.',
    style: 0
  },
  {
    text: 'High: activities that are performed with high intensity such as running at high speed.',
    style: 0
  },
  {
    text: 'Moderate: activities that are performed with moderate intensity such as running at a regular pace.',
    style: 0
  },
  {
    text: 'Low: activities that are performed with a low activity such as jogging or walking.',
    style: 0
  }
];

export const INTENSITY_ZONES_EXPLANATION_HOCKEY = [
  {
    text: 'Explosive: maximal intensity, i.e. all-out movements such as sprinting as fast as possible or very hard accelerations and decelerations.',
    style: 0
  },
  {
    text: 'Very High: activities that are performed with near-maximal intensity such as very high speed skating or cuts and changes of direction.',
    style: 0
  },
  {
    text: 'High: activities that are performed with high intensity such as skating at high speed.',
    style: 0
  },
  {
    text: 'Moderate: activities that are performed with moderate intensity such as skating at a regular pace.',
    style: 0
  },
  {
    text: 'Low: activities that are performed with a low activity such as low speed skating.',
    style: 0
  }
];

export const DOTTED_LINES_CHARTS =
  '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -';

// Dropdown data
export const DROPDOWN_DATA_TRAINING = [
  {
    label: 'Session Average',
    value: '2',
    text: 'Compare your sessions to values obtained in the same type of training in previous weeks.',
    icon: 'bars_icon',
    key: DropdownFilterKeys.BENCHMARK
  },
  {
    label: "Don't compare",
    value: '3',
    text: 'Don’t compare to load goals or benchmark values.',
    icon: 'block_icon',
    key: DropdownFilterKeys.DONT_COMPARE
  },
  {
    label: 'Best Match',
    value: '4',
    text: 'Compare to the match with the highest acheived load number.',
    icon: 'flame_icon',
    key: DropdownFilterKeys.BEST_MATCH
  }
];

export const DROPDOWN_DATA_WEEKLY_LOAD = [
  {
    label: "Don't compare",
    value: '3',
    text: 'Don’t compare to load goals or benchmark values.',
    icon: 'block_icon',
    key: DropdownFilterKeys.DONT_COMPARE
  },
  {
    label: 'Previous Week',
    value: '5',
    text: 'Compare this week sessions to values obtained in the sessions from previous week.',
    icon: 'bars_icon',
    key: DropdownFilterKeys.LAST_WEEK
  },
  {
    label: 'Last 4 weeks',
    value: '6',
    text: 'Compare to an average of the last 4 weeks.',
    icon: 'last_4_weeks',
    key: DropdownFilterKeys.LAST_4_WEEK
  },
  {
    label: 'Selected week',
    value: '7',
    text: 'Choose a specific week to benchmark against.',
    icon: 'selected_week',
    key: DropdownFilterKeys.SELECTED_WEEK
  }
];

export const DROPDOWN_DATA_TRAINING_NO_BENCHMARK = [
  {
    label: "Don't compare",
    value: '3',
    text: 'Don’t compare to load goals or benchmark values.',
    icon: 'block_icon',
    key: DropdownFilterKeys.DONT_COMPARE
  },
  {
    label: 'Best Match',
    value: '4',
    text: 'Compare to the match with the highest acheived load number.',
    icon: 'flame_icon',
    key: DropdownFilterKeys.BEST_MATCH
  }
];

export const DROPDOWN_DATA_MATCH = [
  {
    label: 'Best Match',
    value: '1',
    text: 'Compare to the match with the highest acheived load number.',
    icon: 'flame_icon',
    key: DropdownFilterKeys.BEST_MATCH
  },
  {
    label: "Don't compare",
    value: '2',
    text: 'Don’t compare to previous matches.',
    icon: 'block_icon',
    key: DropdownFilterKeys.DONT_COMPARE
  }
];

export const WEEKLY_OVERVIEW_CHART_ZONE_SELECTOR = [
  {
    label: 'Team load',
    color: variables.textBlack,
    key: 'playerLoad',
    aboveAverageColor: variables.lightGrey
  },
  {
    label: 'Explosive',
    color: variables.chartExplosive,
    key: 'explosive',
    aboveAverageColor: variables.chartExplosiveAboveAverage
  },
  {
    label: 'Very high',
    color: variables.chartVeryHigh,
    key: 'veryHigh',
    aboveAverageColor: variables.chartVeryHightAboveAverage
  },
  {
    label: 'High',
    color: variables.chartHigh,
    key: 'high',
    aboveAverageColor: variables.chartHightAboveAverage
  }
];

export const PLAYER_LIST_CHART_ZONE_SELECTOR_HOCKEY = [
  {
    label: 'Time on ice',
    color: variables.textBlack,
    key: 'timeOnIce',
    aboveAverageColor: variables.lightGrey
  },
  {
    label: 'Total Load',
    color: variables.textBlack,
    key: 'playerLoad',
    aboveAverageColor: variables.lightGrey
  },
  {
    label: 'Load Pr. Minute',
    color: variables.textBlack,
    key: 'loadPrMin',
    aboveAverageColor: variables.lightGrey
  },
  {
    label: 'Explosive',
    color: variables.chartExplosive,
    key: 'explosive',
    aboveAverageColor: variables.chartExplosiveAboveAverage
  },
  {
    label: 'Very high',
    color: variables.chartVeryHigh,
    key: 'veryHigh',
    aboveAverageColor: variables.chartVeryHightAboveAverage
  },
  {
    label: 'High',
    color: variables.chartHigh,
    key: 'high',
    aboveAverageColor: variables.chartHightAboveAverage
  },
  {
    label: 'Moderate',
    color: variables.chartModerate,
    key: 'moderate',
    aboveAverageColor: variables.chartModerateAboveAverage
  }
];

export const PLAYER_LIST_CHART_ZONE_SELECTOR = [
  {
    label: 'Total Load',
    color: variables.textBlack,
    key: 'playerLoad',
    aboveAverageColor: variables.lightGrey
  },
  {
    label: 'Load Pr. Minute',
    color: variables.textBlack,
    key: 'loadPrMin',
    aboveAverageColor: variables.lightGrey
  },
  {
    label: 'Explosive',
    color: variables.chartExplosive,
    key: 'explosive',
    aboveAverageColor: variables.chartExplosiveAboveAverage
  },
  {
    label: 'Very high',
    color: variables.chartVeryHigh,
    key: 'veryHigh',
    aboveAverageColor: variables.chartVeryHightAboveAverage
  },
  {
    label: 'High',
    color: variables.chartHigh,
    key: 'high',
    aboveAverageColor: variables.chartHightAboveAverage
  },
  {
    label: 'Moderate',
    color: variables.chartModerate,
    key: 'moderate',
    aboveAverageColor: variables.chartModerateAboveAverage
  },
  {
    label: 'Low',
    color: variables.chartLow,
    key: 'low',
    aboveAverageColor: variables.chartLowAboveAverage
  }
];

export const ACTIVITY_GRAPH_TITLE_LEGEND = {
  legendTitle: 'Intensity zones',
  legends: [
    { color: variables.chartExplosive, text: 'Explosive' },
    { color: variables.chartVeryHigh, text: 'Very High' },
    { color: variables.chartHigh, text: 'High' }
  ]
};

export const MOVEMENTS_GRAPH_TITLE_LEGEND = {
  legendTitle: 'Intensity zones',
  legends: [
    { color: variables.chartExplosive, text: 'Explosive' },
    { color: variables.chartVeryHigh, text: 'Very High' }
  ]
};

export const DEFAULT_CHART_VERTICAL_LINES = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
];

export const CHART_TITLES = {
  total_load: 'total load',
  time_in_zone: 'time in zone',
  activity_graph: 'activity graph',
  continuous_movements: 'continuous movements',
  previous_events: 'load from previous 20 sessions',
  previous_matches: 'team load - previous matches',
  total_weekly_load: 'total weekly load',
  weekly_overview: 'weekly overview',
  total_time_on_ice: 'total time on ice',
  twelve_week_overview: '12 week overview',
  match_feedback: 'Match feedback from players',
  training_feedback: 'Training feedback from players',
  aggregated_feedback: 'Aggregated Team feedback',
  wellness: 'Wellness',
  high_intensity_actions: 'High intensity actions'
};

export const PLAYER_LIST_CHART_TITLE_LEGEND = {
  legendTitle: '',
  legends: [{ color: variables.chartExplosive, text: '100%' }]
};

export const TYPE_OF_ZONE_SELECTOR = {
  playersList: 'playersList',
  pastMatches: 'pastMatches',
  weeklyOverview: 'weeklyOverview',
  playersHockeyList: 'playersHockeyList'
};

export const EXPLANATION_TYPES = {
  intensityZones: 'intensityZones',
  movements: 'movements',
  bestMatch: 'bestMatch',
  benchmark: 'benchmark',
  loadGoal: 'loadGoal',
  timeInZone: 'timeInZone',
  playerLoad: 'playerLoad',
  rpe: 'rpe'
};

export const ONBOARDING_NAVIGATOR_TEXTS = {
  BASIC_ONBOARDING:
    'By specifying the team’s gender and age, we can customise our performance tracking and analysis to help you reach your goals.',
  RECURRING_EVENT:
    'Select the weekdays and timeslot your team trains from the list to set your sessions up in the calendar. When ready, click Save.',
  RECURRING_EVENT_EDIT:
    'Perfect. Your recurring training sessions are now set up. You can edit or add a specific training by clicking on the date, or edit later in your Calendar.',
  INVITE_PLAYERS_FIRST_PLAYER: `This is your Player List. They’re categorised by position will be assigned with tags.Let’s add a player to your team.`,
  INVITE_PLAYERS_SECOND_PLAYER:
    'Adding a new Player automatically sends an email invitation to him/her. This way they can set up their own Player App.',
  INVITE_PLAYERS_LAST_TEXT:
    'Rinse repeat. It’s now up to you if you want to add your whole team or do it later.'
};

export const ONBOARDING_STEPS = {
  activate: 'Activate your Account',
  recurring: 'Set up Recurring Trainings',
  upcoming: 'Import your Upcoming Matches',
  playerLoad: 'Set up Player Load',
  players: 'Invite your Players'
};

export const TEAM_AGE_OPTIONS = [
  { label: 'U10', value: 'U10' },
  { label: 'U11', value: 'U11' },
  { label: 'U12', value: 'U12' },
  { label: 'U13', value: 'U13' },
  { label: 'U14', value: 'U14' },
  { label: 'U15', value: 'U15' },
  { label: 'U16', value: 'U16' },
  { label: 'U17', value: 'U17' },
  { label: 'U18', value: 'U18' },
  { label: 'U19', value: 'U19' },
  { label: 'U20', value: 'U20' },
  { label: 'U21', value: 'U21' },
  { label: 'Senior', value: 'Senior' }
];

export const MATCH_PERIODS = [
  { drillName: 'preMatch', title: 'Pre Match ', tagTitle: 'Pre-Match' },
  { drillName: 'firstHalf', title: 'Mark Match', tagTitle: '1st Half' },
  { drillName: 'Halftime', title: 'Mark Halftime', tagTitle: 'Halftime' },
  { drillName: 'secondHalf', title: 'Mark 2nd Half', tagTitle: '2nd Half' },
  { drillName: 'overtime', title: 'Overtime', tagTitle: 'Overtime' },
  { drillName: 'end', title: 'noBtn', tagTitle: '' },
  { drillName: 'fullSession', title: 'Full Session ', tagTitle: 'Full Session' }
];

export const MATCH_PERIODS_HOCKEY = [
  { drillName: 'preMatch', title: 'Pre Match ', tagTitle: 'Pre-Match' },
  { drillName: 'firstPeriod', title: 'Mark Match', tagTitle: '1st Period' },
  { drillName: 'intermission', title: 'Mark Intermission', tagTitle: 'Int.' },
  {
    drillName: 'secondPeriod',
    title: 'Mark 2nd Period',
    tagTitle: '2nd Period'
  },
  { drillName: 'intermission', title: 'Mark Intermission', tagTitle: 'Int.' },
  {
    drillName: 'thirdPeriod',
    title: 'Mark 3rd Period',
    tagTitle: '3rd Period'
  },
  { drillName: 'overtime', title: 'Overtime', tagTitle: 'Overtime' },
  { drillName: 'end', title: 'noBtn' },
  { drillName: 'fullGame', title: 'Full Game ', tagTitle: 'Full Game' },
  { drillName: 'fullSession', title: 'Full Session ', tagTitle: 'Full Session' }
];

export const EVENT_SUBSESSIONS = {
  preMatch: 'preMatch',
  firstPeriod: 'firstPeriod',
  intermission: 'intermission',
  secondPeriod: 'secondPeriod',
  thirdPeriod: 'thirdPeriod',
  firstHalf: 'firstHalf',
  halftime: 'halftime',
  secondHalf: 'secondHalf',
  overtime: 'overtime',
  fullGame: 'fullGame',
  fullSession: 'fullSession'
};

export const MATCH_PERIODS_CONCAT = [...MATCH_PERIODS, ...MATCH_PERIODS_HOCKEY];

export const MATCH_SELECTOR_TITLE = `Select pre-match or match`;
export const MATCH_SELECTOR_TEXT = `To begin, select whether your players will be starting a pre-match or a match. You can always mark additional match events, such as start match and halftime, once you've started your tracking session.`;

export const TRAINING_CATEOGRY_OPTIONS = [
  {
    label: 'No Category',
    value: 'no_category'
  },
  {
    label: 'Individual',
    value: 'individual'
  },
  {
    label: 'MD',
    value: 0
  },
  {
    label: '+1',
    value: 1
  },
  {
    label: '+2',
    value: 2
  },
  {
    label: '+3',
    value: 3
  },
  {
    label: '-1',
    value: -1
  },
  {
    label: '-2',
    value: -2
  },
  {
    label: '-3',
    value: -3
  },
  {
    label: '-4',
    value: -4
  },
  {
    label: '-5',
    value: -5
  },
  {
    label: '-6',
    value: -6
  },
  {
    label: '-7',
    value: -7
  },
  {
    label: '-8',
    value: -8
  }
];

export const ACUTE_CHRONIC_OPTIONS = {
  RATIO_WIDTH: 120,
  CONTAINER_PADDING: 21,
  CARD_PADDING: 27,
  NUM_ITEMS: 19
};

export const gradientColorsTraining = [
  { offset: 0, color: variables.gradientBlue },
  { offset: 1, color: variables.gradientGreen }
];

export const gradientColorsMatch = [
  { offset: 0, color: variables.gradientPink },
  { offset: 1, color: variables.gradientPurple }
];
