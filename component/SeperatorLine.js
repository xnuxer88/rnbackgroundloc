import React, { Component } from 'react';
import { View } from 'react-native';

class SeperatorLine extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
  
    render() {
      const { style } = this.props;
  
      return (
        <View style={[{height: 1, backgroundColor: '#D2D3D4'}, style]}>
        </View>
      );
    }
  }

  export default SeperatorLine;