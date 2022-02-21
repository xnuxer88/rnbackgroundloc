import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colorWithOpacity, withPreventDoubleClick } from '../utility';
import CustomGif from './CustomGif';
import { Image, Dimensions } from 'react-native';
const TouchableOpacityDebounced = withPreventDoubleClick(TouchableOpacity);


const propTypes = {
  onPress: PropTypes.func,
  type: PropTypes.int,
  title: PropTypes.String,
  customStyle: PropTypes.style
};

const gifImage = [
  require('../assets/icon/searching_1.png'),
  require('../assets/icon/searching_2.png'),
  require('../assets/icon/searching_3.png'),
  require('../assets/icon/searching_4.png'),
  require('../assets/icon/searching_5.png'),
  require('../assets/icon/searching_6.png'),
  require('../assets/icon/searching_7.png'),
  require('../assets/icon/searching_8.png'),
  require('../assets/icon/searching_9.png'),
  require('../assets/icon/searching_10.png'),
  require('../assets/icon/searching_11.png'),
  require('../assets/icon/searching_12.png'),
];
export default class MainButton extends React.Component {

  _opacityButton(title, onPress) {
    const {customStyle} = this.props;
    return (
      <TouchableOpacityDebounced style={[styles.container_opacity, customStyle]} onPress={onPress}>
        <Text style={styles.font_size}>
          {title}
        </Text>
      </TouchableOpacityDebounced>
    );
  }

  _mainButton(title, onPress) {
    const {customStyle, disabled, backgroundColor, textColor, isSearching} = this.props;
    return (
      <TouchableOpacityDebounced
        style={[
          styles.container,
          {backgroundColor: backgroundColor},
          customStyle,
          disabled && {backgroundColor: '#E2E2E2'},
        ]}
        disabled={disabled || isSearching}
        onPress={onPress}>
        {
          !isSearching
            ? <Text style={[styles.font_size, {color: textColor ? textColor : '#FEFEFE'}]}>
              {title}
            </Text>
            : <CustomGif
              style={{height: 30, width: 30}}
              _resizeMode={'contain'}
              gifImageSource={gifImage}
            />
        }
   
        
      </TouchableOpacityDebounced>
    );
  }

  /**
   *
   * @param {*} title
   * @param {*} onPress
   * @param {*} isActiveButton
   *
   * Usage example
   * <View style={{marginTop: 125.7}}>
            <MainButton
              type={3}
              onPress={() => {
                this.setState((prevState) => {
                  return {
                    buttonStatus: !prevState.buttonStatus
                  };
                });
              }}
              title={'Use Default Max HR'}
              isActiveButton={this.state.buttonStatus}
            >
            </MainButton>
          </View>

      https://xd.adobe.com/spec/ba703ee5-0a16-4516-4660-df89df2b4172-cc41/screen/a03818ff-707b-47f8-a54a-dd780f2a90cf/06-2-10-profile-MAX-HR-default
   */
  _actionSwitchButton(title, onPress, isActiveButton) {

    var inactiveStyle = {
      button: {
        height: 41.7,
        width: Dimensions.get('window').width,
        backgroundColor: isActiveButton ? '#FFFFFF' : '#E8E7E8',
        borderColor: '#D2D3D4',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
      text: {
        fontSize: 20,
        color: isActiveButton ? '#BD3652' : '#A1A1A0',
        lineHeight: 24
      }
    };

    return <TouchableOpacityDebounced
      style={[inactiveStyle.button]}
      onPress={onPress}
    >
      <Text style={[inactiveStyle.text]}>
        {title}
      </Text>
    </TouchableOpacityDebounced>;
  }

  _actionGreenTextButton(title, onPress) {
    const { disabled } = this.props;
    var style = {
      button: {
        height: 49.96,
        width: Dimensions.get('window').width,
        backgroundColor: '#FFFFFF',
        borderColor: '#D2D3D4',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
      },
      text: {
        fontSize: 20,
        color: '#15A89E',
        lineHeight: 24
      }
    };

    return <TouchableOpacityDebounced
      style={[style.button]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[style.text, disabled && {color: '#E2E2E2'}]}>
        {title}
      </Text>
    </TouchableOpacityDebounced>;
  }

  _actionGreenBackgroundButton(title, onPress) {
    var style = {
      button: {
        height: 44,
        width: Dimensions.get('window').width,
        backgroundColor: '#24B0A9',
        alignItems: 'center',
        justifyContent: 'center'
      },
      text: {
        fontSize: 20,
        color: '#FFFFFF',
        lineHeight: 24
      }
    };

    return <TouchableOpacityDebounced
      style={[style.button]}
      onPress={onPress}
    >
      <Text style={[style.text]}>
        {title}
      </Text>
    </TouchableOpacityDebounced>;
  }

  _roundedCornerButton (title, onPress) {
    const { buttonStyle, icon } = this.props;
    return <TouchableOpacityDebounced
      onPress={onPress}
      style={[styles.roundedCornerButton, buttonStyle]}
    >
      {icon ? <Image style={styles.buttonIcon} source={icon} /> : null}
      <Text style={[styles.smaller_font_size]}>{title}</Text>
    </TouchableOpacityDebounced>;
  }
  
  render() {
    const { onPress, type, title } = this.props;

    if (type == 2) {
      return (this._opacityButton(title, onPress));
    }
    else if (type == 1) {
      return (this._mainButton(title, onPress, type));
    }
    else if (type == 3) {
      const { isActiveButton } = this.props;
      return (this._actionSwitchButton(title, onPress, isActiveButton));
    }
    else if (type == 4) {
      return (this._actionGreenTextButton(title, onPress));
    }
    else if (type == 5) {
      return (this._actionGreenBackgroundButton(title, onPress));
    }
    else if (type === 6) {
      return (this._roundedCornerButton(title, onPress));
    }
  }
}


const styles = StyleSheet.create({
  container: {
    height: 44,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_opacity: {
    height: 44,
    width: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: colorWithOpacity('#FFFFFF', 0.3),
  },
  font_size: {
    fontSize: 17.5,
    color: '#FEFEFE',
  },
  roundedCornerButton: {
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15A89E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#15A89E',
  },
  smaller_font_size: {
    fontSize: 14,
    color: '#FEFEFE',
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10.5
  }
});
