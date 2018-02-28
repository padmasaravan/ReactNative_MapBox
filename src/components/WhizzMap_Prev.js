import React, {Component} from 'react';
import  MapboxGL   from '@mapbox/react-native-mapbox-gl'; 
import {Text, View, StyleSheet, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import ShowMap from './ShowMap';

import LocationInput from './LocationInput';
import Annotation from './Annotation';
import Directions from './Directions';
import Instructions from './Instructions';

import  Constants from './../../util.js';

MapboxGL.setAccessToken(Constants.mapboxAccessToken);


const INITIAL_SRC_LAT = 20.5937;
const INITIAL_SRC_LNG = 78.9629;
const INITIAL_DEST_LAT = 13.0827;
const INITIAL_DEST_LNG = 80.2707;

export default class WhizzMap extends Component {

    constructor(props) {
    
        super(props);
      
        this.state =  {
            src: null,
            dest: null,
            profile: 'driving-traffic',
            srcLatLng: {
                 lat: INITIAL_SRC_LAT, lng: INITIAL_SRC_LNG
            },
            destLatLng: {
                 lat: INITIAL_DEST_LAT, lng: INITIAL_DEST_LNG
            },
            isFirst: true,
            instructions: [],
            isInstFetched: false,
            distance: null,
            duration: null,

        };

        this.updateInputs = this.updateInputs.bind(this);
        this.loadInstructions = this.loadInstructions.bind(this);
        this.displayInstructions = this.displayInstructions.bind(this);
        this.convertDist = this.convertDist.bind(this);
        this.convertTime = this.convertTime.bind(this);
       
    }
  
    async updateInputs(src, dest, pro){

        console.log('update locations : '+ src +' '+dest);
        const sLower = src.toLowerCase();
        const dLower = dest.toLowerCase();
       
        let srcCoord = null;
        let destCoord = null;

        srcCoord =  await this.getCoordinates(sLower);
        destCoord = await this.getCoordinates(dLower);

        if (!srcCoord && !destCoord){

            srcCoord = {  'lat':38.9098, 'lng': -77.0295 };
            destCoord = {  'lat':38.907, 'lng': -77.031 };
        
        }

        console.log('update locations latlang '+ srcCoord.lat+' '+srcCoord.lng +' '+destCoord.lat+' '+destCoord.lng);
        this.setState({
            srcLatLng: {
                lat: srcCoord.lat, lng: srcCoord.lng
            },
            destLatLng: {
                lat: destCoord.lat, lng: destCoord.lng
            },
            profile: pro,
            isFirst: false,
            src: sLower,
            dest: dLower
        });
       
    }
    
    async getCoordinates(name){
        
        /*
        // Code to get coordinates by making API call to endpoint

        const reqCoordURL = 'https://app.'+Constants.clusterName+'.hasura-app.io/geocoding'
        console.log(reqCoordURL);
       
        const reqParamPlace = { place: name };
       
        let resCoord = null;

        try{
            resCoord = await axios.post(reqCoordURL,reqParamPlace);
            //console.log( await res);
         }catch (e) {
             console.log(e); // eslint-disable-line
         }
 
         console.log(resCoord);
        */
        // code to get coordinates from mapbox server 
        const req = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+name+'.json?access_token='+Constants.mapboxAccessToken;
        
        console.log(req);

        let coord = null;
        let res = null;
        
         // axios.get
        try{
           res = await axios.get(req);
           console.log( await res);
        }catch (e) {
            console.log(e); // eslint-disable-line
        }

        if (res == null) {
            return;
        }
        
        
        const place = res.data;
        const latLng= place.features[0].geometry.coordinates;
 
        coord = { 'lat': latLng[1], 'lng':latLng[0] };

        return (coord);
    }

    loadInstructions(instrc, dist, durn){
        const convDist = this.convertDist(dist);
        const convDurn = this.convertTime(durn);

        console.log('ConvDist : '+convDist);
        console.log('convDurn : '+convDurn);

        this.setState({
            instructions: instrc,
            isInstFetched: true,
            distance: convDist,
            duration: convDurn
        });
        
    }

    displayInstructions(){
        console.log('Display instructions : '+ this.state.isInstFetched);
        console.log('Display instructions : '+ this.state.instructions);
        console.log('Display instructions : '+ this.state.distance);
        console.log('Display instructions : '+ this.state.duration);
        if (this.state.isInstFetched && this.state.distance && this.state.duration) {
             return ( 
                <Instructions  instructions={this.state.instructions}  
                                dist={this.state.distance.toString()} 
                                durn={this.state.duration.toString()} />
            );
        } else {
             return null;
        }

    }

    convertDist(dist){
        console.log(dist);
        
        let distKm = dist / 1000;
        distKm = distKm.toFixed(1);
        const newDistance = distKm > 0 ? distKm + ( distKm == 1?' km ':' kms '): '';
        return newDistance;

    }

    convertTime(durn){
        console.log(durn);
        const days = Math.floor(durn/86400); // 24*60*60
        const hours = Math.floor( (durn % 86400) / 3600); // 60*60
        const mins = Math.floor( (durn % 86400) % 60);
        
        const daysStr = days > 0 ? days + ( days == 1?' day, ':' days, '): '';
        const hoursStr = hours > 0 ? hours + ( hours == 1?' hr, ':' hrs, '): '';
        const minsStr = mins > 0 ? mins + ( mins == 1?' min ':' mins '): '';

        return (daysStr + hoursStr + minsStr);
    }

    render () {
        //const {} = this.state;
        let sLat = parseFloat(this.state.srcLatLng.lat);
        let sLng = parseFloat(this.state.srcLatLng.lng);
        let dLat = parseFloat(this.state.destLatLng.lat);
        let dLng = parseFloat(this.state.destLatLng.lng);
        console.log('sLat '+sLat);
        console.log('sLng '+sLng);
        console.log('dLat '+dLat);
        console.log('dLng '+dLng);
        console.log('isFirst : '+this.state.isFirst);
        
        return (
            <View style={{ flex: 1}}>
                    <LocationInput updateInputs={(src,dest,pro) => this.updateInputs(src, dest,pro)}  /> 
                    <ShowMap src={[sLng,sLat]} dest={[dLng,dLat]} 
                                srcName={this.state.src} destName={this.state.dest} 
                                first={this.state.isFirst} proType={this.state.profile}
                                onInstructionsFetched={(instrc, dist, durn) => this.loadInstructions(instrc, dist, durn)}
                    />
                    { this.displayInstructions() }
                   
            </View>   
        );  
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: null,
  }
});

