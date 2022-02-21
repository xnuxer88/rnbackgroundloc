import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

export default class WorkoutBadge extends React.Component {
    render () {
        const { title, subtitle } = this.props;

        let icon = require('../assets/workout/running.png');

        return (
        <View style={styles.workoutIconContainer}>
            <Image style={styles.workoutIcon} source={icon} />
            <View style={styles.workoutCaptionContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    workoutCaptionContainer: {
      marginLeft: 10
    },
    title: {
      fontSize: 16,
      color: '#8F2472'
    },
    subtitle: {
      marginTop: 7,
      fontSize: 12,
      color: '#59585A'
    },
    workoutIconContainer: {
      flexDirection: 'row',
      marginVertical: 10.5,
      alignItems: 'center'
    },
    workoutIcon: {
      width: 40,
      height: 40
    },
  });