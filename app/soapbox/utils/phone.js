/** List of supported E164 country codes. */
const COUNTRY_CODES = ['1', '44'];

/** Supported E164 country code. */

/** Check whether a given value is a country code. */
const isCountryCode = value => COUNTRY_CODES.includes(value);
export { COUNTRY_CODES, isCountryCode };