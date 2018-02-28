// b4 adding Native base components

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
    value: 'Cycling',
  }, {
    value: 'Walking',
  }];

let profile = 'driving';


class LocationInput extends Component{
    constructor(props){
        super(props);
        this.state = {
            
            source: null,
            destination: null,
            profile: null
        }
        this.updateInputs = this.updateInputs.bind(this);
        this.clearInputs = this.clearInputs.bind(this);
        
    }
    
    updateInputs(){ //Update the state & route
     
        profile = this.refs.proDDown.value();
        source = this.state.source;
        destination = this.state.destination;
        
        console.log('loc  '+source+'  '+destination);
        if (!source || !destination) // Source or Destination field is null
        {
            return;
        }
        if (source && destination){
            Keyboard.dismiss();
            this.setState({ profile: profile})
            
            this.props.updateInputs(source, destination, profile);
        }   
     }

     clearInputs(){ // Clear Input & Routes

        Keyboard.dismiss();

        this.refs.sText.clear();
        this.refs.dText.clear();
        profile = null;
        source = null;
        destination = null;
        this.setState({
            source: source,
            destination: destination,
            profile: profile
        });
        
        this.props.updateInputs(source, destination,profile);
     }

     
    render(){
        const { textLabel, textboxStyle, buttonStyle, 
                    dDownButtonContainerStyle, dDownStyle,buttonTxt,
                    clrButtonStyle,clrButtonTxt,
                } = styles; // Deconstruction
                
        return(
            <Card>
                <CardSection >
                    <Text style={textLabel}>From</Text>
                    <TextInput 
                        ref="sText"
                        style= {textboxStyle}
                        placeholder='Starting Place'
                        placeholderTextColor = "#939393"
                        autoCapitalize = "none"
                        underlineColorAndroid = 'transparent'
                        onChangeText={text => this.setState({source: text})}
                        value={this.state.source}
                        />
                    
                </CardSection>
                <CardSection>
                    <Text style={textLabel}>To</Text>
                    <TextInput 
                        ref="dText"
                        style= {textboxStyle}
                        placeholder='Destination Place'
                        placeholderTextColor = "#939393"
                        autoCapitalize = "none"
                        underlineColorAndroid = 'transparent'
                        onChangeText={text => this.setState({destination: text})}
                        value={this.state.destination}
                        />
                    
                    
                </CardSection>
                <View style={dDownButtonContainerStyle}>
                    <View style={dDownStyle}>
                        <Dropdown 
                            ref="proDDown"
                            data={pData}
                            label='Select'
                            value= 'Driving'
                            textColor='black'
                            itemColor='black'
                            labelHeight= {20}
                            labelFontSize= {16}
                            dropdownPosition= {1}
                            selectedItemColor='black'
                            transparent={false}
                            onChangeText={this.updateInputs}
                            baseColor="black"
                            
                            />
                    </View>
                    <View  style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={this.updateInputs} style={buttonStyle}>
                                <Text style={buttonTxt}>Let's Go</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.clearInputs} style={clrButtonStyle}>
                                <Text style={clrButtonTxt}>Clear</Text>
                            </TouchableOpacity>
                    </View>
                </View>
        </Card>
        );
    }
}

export default LocationInput;

const styles = StyleSheet.create({
    textLabel: {
        fontSize: 16,
        fontFamily: 'Times New Roman',
        color: 'black',
        fontWeight: '500',
        width: 100,
        textAlign: 'left',
        
    },
    textboxStyle: {
        width: 200,
        height: 37,
        marginLeft : 15,
        fontSize: 16,
        fontFamily: 'Times New Roman',
        backgroundColor: 'white',
        borderWidth: 1,
        paddingLeft: 15,
        
    },
    buttonStyle: {
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: 'black',
        width :100,
        height: 30,
       
    },
    buttonTxt: {
        fontSize: 16,
        fontFamily: 'Times New Roman',
        textAlign: 'center',
        color: 'black',
        fontWeight: '500',
    },
    clrButtonStyle: {
        borderWidth: 1,
        backgroundColor: 'white',
        borderColor: '#FA2E0E',
        width :100,
        height: 30
    },
    clrButtonTxt: {
        fontSize: 16,
        fontFamily: 'Times New Roman',
        textAlign: 'center',
        color: '#FA2E0E',
        fontWeight: '500',
    },
    dDownButtonContainerStyle: {
        margin: 1,
        flexDirection: 'row',
        //justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E4F5FC',
    },
    dDownStyle: {
        flex: 1
        }
 });


