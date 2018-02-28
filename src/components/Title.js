// Import libraries for making a component
import React from 'react';
import { Text, View, Platform } from 'react-native';

// Create a component

const Title = (props) => {
    const { textStyle, viewStyle } = styles;
    return (
     <View style={viewStyle}>
        <Text style={textStyle}>{props.titleText}</Text>
    </View>
    );
};
// Make the component available to other parts of the app

export default Title;

const styles = {
    viewStyle: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingTop: 5,
        ...Platform.select({
            ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.6
            },
            android: {
              elevation: 2
            }
          }),
        position: 'relative'
    },
    textStyle: {
        fontSize: 20,
        fontFamily: 'Times New Roman',
        color: 'black',
       

       
    }
};
