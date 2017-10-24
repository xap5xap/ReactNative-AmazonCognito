/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'react-native-aws-cognito-js';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
  'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  userPool;
  username = 'user@company.com';
  password = 'Pa$$w0rd'

  componentDidMount() {
    console.log('component did mount')
    //1) Create User Pool
    this.userPool = new CognitoUserPool({
      UserPoolId: 'us-east-1_qIXIWe28m',
      ClientId: '5up7imaricrh14a2i0qmiu6dv9'
    })
  }

  createUserInAmazonCognito() {
    console.log('create user')

    //Fill required atributes
    const attributeList = [];
    const attributeGivenName = new CognitoUserAttribute({
      Name: 'given_name',
      Value: 'Smith'
    });

    attributeList.push(attributeGivenName);

    var cognitoUser;
    //Call SignUp function
    this.userPool.signUp(this.username, this.password, attributeList, null, (err, result) => {
      if (err) {
        console.log('Error at signup ', err);
        return;
      }
      cognitoUser = result.user;
      console.log('cognitoUser', cognitoUser)
    });

  }

  confirmCode() {
    const cognitoUser = new CognitoUser({
      Username: this.username,
      Pool: this.userPool
    });
    cognitoUser.confirmRegistration('091758', true, (err, result) => {
      if (err) {
        console.log('Error at confirmRegistration ', err);
        return;
      }
      console.log('result', result)
    });
  }

  signIn() {
    const authenticationDetails = new AuthenticationDetails({
      Username: this.username,
      Password: this.password
    });
    const cognitoUser = new CognitoUser({
      Username: this.username,
      Pool: this.userPool
    });
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('onSuccess', result)
        console.log('access token + ' + result.getAccessToken().getJwtToken());
      },

      onFailure: (err) => {
        console.log('onFailure', err)
      },
      mfaRequired: (codeDeliveryDetails) => {
        console.log('mfaRequired', codeDeliveryDetails)
      }
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <Button title="1) Create user in Amazon Cognito (Sign up)" onPress={this.createUserInAmazonCognito.bind(this)}>
        </Button>
        <Button title="2) Confirm Code" onPress={this.confirmCode.bind(this)}>
        </Button>
        <Button title="3) Sign in" onPress={this.signIn.bind(this)}>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
