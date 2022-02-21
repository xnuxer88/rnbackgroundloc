import React from 'react';
import debounce from 'lodash.debounce'; // 4.0.8

const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : null;
};

export const colorWithOpacity = (color, opacity) => {
  var _color = color;
  if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(_color)) {
    _color = hexToRgb(_color);
  }
  let rbg2rbga = _color.splice(3, 0, 'a');
  let colorSliceLastString = rbg2rbga.slice(0, rbg2rbga.length - 1);
  let colorAddOpacity = colorSliceLastString + `,${opacity})`;
  return (colorAddOpacity);
};

String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

export const withPreventDoubleClick = (WrappedComponent) => {
  class PreventDoubleClick extends React.PureComponent {

    debouncedOnPress = () => {
      this.props.onPress && this.props.onPress();
    }

    onPress = debounce(this.debouncedOnPress, 300 , { leading: true, trailing: false }); 

    render() {
      return <WrappedComponent {...this.props} onPress={this.onPress} />;
    }
  }

  PreventDoubleClick.displayName = `withPreventDoubleClick(${WrappedComponent.displayName || WrappedComponent.name})`;
  return PreventDoubleClick;
};

export const convertSecondsToTimeUnit = (duration, unit = 'hours') => {
  let hours = 0;
  let minutes = Math.floor(duration / 60);
  let seconds = Math.floor(duration % 60);
  
  switch (unit) {
    case 'hours':
    case 'hour':
    case 'h':
    default:
      hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      if (hours < 10) {
        hours = `0${hours}`;
      }
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return {
        hours,
        minutes,
        seconds
      };

    case 'minutes':
    case 'minute':
    case 'm':
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return {
        minutes,
        seconds
      };
  }
};