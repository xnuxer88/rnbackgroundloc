import React from 'react';
import { View, Image, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Header from './component/Header';
import DataText from './component/DataText';
import SeperatorLine from './component/SeperatorLine';
import WorkoutBadge from './component/WorkoutBadge';
import MainButton from './component/MainButton';
import MapView from './component/MapView';
import BackgroundGeolocation from 'react-native-background-geolocation';
import WorkoutStore from './mobx/WorkoutStore';
import { convertSecondsToTimeUnit } from './utility';
import workoutHelper from './logic/workoutHelper';
import throttle from 'lodash.throttle';
import { toJS } from 'mobx';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandDetail: false,
      centerToCurrentCoordinate: true,
      lastDurationSinceCalc: WorkoutStore.duration,
      lastAltitude: 0,
    };
  }

  _confirmEndWorkout() {
    this._stopWorkout();
  }

  _stopWorkout() {
    this._stopMonitoring();
    WorkoutStore.resetWorkout();
  }

  _startMonitoring() {
    BackgroundGeolocation.onLocation(position => {
      this._updateMeasurement(position);
    }, error => {
      console.log('Failed to start watch position', error);
    });

    BackgroundGeolocation.onMotionChange(motionEvent => {
      console.log('Motion Event Triggered : ', motionEvent.isMoving);
      this._updateMeasurement(motionEvent.location);
    });

    BackgroundGeolocation.onActivityChange(activityEvent => {
      console.log('Activity Event Triggered : ', activityEvent.activity);
      BackgroundGeolocation.getCurrentPosition({
        persist: false
      }).then((position) => {
        this._updateMeasurement(position);
      });
    });

    BackgroundGeolocation.ready({
      // Geolocation Config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_OFF,
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 1,
      showsBackgroundLocationIndicator: true,
      preventSuspend: true,
      heartbeatInterval: 1000,
      pausesLocationUpdatesAutomatically: false,
      // Activity Recognition
      //stopTimeout: 1,
      //locationUpdateInterval: 1000,
      //fastestLocationUpdateInterval: 1000,
      backgroundPermissionRationale: {
        title: 'Allow POC App to access this device\'s location even when closed or not in use.',
        message: 'This app collects location data to enable recording your trips to work.',
        positiveAction: 'Change Location Access Permision to Always',
        negativeAction: 'Cancel'
      },
      autoSync: false,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,    // <-- Auto start tracking when device is powered-up.
      notification: {
        title: 'Workout In Progress',
        text: 'You have an ongoing workout. Tap to open.',
        channelName: 'Workout Progress'
        //color: "",
        //smallIcon: "",
        //largeIcon: ""
      }
    }, (state) => {
      if (!state.enabled) {
        // Start tracking!
        BackgroundGeolocation.start(function () {
          // You could request a new location if you wish.
          BackgroundGeolocation.getCurrentPosition({
            persist: false
          }).then((position) => {
            this._updateMeasurement(position); // only update position if the accuracy is <= 30 m
          });
        });

        BackgroundGeolocation.changePace(true);
      }
    });
  }

  _stopMonitoring() {
    BackgroundGeolocation.changePace(false);
    BackgroundGeolocation.removeListeners();
  }

  _renderDetail() {
    const {
      expandDetail
    } = this.state;

    let arrowImage;
    if (expandDetail) {
      arrowImage = require('./assets/workout/downarrow.png');
    }
    else {
      arrowImage = require('./assets/workout/uparrow.png');
    }

    const mainContent = [];
    const collapsibleContent = [];

    let fields = [
      {
        title: 'Pace',
        unit: '/km',
        key: 'pace'
      },
      {
        title: 'Distance',
        unit: 'km',
        key: 'distance'
      },
      {
        title: 'Cadence',
        unit: 'spm',
        key: 'cadence'
      },
    ];
    let title = 'Pace';

    for (let i = 0; i < fields.length; i += 1) {
      let value = '--';
      switch (fields[i].key) {
        case 'distance':
          value = WorkoutStore[fields[i].key] >= 0.01 ? WorkoutStore[fields[i].key].toFixed(2) : '--';
          break;
        case 'pace':
          value = this.state[fields[i].key + 'Display'];
          break;
        default:
          value = WorkoutStore[fields[i].key] ? WorkoutStore[fields[i].key] : '--';
          break;
      }

      if (i >= 3) {
        collapsibleContent.push(<DataText style={styles.dataText} title={fields[i].title} unit={fields[i].unit}>{value}</DataText>);
        if ((i + 1) % 3 !== 0) {
          collapsibleContent.push(<SeperatorLine style={styles.verticalSeparatorLine} />);
        }
      }
      else {
        mainContent.push(<DataText style={styles.dataText} title={fields[i].title} unit={fields[i].unit}>{value}</DataText>);

        if ((i + 1) % 3 !== 0) {
          mainContent.push(<SeperatorLine style={styles.verticalSeparatorLine} />);
        }
      }
    }

    return (
      <>
        {collapsibleContent.length > 0 && (
          <>
            <TouchableOpacity style={styles.arrowContainer} onPress={() => {
              this.setState({ expandDetail: !this.state.expandDetail });
            }}>
              <Image style={styles.downarrow} source={arrowImage} />
            </TouchableOpacity>

            <SeperatorLine style={styles.arrowSeparator} />
          </>
        )}
        <View style={styles.workoutDurationContainer}>
          <WorkoutBadge
            title={title}
            subtitle='Outdoor'
          />
          <DataText time={convertSecondsToTimeUnit(WorkoutStore.duration)} />
        </View>
        <View style={styles.detailView}>
          {mainContent}
        </View>
        {this.state.expandDetail && (<>
          <SeperatorLine style={styles.separatorLine} />
          <View style={styles.detailView}>
            {collapsibleContent}
          </View>
        </>)}
      </>
    );
  }

  _updateMeasurement(position) {
    const { latitude, longitude, altitude } = position.coords;

    const {
      lastSavedCoord
    } = WorkoutStore;

    let {
      avgPace,
      highestPace,
      totalPace,
      totalPaceData,
      elevationGain,
      currentCoordinate
    } = WorkoutStore;

    const newState = {
      lastAltitude: position.coords.altitude
    };

    if (currentCoordinate) {
      const distance = workoutHelper.calculateDistance(currentCoordinate, position.coords);

      if (this.state.lastAltitude) {
        const altitudeDelta = parseInt(altitude - this.state.lastAltitude);
        elevationGain += altitudeDelta;
      }

      let pace = 0;
      let paceDisplay = '--';

      // calculate pace
      const duration = WorkoutStore.duration - this.state.lastDurationSinceCalc;
      console.log("Duration : " + duration);
      console.log("WorkoutStore.duration : " + WorkoutStore.duration);
      console.log("this.state.lastDurationSinceCalc : " + this.state.lastDurationSinceCalc);
      const paceResult = workoutHelper.calculatePace(duration, distance);
      pace = paceResult.pace;

      if (pace > 0 && distance > 0) {
        totalPace += pace;
        totalPaceData += 1;

        avgPace = parseFloat((totalPace / totalPaceData).toFixed(2));
        highestPace = Math.min(pace, WorkoutStore.pace); // the lower the pace, the faster the run

        WorkoutStore.pushPaceList(pace);
        paceDisplay = workoutHelper.calculateAveragePaceToDisplay(WorkoutStore.paceList);
      }
      newState.lastDurationSinceCalc = WorkoutStore.duration;
      newState.paceDisplay = paceDisplay;
      const totalDistance = WorkoutStore.distance + distance;
      const shouldRecordPosition = !lastSavedCoord || (workoutHelper.calculateDistance(lastSavedCoord, position.coords) > 0.01); // add points if the distance difference is at least 10m
      if (shouldRecordPosition) {
        WorkoutStore.updatePath({ latitude, longitude });
      }

      WorkoutStore.updateLocation({
        pace,
        avgPace,
        highestPace,
        totalPace,
        totalPaceData,
        elevationGain,
        distance: totalDistance,
        currentCoordinate: { latitude, longitude }
      });
    }
    else {
      WorkoutStore.setCurrentCoordinate(position.coords);
    }

    this.setState(newState);    
  }

  componentDidMount() {
    this._startMonitoring();
  }

  componentWillUnmount() {
    this._stopMonitoring();
  }
  
  _onDrag = throttle(() => {
    this.setState({ centerToCurrentCoordinate: false });
  }, 1000);

  _renderMap() {
    const currentCoordinate = toJS(WorkoutStore.currentCoordinate);
    if (currentCoordinate === null) {
      return <Image
        source={require('./assets/icon/greymap.png')}
        resizeMode='cover'
        style={{ width: '100%', flex: 1 }}
      />;
    }
    const gpsCoord = toJS(WorkoutStore.gpsCoord);
    const { centerToCurrentCoordinate } = this.state;

    const currentLocationImage = centerToCurrentCoordinate ? require('./assets/workout/gpxLocation.png') : require('./assets/workout/gpxLocationMove.png');

    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1, marginBottom: -8 }}
          currentCoordinate={currentCoordinate}
          pathCoordinates={[...gpsCoord, currentCoordinate]}
          showsCompass
          centerToCurrentCoordinate={centerToCurrentCoordinate}
          ref={r => this.map = r}
          onDrag={this._onDrag}
        />
        <TouchableOpacity style={{ position: 'absolute', bottom: 16, right: 16, width: 40, height: 40 }} onPress={() => {
          this.setState({ centerToCurrentCoordinate: true });
        }}>
          <Image source={currentLocationImage} />
        </TouchableOpacity>
      </View>
    );
  }

  _renderAppScreen() {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Outdoor Workout"
        />
        <View style={styles.contentContainer}>
          {this._renderMap()}
          <View style={styles.bottomContainer}>
            {this._renderDetail()}
            <MainButton
              onPress={() => { this._confirmEndWorkout(); }}
              type={6}
              title='END'
              buttonStyle={styles.buttonStyle}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  render() {
    return this._renderAppScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#585858',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end'
  },
  detailView: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 15
  },
  arrowContainer: {
    height: 36.5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFFFF'
  },
  dataText: {
    width: '32%'
  },
  workoutDurationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    alignItems: 'center'
  },
  downarrow: {
    width: 20,
    height: 20
  },
  buttonStyle: {
    marginHorizontal: 15,
    marginTop: 7,
    marginBottom: 20,
    backgroundColor: '#EF4150',
    borderColor: '#EF4150'
  },
  arrowSeparator: {
    height: 2,
  },
  separatorLine: {
    marginHorizontal: 15,
    backgroundColor: '#E6E7E8'
  },
  verticalSeparatorLine: {
    height: '100%',
    width: 1,
    marginRight: 15.5,
    backgroundColor: '#E6E7E8'
  }
});
