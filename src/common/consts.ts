export const NO_ROWS_AFFECTED = 0;
export const SUCCESS_STATUS_CODE = 200;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{10,}$/;
export const HASH_SALT = 10;
export const NAME_MIN_LENGTH = 3;
export const SLICE_START = 0;

export const FIRST_DAY_OF_MONTH = 1;
export const LAST_DAY_OF_MONTH = 0;
export const MILLIS_PER_DAY = 86400000;
export const DAYS_PER_WEEK = 7;
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_HOUR = 60;
export const SECONDS_PER_MINUTE = 60;
export const MILLIS_PER_SECOND = 1000;

export const CITY_REGEX = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
export const ADDRESS_REGEX = /^[A-Za-z0-9\s,'-.]+$/;
export const DATE_REGEX =
  /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;
export const TIME_ZONE_REGEX = /\(\w{3}[+-]\d{1,2}\)\s\w+\w+/;

export const SEVEN = 7;
export const ONE = 1;
export const LIMIT = 10;
export const FIFTEEN = 15;
export const THIRTY = 30;
export const ZERO = 0;
export const FIVE_NINE = 59;
export const TWENTY_THREE = 23;

export const BACKWARD = -1;
export const FORWARD = 1;

export const GOOGLE_URL =
  'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token';

export const GOOGLE_TOCKEN_PATH = 'https://oauth2.googleapis.com/token';

export const NOTE_MIN_LENGTH = 10;

export const DATE = 'Date';

export const DOCTOR = 'Doctor';

export const DESC = 'desc';

export const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
