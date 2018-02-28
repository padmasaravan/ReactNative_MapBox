import React, {Component}  from 'react';
import { View, Text, StyleSheet, Modal, ListView, TouchableOpacity } from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import PropTypes from 'prop-types';
import ActionSheetCustom from 'react-native-actionsheet/lib/ActionSheetCustom';



const title = <Text style={{color: '#000', fontSize: 18}}>Directions - Turn by Turn Navigation</Text>

class Instructions extends Component{

    static propTypes = {
                 
        /**
         * Instructions to navigate from source to destination
         */
        instructions: PropTypes.arrayOf(PropTypes.string),
        /**
         * Distance between source and destination
         */
        dist: PropTypes.string,
        /**
         * Time taken to travel from source to destination
         */
        durn: PropTypes.string
      };

    constructor(props){
        super(props);

        this.state = {
            instructions: []
        }

        this.showInstrActionSheet = this.showInstrActionSheet.bind(this);
    }

    showInstrActionSheet(){
        this.ActionSheet.show();
    }

    render(){
        const { instructions, dist, durn } = this.props;
        console.log('Instructions : '+this.props.instructions); 
        let        
        const instLen = instructions.length;
        return(
            <View >
                
                <TouchableOpacity onPress={this.showInstrActionSheet} style={{flexDirection: 'row'}}>
                        <Text>{durn}   ( {dist} )</Text>
                        <Text style={styles.buttonTextStyle}>Show Directions</Text>
                </TouchableOpacity>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={title}
                    options={instructions}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={instLen}
                />
            </View>
        );
    }
}

export default Instructions;

const styles = {
    buttonTextStyle: {
            //alignSelf: 'center',
            color: '#007aff',
            fontSize: 16,
            fontWeight: '600',
            paddingTop: 10,
            paddingBottom: 10,
            height: 40,
    },
    buttonStyle: {
        flex: 1,
        alignSelf: 'stretch',
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: '#007aff',
        marginLeft: 5,
        marginRight: 5
    }
};
