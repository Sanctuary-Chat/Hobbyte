import React, { Component } from 'react';
import {styles} from '../../styles/styles'
import {View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, ScrollView,Keyboard } from 'react-native';
import {Auth} from 'aws-amplify';

/*=====================================================*/
/*            Reset Screen                              */
/*=====================================================*/
export default class PasswordResetScreen extends React.Component {


  state = {
    username: ''
  };

  render() {
    return (
      <View style={{backgroundColor: "#19b7bf", flex: 1}}>
         <ScrollView keyboardShouldPersistTaps='never'>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <Image
            style={styles.logo}	            style={styles.logo}
            source={require('../../assets/images/white_logo_notext.png')}	 
            />
        <Text style={styles.title}>Reset Password</Text>

        <TextInput
                placeholder="Username"
                style={styles.formBox}
                placeholderTextColor = "#FFFFFF"
                returnKeyType = "next"
                autoFocus={true}
                onSubmitEditing = {() => {this.phoneInput.focus();}}
                keyboardType="email-address"
                autoCapitalize='none'
                autoCorrect={false}
                value={this.state.email}
                onChange ={event => this.setState({username:event.nativeEvent.text})}
                underlineColorAndroid = "transparent"
            />


        <TouchableOpacity style={styles.ButtonContainer}
        activeOpacity = { .8 }
        onPress={this._submitAsync}>
                <Text style={styles.buttonText}
                  >SUBMIT</Text>
        </TouchableOpacity>


        </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }

  /*--------------------Async------------------------*/
    _submitAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("currentUserInfo", await Auth.currentUserInfo())
      Auth.forgotPassword(this.state.username).then(
        ()=> {
          console.log("init password reset.. going to PRF")
          this.props.navigation.navigate('PRF', {authType: "password_reset", username: this.state.username})
        }
     ).catch(
       (err)=>{
         console.log("PRS ERROR: ", err)
         this.props.navigation.navigate('PRR')
       }
     )
    };
}


