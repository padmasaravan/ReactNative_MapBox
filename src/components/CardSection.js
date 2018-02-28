import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
    return (
        <View style={styles.containerStyle}>
            {props.children}
        </View>
    );
};

const styles = {
    containerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        borderColor: '#ddd',
        backgroundColor: '#E4F5FC',
        position: 'relative',
        height : 40
    }
};

export default CardSection;

