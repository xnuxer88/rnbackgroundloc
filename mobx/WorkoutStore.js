import moment from 'moment-timezone';
import { observable, action, computed, toJS } from 'mobx';
import { persist } from 'mobx-persist';
import { momentStringUtils } from '../utility/dateUtils';

class WorkoutStore {
    @persist @observable isWorkoutRunning = false;

    @persist @observable workoutActivity = null;
    @persist @observable workoutType = null;
    @persist @observable startDate = '';

    @persist('object') @observable currentCoordinate = null;
    @persist('list') @observable gpsCoord = [];
    @persist('object') @observable lastSavedCoord = null;
    @persist @observable duration = 0;
    @persist @observable distance = 0;
    @persist @observable steps = 0;
    @persist @observable calories = 0;
    @persist @observable cadence = 0;
    @persist @observable pace = 0;
    @persist @observable avgPace = 0;
    @persist @observable highestPace = 0;
    @persist @observable elevationGain = 0;

    @persist @observable totalPace = 0;
    @persist @observable totalPaceData = 0;

    @observable navigateToStartWorkout = false;
    @observable paceList = [];

    @persist @observable workoutError = false;
    @observable workoutStillOccured = false;

  @action setNavigateToStartWorkout(value) {
    this.navigateToStartWorkout = value;
  }

  @action setWorkoutDetail(workoutActivity, workoutType) {
    this.workoutActivity = workoutActivity;
    this.workoutType = workoutType;
  }
  
  @action startWorkout(startDate) {
    this.isWorkoutRunning = true;
    this.startDate = startDate;
  }
  @action stopWorkout() {
    this.isWorkoutRunning = false;
  }
  @action updateLocation(data) {
    this.pace = data.pace;
    this.distance = data.distance;
    this.currentCoordinate = data.currentCoordinate;

    this.totalPace = data.totalPace;
    this.totalPaceData = data.totalPaceData;
    this.avgPace = data.avgPace;
    this.highestPace = data.highestPace;
    this.elevationGain = data.elevationGain;
  }
  @action setCurrentCoordinate(currentCoordinate) {
    this.currentCoordinate = currentCoordinate;
  }
  @action updatePath(coord) {
    this.gpsCoord = [...this.gpsCoord, coord];
    this.lastSavedCoord = coord;
  }
  @action updateWorkout(data) {
    this.duration = data.duration;
    this.steps = data.steps;
    this.calories = data.calories;
    this.distance = data.distance || this.distance;
    this.cadence = data.cadence;
  }
  @action pushPaceList(pace) {
    if (this.paceList.length === 10) {
      this.paceList.shift();
    }
    this.paceList.push(pace);
  }
  @action resetWorkout() {
    this.isWorkoutRunning = false;

    this.workoutActivity = null;
    this.workoutType = null;
    this.startDate = '';

    this.currentCoordinate = null;
    this.gpsCoord = [];
    this.lastSavedCoord = null;
    this.duration = 0;
    this.distance = 0;
    this.steps = 0;
    this.calories = 0;
    this.cadence = 0;
    this.pace = 0;
    this.totalPace = 0;
    this.totalPaceData = 0;
    this.avgPace = 0;
    this.highestPace = 0;
    this.elevationGain = 0;
    this.paceList = [];

    this.workoutError = false;

    this.workoutStillOccured = false;
  }

  @action saveGeolocationData() {
    const gpsCoord = toJS(this.gpsCoord);
    
    const geolocation = {
      startDate: momentStringUtils.forceUTC(this.startDate),
      highestPace: this.highestPace,
      avgPace: this.avgPace,
      elevationGain: this.elevationGain,
      gpsCoord: gpsCoord.length > 0 ? JSON.stringify(gpsCoord) : null
    };

    realmWritingWrapper(() => {
      try {
        realmCreateWrapper('GeolocationData', geolocation);
      }
      catch (e) {
        console.warn('Error on creation: ', e);
        RNLogger.logError(LoggerKeys.realmError, e, e.message);
      }
    });
  }

  @action setWorkoutError(value) {
    this.workoutError = value;
  }

  @action setWorkoutStillOccured(value) {
    this.workoutStillOccured = value;
  }
}

export default new WorkoutStore();