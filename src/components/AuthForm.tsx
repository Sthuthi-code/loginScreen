import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoginForm from './LoginForm';
import { getFontFamily } from '../utils/fontFamily';
import RegisterForm from './RegistrationForm';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

export default function AuthForm({ isLogin }: { isLogin: boolean }){

    const navigation = useNavigation();

    function switchAuthModeHandler() {
        if (isLogin) {
          navigation.replace('Register');
        } else {
          navigation.replace('Login');
        }
    }

    return(
        <ScrollView style={styles.container}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            {isLogin ? (
                <LoginForm />
            ) : (
                <RegisterForm />
            )}
            <TouchableOpacity
                onPress={switchAuthModeHandler}
            >
              <Text style={styles.navigateText}>
                  {isLogin ? 'Create a new user' : 'Log in instead'}
              </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
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
  },
  loginButton: {
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
  navigateText: {
    fontSize: 16,
    color: '#007BFF',
    alignSelf: 'center',
    marginTop: 20,
  },
});
