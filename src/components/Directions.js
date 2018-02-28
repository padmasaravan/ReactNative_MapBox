import React from 'react';
import PropTypes from 'prop-types';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import MapboxClient from 'mapbox';
import axios from 'axios';
import Places from './Places';
import Constants from './../../util.js';

const styles = MapboxGL.StyleSheet.create({
  directionsLine: {
    lineWidth: 4,
    lineCap: MapboxGL.LineCap.Round,
    lineJoin: MapboxGL.LineJoin.Round
  }
});

class Directions extends React.Component {
  static propTypes = {
    /**
     * Mapbox access token
     */
    accessToken: PropTypes.string.isRequired,

    /**
     * Origin coordinate in [longitude, latitude] format
     */
    origin: PropTypes.arrayOf(PropTypes.number),

    /**
     * Destination coordinate in [longitude, latitude] format
     */
    destination: PropTypes.arrayOf(PropTypes.number),
    
    /**
     * Origin
     */
    sourceName: PropTypes.string,

    /**
     * Destination 
     */
    destnName: PropTypes.string,

    /**
     * Callback that get fired anytime directions are fetched from API.
     */
    onDirectionsFetched: PropTypes.func,

    /**
     * Type of directions that are fetched from API. Possible choices are
     * walking, driving, cycling. Defaults to driving
     */
    type: PropTypes.oneOf([
     
      'walking',
      'cycling',
      'driving',
    ]),

    style: PropTypes.object,
  };

  constructor (props) {
    super(props);

    this.state = {
      mapboxClient: null,
      directions: null,
    };

    this._mapboxClient = null;
   
  }

  async componentDidMount () {
    console.log('Directions - didMount :'+this.props.accessToken);
    try{
        this.setState({ mapboxClient: new MapboxClient(this.props.accessToken) }, () => {
          this.fetchDirections(this.props.origin, this.props.destination, this.props.type);
        });
    }catch(e){
      console.log(e);
    }
  }

  componentWillReceiveProps (nextProps) {
    const origin = this.props.origin;
    const dest = this.props.destination;
    const profType = this.props.type;

    if (this.state.directions && (!origin || !dest)) {
      this.setState({ directions: null });
      return;
    }

    const nextOrigin = nextProps.origin;
    const nextDest = nextProps.destination;
    const nextProfType = nextProps.type;

    if (this.areCoordinatesEqual(origin, nextOrigin) && this.areCoordinatesEqual(dest, nextDest) && this.areProfileTypeEqual(profType,nextProfType)) {
      return;
    }

    if (nextOrigin && nextDest && nextProfType) {
      this.fetchDirections(nextOrigin, nextDest, nextProfType);
    }
  }

  areCoordinatesEqual (c1, c2) {
    if (!c1 || !c2) {
      return false;
    }
    const dLng = Math.abs(c1[0] - c2[0]);
    const dLat = Math.abs(c1[1] - c2[1]);
    return dLng <= 6e-6 && dLat <= 6e-6;
  }

  areProfileTypeEqual (p1, p2) {
    if (!p1 || !p2) {
      return false;
    }

    const compare = p1.localeCompare(p2);
    
    console.log('compare profiles :'+compare );

    if (compare == 0){
      return true;
    }
    else{
      return false;
    }

   
  }

  async fetchDirections (origin, dest, profType) {
    
        if (!origin || !dest || !this.state.mapboxClient) {
          return;
        }

       //start
        const originLatLng = {
          latitude: origin[1],
          longitude: origin[0],
        };

        const destLatLng = {
          latitude: dest[1],
          longitude: dest[0],
        };

        const requestOptions = {
          profile: profType,
          geometry: 'polyline',
          steps: true,
        };

        console.log('Directions - fetch directions :'+requestOptions.profile+' '+requestOptions.geometry);
        console.log('Directions - fetch directions :'+originLatLng.latitude+' '+originLatLng.longitude);
        console.log('Directions - fetch directions :'+destLatLng.latitude+' '+destLatLng.longitude);
        
        
        let res = null;
        
      try {
          res = await this.state.mapboxClient.getDirections([
            originLatLng,
            destLatLng,
          ], requestOptions);
          
        } catch (e) {
          console.log(e); // eslint-disable-line
        }

   
    if (res == null) {
      return;
    }

    //console.log(res.routes)
    if (!(res.entity.routes)) { 
      this.props.onDirectionsFetched(null, null, null,false );
      return;
    }

    const directions = res.entity.routes[0];
    const steps = directions.legs[0].steps;
    let instructions = [];
    steps.forEach(step => {
      instructions.push(step.maneuver.instruction);
    });

    console.log(instructions);

    // Calculate Distance between source and destination
    const distance = directions.distance;
    console.log('Distance: '+distance);

    // Calculate Time taken to travel from source to destination
    const duration = directions.duration;
    console.log('Duration: '+duration);

    const loading = false;
    if(this.props.onDirectionsFetched) {
      this.props.onDirectionsFetched(instructions, distance, duration,loading );
    }

    this.setState({ 
        directions: directions
        
    });

}

  render(){
      console.log('Directions -render');
      if (!this.state.directions) {
        return null;
      }
      
      return (
          <MapboxGL.ShapeSource id='mapbox-directions-source' shape={this.state.directions.geometry}>
            <MapboxGL.LineLayer
              id='mapbox-directions-line'
              belowLayerID={Places.UnselectedSymbolID}
              style={[styles.directionsLine, this.props.style]} />
          </MapboxGL.ShapeSource>
      );
  }
}

export default Directions;
