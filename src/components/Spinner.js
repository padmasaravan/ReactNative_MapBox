import React from 'react';
import {ActivityIndicator, View, Text } from 'react-native';


const Spinner = (size) => {
    return(
        <View style={styles.spinnerStyle}>
            <ActivityIndicator size="large" color='green'/>
          
        </View>
        
    );
};

export default Spinner;

const styles = {
    spinnerStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderColor: '#0383FA',
        borderWidth: 0.20,
    }
};