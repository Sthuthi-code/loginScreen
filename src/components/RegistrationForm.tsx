/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useContext, useState } from 'react';
// import type {PropsWithChildren} from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, Button, View, Alert } from 'react-native';
import { getFontFamily } from '../utils/fontFamily';
import { addUser, createUser } from '../services/apiRequest';
import { AuthContext } from '../store/auth-context';
import OTPScreen from '../screens/OtpScreen';
import { Checkbox } from 'react-native-paper';
import { Menu, Provider } from 'react-native-paper';

function RegisterForm(): React.JSX.Element {

  const authCtx = useContext(AuthContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [selectedCode, setSelectedCode] = React.useState('');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const phoneCodes = [
    { label: '+1', value: 'US' },
    { label: '+44', value: 'UK' },
    { label: '+91', value: 'IN' },
    { label: '+61', value: 'AU' },
  ];

  const handleSelect = (code) => {
    setSelectedCode(code.label);
    closeMenu();
  };

    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
    });
    const [otpScreen, setOtpScreen] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '']);
    const [errorMessage, setErrorMessage] = useState('');
    const [signinErrorMessage, setSigninErrorMessage] = useState('');

    const handleTextChange = (field: string, value: string) =>{
      setSigninErrorMessage('');
      setUserDetails((prevUserDetails) => ({
        ...prevUserDetails,
        [field]: value,
      }));
    };

    const handleRegister = () => {
        setOtpScreen(true);
    };

    const handleSubmitOtp = async () => {
      if (otp.join('') === '9999') {
        try{
          setErrorMessage('');
          const token = await createUser(userDetails.email, userDetails.password);
          const body = {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            phoneNumber: userDetails.phoneNumber,
            email: userDetails.email,
          };
          const response = await addUser(body);
          console.log(response);
          authCtx.authenticate(token, userDetails.email);
        }catch(error){
          setSigninErrorMessage('Could not create user, please check your input and try again later.')
          // Alert.alert(
          //   'Authentication failed',
          //   'Could not create user, please check your input and try again later.'
          // );
        }
      }else{
        setErrorMessage('Invalid OTP. Please try again.');
        setOtp(['', '', '', '']);
      }
    };

  return (
    otpScreen ? <OTPScreen handleSubmitOtp={handleSubmitOtp} otp={otp}
      setOtp={setOtp} errorMessage={errorMessage} />
    :
    <>
        {/* <Text style={styles.title}>Register</Text> */}
        <Text style={styles.text}>First Name</Text>
        <TextInput
            id="firstName"
            label="First Name"
            mode="outlined"
            style={styles.input}
            value={userDetails.firstName}
            onChangeText={(value) => handleTextChange('firstName', value)}
        />
        <Text style={styles.text}>Last Name</Text>
        <TextInput
            id="lastName"
            label="Last Name"
            mode="outlined"
            style={styles.input}
            value={userDetails.lastName}
            onChangeText={(value) => handleTextChange('lastName', value)}
        />
        <Text style={styles.text}>Phone Number</Text>
        {/* <Provider>
          <View style={styles.dropdownContainer}>
          <View style={{ width: 150, alignSelf: 'center' }}>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <Button mode="outlined" title={selectedCode || 'Select Code'} onPress={openMenu}>
                </Button>
              }
            >
              {phoneCodes.map((code) => (
                <Menu.Item
                  key={code.value}
                  onPress={() => handleSelect(code)}
                  title={code.label}
                />
              ))}
            </Menu>
            </View>
          </View>
        </Provider> */}
        <TextInput
            id="phoneNumber"
            label="Phone Number"
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            value={userDetails.phoneNumber}
            onChangeText={(value) => handleTextChange('phoneNumber', value)}
        />
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
            mode="outlined"
            secureTextEntry={!passwordVisible}
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

        {signinErrorMessage ? <Text style={styles.errorText}>{signinErrorMessage}</Text> : null}

        <Button mode="contained"
          disabled={!(userDetails.firstName && userDetails.lastName && userDetails.phoneNumber && userDetails.email)}
          style={styles.registerButton} title="Register"
          onPress={handleRegister} />

        {/* <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity> */}
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
  registerButton: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#6200ea',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
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
  errorText: {
    color: 'red', // 🔹 Error text color
    marginTop: 10,
    fontSize: 14,
  },
  dropdownContainer: {
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default RegisterForm;
