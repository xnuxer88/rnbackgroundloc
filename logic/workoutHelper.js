const workoutHelper = {
  //haversine formula
  calculateDistance: (startCoords, endCoords) => {
    if ((startCoords == undefined) || (endCoords == undefined)) {
      return 0;
    }
    const {
      latitude: startLat,
      longitude: startLong
    } = startCoords;
    const {
      latitude: endLat,
      longitude: endLong
    } = endCoords;

    if ((startLat == endLat) && (startLong == endLong)) {
      return 0;
    }
    else {
      const R = 6371; //km
      const conrad = Math.PI / 180;
      const dLat = conrad * (endLat - startLat);
      const dLong = conrad * (endLong - startLong);
      const dStartLat = conrad * startLat;
      const dEndLat = conrad * endLat;

      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLong / 2) * Math.sin(dLong / 2) * Math.cos(dStartLat) * Math.cos(dEndLat);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;
      // console.log('calculate dist: ', d);
      return d;
    }
  },

  calculatePace: (timeSec, distance) => {
    let pace = 0;
    let output = {
      pace: 0,
      minutes: '00',
      seconds: '00'
    };

    if (distance >= 0.0003) { // calculate the pace of at least 30cm distance difference to avoid calculating pace on too little distance difference
      pace = timeSec / distance; //pace is sec/km
    }

    //convert output to min:sec / km
    if (pace > 0 && pace <= 1800) { // Limit to 30'00"
      const { minutes, seconds } = convertSecondsToTimeUnit(pace, 'minutes');
      output = {
        pace,
        paceDisplay: `${minutes}'${seconds}"`,
      };
    }
    return output;
  },

  calculateAveragePaceToDisplay: (paceList) => {
    if (paceList.length < 10) return '--';
    let totalPace = 0;
    for (let i = 0; i < paceList.length; ++i) {
      totalPace += paceList[i];
    }
    const pace = totalPace / 10;
    const { minutes, seconds } = convertSecondsToTimeUnit(pace, 'minutes');
    return `${minutes}'${seconds}"`;
  },
}

export default workoutHelper;