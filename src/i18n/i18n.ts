import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const en = require('./en');
const ja = require('./ja');

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
  en,
  ja
});
// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode;

export default i18n;
