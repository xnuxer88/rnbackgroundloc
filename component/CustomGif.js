import React from 'react';
import { Image, View } from 'react-native';
import LottieView from 'lottie-react-native';

export default class CustomGif extends React.Component {
  
  constructor(props) {
    super(props);
    const {gifImageSource} = this.props;
    this.state={
      imageUri: gifImageSource && gifImageSource[0]
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stopAnimate != this.props.stopAnimate) {
      if (Array.isArray(this.props.gifImageSource)) {
        this._gif();
      }
    }
  }
  
  componentDidMount() {
    const {gifImageSource} = this.props;
    if (Array.isArray(gifImageSource)) {
      this._gif();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _gif() {
    const {gifImageSource, intervalTime, stopAnimate} = this.props;

    if (!stopAnimate) {
      let count = 0;
      this.interval = setInterval(() => {
        if (count >= gifImageSource.length) {
          count = 0;
        }
        this.setState({imageUri: gifImageSource[count]});
        count++;

      }, intervalTime ? intervalTime : 50);
    }
    else {
      this.interval && clearInterval(this.interval);
    }
  }


  render() {
    const { style, customContainnerStyle, gifImageSource } = this.props;
    const { imageUri } = this.state;
    return (
      <View style={customContainnerStyle}>
        {
          Array.isArray(gifImageSource)
            ? <Image style={style} source={imageUri}/>
            :
            <LottieView
              style={style}
              autoPlay
              loop
              imageAssetsFolder={gifImageSource.androidFilePath}
              source={gifImageSource.json}
            />
        }
      </View>
    );
  }
}