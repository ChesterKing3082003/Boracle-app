import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function HeartRateDetails() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f4f4f4" />
            <Text style={styles.title}>Heart Rate Details</Text>
            <Text>Detailed heart rate data and insights will go here.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});