import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { title, customTitleStyle } = this.props;

        return (
            <View style={styles.viewContainer}>
                {/* Title */}
                <Text style={[styles.title, customTitleStyle]}>{title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        color: '#FFFFFF',
        alignItems: 'center',
    },
    viewContainer: {
        alignItems: 'center'
    },
});