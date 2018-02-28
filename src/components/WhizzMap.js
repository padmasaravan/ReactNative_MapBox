import React, {Component} from 'react';
import  MapboxGL   from '@mapbox/react-native-mapbox-gl'; 
import {Text, View, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import axios from 'axios';
import ShowMap from './ShowMap';

import LocationInput from './LocationInput';
import Annotation from './Annotation';
import Directions from './Directions';
import Instructions from './Instructions';
import Spinner from './Spinner';

import  Constants from './../../util.js';

MapboxGL.setAccessToken(Constants.mapboxAccessToken);



export default class WhizzMap extends Component {

    constructor(props) {
    
        super(props);
      
        this.state =  {
            src: null,
            dest: null,
            profile: 'driving-traffic',
            srcLatLng: {
                 lat: Constants.INITIAL_SRC_LAT, lng: Constants.INITIAL_SRC_LNG
            },
            destLatLng: {
                 lat: Constants.INITIAL_DEST_LAT, lng: Constants.INITIAL_DEST_LNG
            },
            isFirst: true,
            instructions: [],
            isInstFetched: false,
            distance: null,
            duration: null,
            loading: false,

        };

        this.updateInputs = this.updateInputs.bind(this);
        this.loadInstructions = this.loadInstructions.bind(this);
        this.displayInstructions = this.displayInstructions.bind(this);
        this.convertDist = this.convertDist.bind(this);
        this.convertTime = this.convertTime.bind(this);
       
    }
  
    async updateInputs(src, dest, pro){

        console.log('update locations : '+ src +' '+dest);

        if(!src && !dest && !pro){ //Null value to clear all the state and route
            // Change all the state values to default values
            this.setState({
                srcLatLng: {
                    lat: Constants.INITIAL_SRC_LAT, lng: Constants.INITIAL_SRC_LNG
            },
            destLatLng: {
                    lat: Constants.INITIAL_DEST_LAT, lng: Constants.INITIAL_DEST_LNG
            },
                isFirst: true,
                src: null,
                dest: null,
                directions: null,
                instructions: [],
                isInstFetched: false,
                distance: null,
                duration: null,
                loading: false,
                profile: null,
            });
            
            return; 
        }

        const sLower = src.toLowerCase();
        const dLower = dest.toLowerCase();
        const tProfile = pro.toLowerCase();

       
        let srcCoord = null;
        let destCoord = null;

        //set state loading - true

        this.setState( {
            loading:true,
            directiions: null
        })


        // check error in location
        srcCoord =  await this.getCoordinates(sLower);
        destCoord = await this.getCoordinates(dLower);
        
        if (!srcCoord || !destCoord){ // Error in location
            
            if (!srcCoord){
                errLoc = 'Starting Place';
            }else{
                errLoc = 'Destination';
            }

            Alert.alert('Location Error',errLoc+' not found  !!!');
            console.log('no location');
            
            // Change all the state values to default values
            this.setState({
                srcLatLng: {
                    lat: Constants.INITIAL_SRC_LAT, lng: Constants.INITIAL_SRC_LNG
               },
               destLatLng: {
                    lat: Constants.INITIAL_DEST_LAT, lng: Constants.INITIAL_DEST_LNG
               },
                isFirst: true,
                src: null,
                dest: null,
                directions: null,
                instructions: [],
                isInstFetched: false,
                distance: null,
                duration: null,
                loading: false,
                
            });
            
            return;
        }

        console.log('update locations latlang '+ srcCoord.lat+' '+srcCoord.lng +' '+destCoord.lat+' '+destCoord.lng);
        this.setState({
            srcLatLng: {
                lat: srcCoord.lat, lng: srcCoord.lng
            },
            destLatLng: {
                lat: destCoord.lat, lng: destCoord.lng
            },
            profile: tProfile,
            isFirst: false,
            src: sLower,
            dest: dLower,
            
        });
       
    }
    
    async getCoordinates(name){
        
        // code to get coordinates by making API calls to mapbox endpoint

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

        if (!place.features.length){ // check whether the coordinates are returned for the Place
            console.log('features : '+place.features);
            return ;
        }

        const latLng= place.features[0].geometry.coordinates;
 
        coord = { 'lat': latLng[1], 'lng':latLng[0] };

        return (coord);
    }

    loadInstructions(instrc, dist, durn,loading){

        if(!instrc){
            Alert.alert('No Route Error','No route found for the given Inputs !!!');
            console.log('no route');

            // Change all the state values to default values
            this.setState({
                srcLatLng: {
                    lat: Constants.INITIAL_SRC_LAT, lng: Constants.INITIAL_SRC_LNG
               },
               destLatLng: {
                    lat: Constants.INITIAL_DEST_LAT, lng: Constants.INITIAL_DEST_LNG
               },
                isFirst: true,
                src: null,
                dest: null,
                directions: null,
                instructions: [],
                isInstFetched: false,
                distance: null,
                duration: null,
                loading: false,
                
            });
       
       
         return;
        }
        const convDist = this.convertDist(dist);
        const convDurn = this.convertTime(durn);

        console.log('ConvDist : '+convDist);
        console.log('convDurn : '+convDurn);

        this.setState({
            instructions: instrc,
            isInstFetched: true,
            distance: convDist,
            duration: convDurn,
            loading: false
        });
        
    }

    displayInstructions(){

        console.log('Display instructions : '+ this.state.isInstFetched);
        console.log('Display instructions : '+ this.state.instructions);
        console.log('Display instructions : '+ this.state.distance);
        console.log('Display instructions : '+ this.state.duration);
        if (this.state.loading){
            return <Spinner/>
        }
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

