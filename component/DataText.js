import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export default class DataText extends React.Component {
  _renderTime = () => {
    const {
      time, valueFontSize, unitFontSize, style,
      hideHours, hideMinutes, hideSeconds
    } = this.props;

    return (
      <View style={[styles.timeContainer, style]}>
        {!hideHours && (
          <Text style={[styles.rowItem_large_text, {fontSize: valueFontSize || styles.rowItem_large_text.fontSize}]}>
            {time.hours}
            <Text style={[styles.rowItem_small_text, {marginLeft: 3, fontSize: unitFontSize || styles.rowItem_small_text.fontSize}]}>
              {` h `}
            </Text>
          </Text>
        )}
        {!hideMinutes && (
          <Text style={[styles.rowItem_large_text, {fontSize: valueFontSize || styles.rowItem_large_text.fontSize}]}>
            {time.minutes}
            <Text style={[styles.rowItem_small_text, {marginLeft: 3, fontSize: unitFontSize || styles.rowItem_small_text.fontSize}]}>
              {` m `}
            </Text>
          </Text>
        )}
        {!hideSeconds && (
          <Text style={[styles.rowItem_large_text, {fontSize: valueFontSize || styles.rowItem_large_text.fontSize}]}>
            {time.seconds}
            <Text style={[styles.rowItem_small_text, {marginLeft: 3, fontSize: unitFontSize || styles.rowItem_small_text.fontSize}]}>
              {` s `}
            </Text>
          </Text>
        )}
      </View>
    )
  }

  render() {
    const {
      title, children, unit, style, time, titleFontSize, valueFontSize, unitFontSize
    } = this.props;

    if (time) {
      return this._renderTime();
    }

    return (
      <View style={style}>
        {title && <Text style={[styles.title, {marginBottom: 5.5, fontSize: titleFontSize || styles.title.fontSize}]}>{title}</Text>}
        <Text style={[styles.rowItem_large_text, {fontSize: valueFontSize || styles.rowItem_large_text.fontSize}]}>
          {children}
          {unit ? (
            <Text style={[styles.rowItem_small_text, {marginLeft: 3, fontSize: unitFontSize || styles.rowItem_small_text.fontSize}]}>
              {` ${unit}`}
            </Text>
          ) : ''}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    color: '#818386'
  },
  rowItem_large_text: {
    fontSize: 24,
    color: '#59585A'
  },
  rowItem_small_text: {
    fontSize: 16,
    color: '#59585A'
  },
  timeContainer: {
    flexDirection: 'row'
  }
});
