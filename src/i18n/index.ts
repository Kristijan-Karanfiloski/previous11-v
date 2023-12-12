import i18n from './i18n';

/**
 * Translates text.
 *
 * @param key The i18n key.
 */
export function translate(key: string, options?: object) {
  return key ? i18n.t(key, options) : null;
}
