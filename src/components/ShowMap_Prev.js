import React, {Component} from 'react';
import {View, StyleSheet, MapView } from 'react-native';
import MapboxGL  from '@mapbox/react-native-mapbox-gl'; 
import PropTypes from 'prop-types';
import Annotation from './Annotation';
import Constants from './../../util.js'
import Directions from './Directions';



export default class ShowMap extends Component {
    static propTypes = {
            
        /**
         * Origin coordinate in [longitude, latitude] format
         */
        src: PropTypes.arrayOf(PropTypes.number),
    
        /**
         * Destination coordinate in [longitude, latitude] format
         */
        dest: PropTypes.arrayOf(PropTypes.number),
        /**
         * Origin place
         */

        srcName: PropTypes.string,
        /**
         * Destination place
         */
        destName: PropTypes.string,
        /**
         *  Value to indicate whether the Map is to be rendered for the first time or not
         * 
         */
        first: PropTypes.bool,
    
        /**
         * Callback that get fired anytime directions are fetched from API.
         */
        onInstructionsFetched: PropTypes.func,
          
      };

    constructor(props){
        super(props);

        this.state = {
            mapboxGL: null,
        };
        this.onDirectionsFetched = this.onDirectionsFetched.bind(this);
        this.moveCameraToFitBounds = this.moveCameraToFitBounds.bind(this);

    }
    
   componentDidMount () {
        console.log('ShowMap - didMount :');

        this.setState({ mapboxGL: new MapboxGL.MapView(Constants.MAPBOX_ACCESS_TOKEN) });
    }

    onDirectionsFetched(instrc){
        console.log('Showmap - instructions : '+instrc);

        //this.moveCameraToFitBounds();
        
        if (this.props.onInstructionsFetched) {
            this.props.onInstructionsFetched(instrc);
        }

    }

    //Map camera transitions to fit provided bounds
    moveCameraToFitBounds(){
        console.log('ShowMap - moveCamera');
        if (!this.props.src || !this.props.dest || !this.state.mapboxGL) {
            return;
        }

        console.log('ShowMap - moveCamera');
        this.state.mapboxGL.fitBounds(this.props.src, this.props.dest, 50);

    }

    render(){

    const {src, dest, srcName, destName, first} = this.props;
  
    console.log('ShowMap : '+src+' '+' '+dest+' '+first);
        if(first == true ) {
            return(
                <MapboxGL.MapView
                    ref={(c) => this._map = c}
                    style={styles.container}
                    minZoomLevel = {1}
                    maxZoomLevel={24}
                    zoomLevel={3}
                    zoomEnabled ={true}
                    scrollEnabled= {true}
                    centerCoordinate={src}
                    styleURL = {MapboxGL.StyleURL.Street}
                    showUserLocation={true}
                />
            );
        }
        else
        {   
            return (
                <MapboxGL.MapView
                    ref={(c) => this._map = c}
                    style={styles.container}
                    minZoomLevel = {1}
                    maxZoomLevel={24}
                    zoomLevel={3}
                    zoomEnabled ={true}
                    scrollEnabled= {true}
                    centerCoordinate={src}
                    styleURL = {MapboxGL.StyleURL.Street}
                    OnMapChangedListener={this.moveCameraToFitBounds}
                    >
                     
                        <MapboxGL.PointAnnotation
                            key='SourceAnnotation'
                            id='SourceAnnotation'
                            coordinate={src}>

                            <MapboxGL.Callout title={srcName.toUpperCase()} />
                        </MapboxGL.PointAnnotation>
                        <MapboxGL.PointAnnotation
                            key='DestinationAnnotation'
                            id='DestinationAnnotation'
                            coordinate={dest}>

                            <MapboxGL.Callout title={destName.toUpperCase()} />
                        </MapboxGL.PointAnnotation>
                        <Directions 
                            accessToken={Constants.MAPBOX_ACCESS_TOKEN} 
                            origin={src} destination={dest} 
                            type='driving-traffic' 
                            onDirectionsFetched={(instrc) => this.onDirectionsFetched(instrc)}
                        />
                   
                      {/*}  <Annotation lngLat={src} text='Source' id='SourceAnnotation' />
                      {this.moveCameraToFitBounds()}
                      */}
                                     
                </MapboxGL.MapView>
                
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: null
      }
  });
  
  