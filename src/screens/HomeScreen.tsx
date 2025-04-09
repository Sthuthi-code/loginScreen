import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext } from 'react';
import { Image, StyleSheet } from 'react-native';
import ProfileScreen from './ProfileScreen';
import HomeTab from './HomeTab';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from '../store/theme-context';
import ListUsers from './ListUsers';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from './ChatScreen';

const Tab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();

const ChatStackScreen = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="ListUsers"
        component={ListUsers}
        options={{ title: 'Users' }}
      />
      <ChatStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={({ route }) => ({ title: route.params.user.name })}
      />
    </ChatStack.Navigator>
  );
};

function WelcomeScreen(): React.JSX.Element {

  const { theme } = useContext(ThemeContext);

  const colorTheme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          if (route.name === 'Home') {
            return <Icon name="home" size={30} color={theme == 'light' ? 'black' : 'white'} />;
          } else if (route.name === 'Chat') {
            return <Icon name="chat" size={30} color={theme == 'light' ? 'black' : 'white'} />;
          } else if (route.name === 'Profile') {
            return <Icon name="person" size={30} color={theme == 'light' ? 'black' : 'white'} />;
          }
        },
        tabBarActiveTintColor: theme === 'light' ? '#6200ea' : '#fff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle:{ backgroundColor: colorTheme.background },
        headerShown: false, // Hide header bar
      })}
    >
      <Tab.Screen name="Home" component={HomeTab} />
      <Tab.Screen name="Chat" component={ChatStackScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 2,
    borderTopColor: '#ddd',
    height: 60,
    paddingBottom: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
