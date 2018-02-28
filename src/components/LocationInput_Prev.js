import React, { Component } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Keyboard, TouchableOpacity  } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import Card from './Card';
import CardSection from './CardSection';

const source = null;
const destination = null;
const pData = [{
    value: 'Driving',
  }, {
    value: 'Walking',
  }, {
    value: 'Cycling',
  }];

let profile = 'driving-traffic';


class LocationInput extends Component{
    constructor(props){
        super(props);

        this.updateLocations = this.updateLocations.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }
       
    updateLocations(){
         
         
        source = this.refs.sText._lastNativeText;
        destination = this.refs.dText._lastNativeText;
        if (source && destination){
            Keyboard.dismiss();
        }
        profile = this.refs.proDDown.value();
        let tProfile = profile.toLowerCase();
        if (tProfile.includes("driving")){
            tProfile = tProfile+'-traffic';
        }
         
         this.props.updateLocations(source, destination, tProfile);
     }

     updateProfile(){
              
         profile = this.refs.proDDown.value();
         console.log('profile '+profile);
         this.props.updateProfile(profile);
     }
     
    render(){
        const { textLabel, textboxStyle, buttonStyle, dDownButtonContainerStyle, dDownStyle,buttonTxt} = styles;

        return(
            <Card>
                <CardSection >
                    <Text style={textLabel}>Source</Text>
                    <TextInput 
                        ref="sText"
                        style= {textboxStyle}
                        placeholderTextColor = "black"
                        autoCapitalize = "none"
                        underlineColorAndroid = 'transparent'
                        />
                    
                </CardSection>
                <CardSection>
                    <Text style={textLabel}>Destination</Text>
                    <TextInput 
                        ref="dText"
                        style= {textboxStyle}
                        placeholderTextColor = "black"
                        autoCapitalize = "none"
                        underlineColorAndroid = 'transparent'
                        />
                    
                    
                </CardSection>
                <View style={dDownButtonContainerStyle}>
                    <View style={dDownStyle}>
                        <Dropdown 
                            ref="proDDown"
                            data={pData}
                            label='Profile'
                            value= 'Driving'
                            labelHeight= {20}
                            labelFontSize= {16}
                            dropdownPosition= {1}
                            onChangeText={this.updateProfile}
                            />
                    </View>
                    <View>
                            <TouchableOpacity onPress={this.updateLocations} style={buttonStyle}>
                                <Text style={buttonTxt}>Show Route</Text>
                            </TouchableOpacity>
                    </View>
                </View>
        </Card>
        );
    }
}

export default LocationInput;

const styles = StyleSheet.create({
   
    input: {
       margin: 5,
       height: 35,
       borderColor: '#7a42f4',
       borderWidth: 1,
       flexDirection: 'row',
       justifyContent: 'center',
       alignItems: 'center',
       
    },
    textLabel: {
        fontSize: 16,
        fontFamily: 'Times New Roman',
        
    },
    textboxStyle: {
        width: 200,
        height: 40,
        marginLeft : 15,
        fontSize: 16,
        fontFamily: 'Times New Roman',
        
    },
    buttonStyle: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'black',
        width :200,
        height: 30
    },
    buttonTxt: {
        fontSize: 16,
        fontFamily: 'Times New Roman',
        textAlign: 'center',
    },
    dDownButtonContainerStyle: {
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#E4F5FC',
    },
    dDownStyle: {
        flex : 1,
        }
 })