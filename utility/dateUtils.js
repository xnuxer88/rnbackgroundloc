import moment from 'moment-timezone';
import * as RNLocalize from 'react-native-localize';

export const momentStringUtils = {

    dateWithStandardFormat: (date) => {
      return moment(date).format(momentFormatUtils.standardFormat);
    },
  
    startOfToday: () => {
      return moment().startOf('day').format(momentFormatUtils.standardFormat);
    },
  
    endOfToday: () => {
      return moment().endOf('day').format(momentFormatUtils.standardFormat);
    },
  
    startOfDay: (date) => {
      return moment(date).startOf('day').format(momentFormatUtils.standardFormat);
    },
  
    endOfDay: (date) => {
      return moment(date).endOf('day').format(momentFormatUtils.standardFormat);
    },
  
    startOfDaySubtract12Hrs: (date) => {
      return moment(date).startOf('day').subtract(12, 'hours').format(momentFormatUtils.standardFormat);
    },
  
    startOfDayWithoutTimeZone: (date) => {
      return moment.utc(date).startOf('day').format(momentFormatUtils.standardFormat);
    },
  
    endOfDayWithoutTimeZone: (date) => {
      return moment.utc(date).endOf('day').format(momentFormatUtils.standardFormat);
    },
  
    dateWithoutTimeZone: (date) => {
      return moment(date, momentFormatUtils.standardFormat).format(momentFormatUtils.standardFormat);
    },
  
    dateUTCWithoutTimeZone: (date) => {
      return moment.utc(date, momentFormatUtils.standardFormat).format(momentFormatUtils.standardFormat);
    },
  
    dateWithLocalTimeZone: (date) => {
      const timeZone = RNLocalize.getTimeZone();
      return moment.utc(date, momentFormatUtils.standardFormat).format(momentFormatUtils.standardFormat) + moment.tz(timeZone).format('ZZ');
    },
  
    dateWithDescriptiveText: (date) => {
      return moment.utc(date, momentFormatUtils.standardFormat).format('DD MMM YYYY HH:mm');
    },
  
    getCurrentTimeZoneString: () => {
    const timeZone = RNLocalize.getTimeZone();
      return `GMT${moment.tz(timeZone).format('Z')}`;
    },
  
    jsDateToForceUTC: (jsDate) => {
      return momentStringUtils.forceUTC(moment.utc(jsDate).format(momentFormatUtils.standardFormat));
    },
  
    /**
     * @param {string} dateString Eg. 2020-01-01T09:09:00
     * @returns 2020-01-01T09:09:00Z
     */
    forceUTC: (dateString) => {
      return dateString + 'Z';
    }
  };