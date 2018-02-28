import React, {Component} from 'react';
import {View, StyleSheet, Platform } from 'react-native';
import MapboxGL  from '@mapbox/react-native-mapbox-gl'; 

import Title from './src/components/Title';
import LocationInput from './src/components/LocationInput';
import WhizzMap from './src/components/WhizzMap';

const IS_ANDROID = Platform.OS === 'android';

//Create a component
export default class App extends Component {
    constructor (props) {
        super(props);
    
        this.state = {
            isFetchingAndroidPermission: IS_ANDROID,
            isAndroidPermissionGranted: false,
        }
    }
   
  
 async componentWillMount(){
      if (IS_ANDROID) {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      this.setState({
        isAndroidPermissionGranted: isGranted,
        isFetchingAndroidPermission: false,
      });
    }
  }

  render(){
        return (
            <View style={{ flex: 1}}>
                <Title titleText={'Whizz Map'} />
                <WhizzMap />
            </View>
        );
    }

}
