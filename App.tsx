import React, { useContext, useEffect, useState } from 'react';
import SplashScreen from './src/screens/SplashScreen';
import AuthContextProvider, { AuthContext } from './src/store/auth-context';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WelcomeScreen from './src/screens/HomeScreen';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { ThemeContext, ThemeProvider } from './src/store/theme-context';
import { Alert ,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import { useNavigationContainerRef } from '@react-navigation/native';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

const notificationListener = (navigation) => {
  // When the app is in background and user taps the notification
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background state:', remoteMessage.notification);

    navigation.navigate('Profile');
  });

  // When the app is opened from a quit state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);

        navigation.navigate('Profile');
      }
    });
};


const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#c30b64' },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: '#ffff' },
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
function AuthenticatedStack() {

  const authCtx = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#c30b64' },
        headerTintColor: 'white',
        // contentStyle: { backgroundColor: '#ffff' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{
        headerRight: () => (
          <TouchableOpacity onPress={() => authCtx.logout()}>
            <Icon name="logout" size={24} color="black" />
          </TouchableOpacity>
        ),
      }} />
    </Stack.Navigator>
  );
}

const linking = {
  prefixes: ['loginscreen://', 'https://loginscreen.com'], // <-- your URL schemes
  config: {
    screens: {
      Home: 'home',
      Chat: 'chat',
      Profile: 'profile',
    },
  },
};

function Navigation({navigationRef}) {
  const authCtx = useContext(AuthContext);
  const themeCtx = useContext(ThemeContext);

  const theme = {
    ...(themeCtx.theme === 'dark' ? MD3DarkTheme : MD3LightTheme),
    background: themeCtx.theme === 'dark' ? '#1e1e1e' : '#ffff',
    text : themeCtx.theme === 'dark' ? '#ffff' : 'black',
  };

  return (
    <PaperProvider theme={theme} >
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <NavigationContainer linking={linking} ref={navigationRef} >
          {authCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}



function App(): React.JSX.Element {

  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const navigationRef = useNavigationContainerRef();

  const getToken = async ()=>{
    const fcmToken = await messaging().getToken();
    console.log(fcmToken);
  };

  useEffect(()=>{
    setTimeout(() => {
      setIsSplashScreen(false);
    }, 3000);
    notificationListener(navigationRef);
    getToken();
  },[]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContextProvider>
      <ThemeProvider>
          {isSplashScreen ? (
            <SplashScreen />
          ) :
          <Navigation navigationRef={navigationRef} /> }
      </ThemeProvider>
    </AuthContextProvider>
  );
}

export default App;
