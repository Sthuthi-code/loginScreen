/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, Button, View, Alert } from 'react-native';
import { getFontFamily } from '../utils/fontFamily';
import { login } from '../services/apiRequest';
import { AuthContext } from '../store/auth-context';
import { getAuth, signInWithCredential, GoogleAuthProvider } from '@firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'react-native-paper';

function LoginForm(): React.JSX.Element {

  const authCtx = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);

    useEffect(()=>{
      GoogleSignin.configure({
        webClientId: '687933749770-7csgirk1l1blkfltag8sluartpjqi0f6.apps.googleusercontent.com',
        offlineAccess: true, // Required for Firebase Auth
      });
    },[]);

    const [userDetails, setUserDetails] = useState({
        email: '',
        password: '',
    });

    const handleTextChange = (field: string, value: string) =>{
      setUserDetails((prevUserDetails) => ({
        ...prevUserDetails,
        [field]: value,
      }));
    };

    const handleLogin = async() => {
      try{
        const response = await login(userDetails.email, userDetails.password);
        await AsyncStorage.setItem('token', response);
        authCtx.authenticate(response, userDetails.email);
      }catch(error){
        Alert.alert(
          'Authentication failed!',
          'Could not log you in. Please check your credentials or try again later!'
        );
      }
    };

    const handleGoogleLogin = async() => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo, 'kk');
        // const auth = getAuth();
        // const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
        // const userCredential = await signInWithCredential(auth, googleCredential);
        // const token = await userCredential.user?.getIdToken();
        // const userData = {
        //     token,
        //     displayName: userCredential.user?.displayName || '',
        //     email: userCredential.user?.email || '',
        //     photoURL: userCredential.user?.photoURL || '',
        // };
        // await AsyncStorage.setItem("userData", JSON.stringify(userData));
        // console.log(token, 'ggooo');
        // authCtx.authenticate(googleCredential.data.idToken);
        // authCtx.setUserData(userData.displayName, userData.email, userData.photoURL);

      } catch (error) {
          Alert.alert(
              'Authentication failed!',
              'Could not sign you up. Please check your input or try again later!'
          );
          console.error('error',error);
      }finally{
          // setIsAuthenticating(false);
      }
    };

    const handleBiometricAuth = async () => {
      try {
        const rnBiometrics = new ReactNativeBiometrics();
        const { success, error } = await rnBiometrics.simplePrompt({ promptMessage: 'Authenticate to continue' });
        if (success) {
          Alert.alert( 'Success', 'Biometric authentication successful');
          const token = await AsyncStorage.getItem('token');
          console.log(token, 'token');
          authCtx.authenticate(token, 'sthuthi@7edge.com');
          return true;
        } else {
          Alert.alert('Authentication failed', 'Biometric authentication failed');
          return false;
        }
      } catch (error) {
        console.error('[handleBiometricAuth] Error:', error);
        Alert.alert('Error', 'Biometric authentication failed from device');
        return false;
      }
    };


    const enableBiometricAuth = () => {
      const rnBiometrics = new ReactNativeBiometrics();

      rnBiometrics.isSensorAvailable()
        .then((resultObject) => {
          const { available, biometryType } = resultObject;

          if (available && biometryType === BiometryTypes.TouchID) {
            Alert.alert(
              'TouchID',
              'Would you like to enable TouchID authentication for the next time?',
              [
                {
                  text: 'Yes please',
                  onPress: () => {
                    Alert.alert('Success!', 'TouchID authentication enabled successfully!');
                  },
                },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          } else if (available && biometryType === BiometryTypes.FaceID) {
            Alert.alert(
              'FaceID',
              'Would you like to enable FaceID authentication for the next time?',
              [
                {
                  text: 'Yes please',
                  onPress: () => {
                    Alert.alert('Success!', 'FaceID authentication enabled successfully!');
                  },
                },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          } else if (available && biometryType === BiometryTypes.Biometrics) {
            Alert.alert('Device Supported Biometrics', 'Biometrics authentication is supported.');
          } else {
            Alert.alert('Biometrics not supported', 'This device does not support biometric authentication.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          Alert.alert('Error', 'An error occurred while checking biometrics availability.');
        });
    };

    useEffect(()=>{
      enableBiometricAuth();
    },[]);

  return (
    <>
        {/* <Text style={styles.title}>Login</Text> */}

        <Text style={styles.text}>Email Address</Text>
        <TextInput
            id="email"
            label="Email Address"
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
            value={userDetails.email}
            onChangeText={(value) => handleTextChange('email', value)}
        />

        <Text style={styles.text}>Password</Text>
        <TextInput
            id="password"
            label="Password"
            secureTextEntry={!passwordVisible}
            mode="outlined"
            style={styles.input}
            value={userDetails.password}
            onChangeText={(value) => handleTextChange('password', value)}
        />
        <View style={styles.checkbox}>
          <Checkbox
            status={passwordVisible ? 'checked' : 'unchecked'}
            onPress={() => {
              setPasswordVisible(!passwordVisible);
            }}
            color="#6200ee" // color when checked
          />
          <Text>Show Password</Text>
        </View>

        <Button mode="contained"
          disabled={!(userDetails.password && userDetails.email)}
          style={styles.loginButton} title="Login"
          onPress={handleLogin} />

        <TouchableOpacity style={styles.googleButton}
          onPress={handleGoogleLogin}>
          {/* <Image source={require("./assets/google-icon.png")} style={styles.googleIcon} /> */}
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>

        <Button mode="contained"
          style={styles.loginButton} title="Biometric Login"
          onPress={handleBiometricAuth} />
      </>
  );
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    fontFamily: getFontFamily(false, 'bold'),
  },
  text: {
    fontFamily: getFontFamily(true, 'normal'),
    textAlign: 'left',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    color: 'black',
  },
  loginButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#6200ea',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    color: '#000',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LoginForm;
