import React, { Component } from 'react';

import { Button, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, TextInput, Image, Keyboard, ScrollView, AsyncStorage } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import {styles} from '../../styles/styles'
/*=====================================================*/
/*            Phone Verification Screen                */
/*=====================================================*/
export default class PhoneNumberVerification extends React.Component {


  state = {

    verificationCode: '',
    username: this.props.navigation.getParam('username','none'),
    // authType: this.props.navigation.getParam('authType', 'none'),
    user: this.props.navigation.getParam('user', 'none'),
  };



  render() {
    return (
      <View style={{backgroundColor: "#19b7bf", flex: 1}}>
          <KeyboardAvoidingView behavior="height" style={styles.container}>
          <ScrollView keyboardShouldPersistTaps='never'>

          <Image
            style={styles.logo}
            source={require('../../assets/images/white_logo_notext.png')}
            />
          <Text style={styles.header}>Enter Verification Code</Text>
          <TextInput
            placeholder="Code"
            style={styles.formBox}
            placeholderTextColor = "#000000"
            returnKeyType = "go"
            keyboardType="phone-pad"
            autoFocus={true}
            onSubmitEditing = {this._loginAsync}
            autoCapitalize='none'
            autoCorrect={false}
            value={this.state.verificationCode}
            onChange ={event => this.setState({verificationCode:event.nativeEvent.text})}
            underlineColorAndroid = "transparent"
          />


        <TouchableOpacity style={styles.ButtonContainer}
        onPress={this._loginAsync}
        activeOpacity = { .8 }>
                <Text style={styles.buttonText}
                  >Submit</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.resetContainer}>
                <Text
                  onPress={this._resetAsync}>Changed phone number?</Text>
        </TouchableOpacity>

          </ScrollView>


      </KeyboardAvoidingView>
      </View>
    );
  }

  /*--------------------Async------------------------*/
    _loginAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Login information input from user: ");
      console.log("code:" + this.state.verificationCode);
      console.log("Passed form login: ", this.state.username)
      console.log("Varification type: ", this.state.authType)

      if(this.props.navigation.getParam('authType', 'none') == 'signup') {
        console.log("------------This is signup-----------------")
        Auth.confirmSignUp(this.state.username, this.state.verificationCode)
        .then(() => {
            console.log('successful confirm sign up!')
            AsyncStorage.setItem("userToken",JSON.stringify(Auth))
            this.props.navigation.navigate('Home', Auth.user);
          })
        .catch(err => {console.log('error confirming signing up!: ', err);
                alert('error confirming signing up!: '+ err.message);});
      } else if(this.props.navigation.getParam('authType', 'none') == 'signin') {
        console.log("------------This is signin-----------------")
        // remove from final version
        // if (this.state.verificationCode==1111){
        //   console.log('Debug code entered - redirecting to main');
        //   this.props.navigation.navigate('Main', Auth.user);
        // }


        // need to comment back in when texting works in AWS
        Auth.confirmSignIn(this.state.user, this.state.verificationCode)
        .then(() => {
          console.log('successful confirm sign in!');
          AsyncStorage.setItem("userToken",JSON.stringify(Auth))
          this.props.navigation.navigate('Main' );
        })
        .catch(err => {console.log('error confirming signing in!: ', err);
                alert('error confirming signing in!: '+err.message);});
      } else if(this.props.navigation.getParam('authType', 'none') == 'email_verification') {

        console.log("------------This is email_verification-----------------")
        console.log("In email verification")
        Auth.verifyCurrentUserAttributeSubmit('email',this.state.verificationCode).then(
            ()=>{
              console.log("email verification success! ")
              this.props.navigation.navigate('Main')
            }
        ).catch((err)=>{
            console.log("email verification error: ", err)
        })
      } else if(this.state.authType == 'password_reset') {

      }
    };

    _resetAsync = async () => {
      // TODO - fetch user token and verify user identity
      // await AsyncStorage.setItem('userToken', 'abc'); // comment back in when storage set up
      console.log("Redirecting to phone reset page");
      this.props.navigation.navigate('PhoneReset');
    };
}
