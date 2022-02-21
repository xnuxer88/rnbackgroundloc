import React from 'react';
import { ViewPropTypes, Platform } from 'react-native';
import Map, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import PropTypes from 'prop-types';

export default class MapView extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        mapReady: false,
        currentHeading: 0
      };
    }
  
    _onDrag = (coordinate) => {
      this.setState({
        currentHeading: coordinate.heading
      });
  
      this.props.onDrag && this.props.onDrag();
    };
  
    _takeSnapshot () {
      this.snapshotTimeout = setTimeout(() => {
        const snapshot = this.map.takeSnapshot({
          format: 'jpg',   // image formats: 'png', 'jpg' (default: 'png')
          quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
          result: 'file'   // result types: 'file', 'base64' (default: 'file')
        });
    
        snapshot.then(this.props.onSnapshot);
      }, 2000);
    }
  
    componentDidUpdate() {
      const { currentCoordinate, centerToCurrentCoordinate } = this.props;
      if (this.map && centerToCurrentCoordinate && currentCoordinate) {
        this.map.animateCamera({
          center: currentCoordinate,
          pitch: 0,
          heading: this.state.currentHeading,
          zoom: 17
        });
      }
    }
  
    componentWillUnmount() {
      clearTimeout(this.snapshotTimeout);
    }
  
    render() {
      const {
        style,
        pathCoordinates = [],
        ref,
        currentCoordinate,
        disableInteraction,
        onSnapshot,
        showsCompass
      } = this.props;
  
      return (
        <Map
          style={style}
          provider={PROVIDER_GOOGLE}
          ref={r => {
            this.map = r;
            if (ref) ref(r);
          }}
          liteMode={disableInteraction}
          pointerEvents={disableInteraction ? 'none' : undefined} // for some reason 'auto' will still make the map not interactable
          showsCompass={showsCompass}
          onPanDrag={this._onDrag}
          onRegionChangeComplete={() => {
            if (Platform.OS === 'ios' && onSnapshot) {
              // take snapshot on second call of onRegionChangeComplete
              if (this.state.mapReady) {
                this._takeSnapshot();
              }
              else {
                this.setState({ mapReady: true });
              }
            }
          }}
          onMapReady={() => {
            if (pathCoordinates && pathCoordinates.length > 0) {
              this.map.fitToCoordinates(pathCoordinates, {
                edgePadding: {
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20
                },
                animated: false
              });
            }
  
            if (Platform.OS === 'android') {
              this._takeSnapshot();
            }
          }}
        >
          {pathCoordinates ? (<Polyline
            coordinates={pathCoordinates}
            strokeWidth={4}
            strokeColor='#8F2472'
            lineCap={'round'}
          />) : null}
          {currentCoordinate ? (<Marker
            coordinate={currentCoordinate}
            image={require('../assets/workout/navigation-circle.png')}
            anchor={{x: 0.5, y: 0.5}}
          />) : null}
        </Map>
      );
    }
  }
  
  MapView.propTypes = {
    style: ViewPropTypes.style,
    cameraCenter: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    pathCoordinates: PropTypes.arrayOf(PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    })),
    ref: PropTypes.func,
    currentCoordinate: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number
    }),
    disableInteraction: PropTypes.bool
  };
  