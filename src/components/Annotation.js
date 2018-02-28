import React from 'react';
import { StyleSheet,  View} from 'react-native';
import MapboxGL  from '@mapbox/react-native-mapbox-gl'; 
import Constants from './../../util.js'

MapboxGL.setAccessToken(Constants.mapboxAccessToken);

const Annotation = (props) =>{
  console.log('Annotation : '+props.lngLat);
    return(
         <MapboxGL.PointAnnotation
              key={props.id}
              id={props.id}
              coordinate={props.lngLat}>
          <MapboxGL.Callout title={props.text} />
        </MapboxGL.PointAnnotation>
    );
};

export default Annotation;

const styles = StyleSheet.create({
    
    annotationContainer: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 15,
    },
    annotationFill: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: 'orange',
      transform: [{ scale: 0.6 }],
    }
  });
  
  /*}
        <MapboxGL.PointAnnotation
            key={props.id}
            id={props.id}
            coordinate={props.lngLat}>

          <MapboxGL.Callout title={props.text} />
      </MapboxGL.PointAnnotation>
    */