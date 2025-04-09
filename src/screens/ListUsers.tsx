import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from '../store/theme-context';
import Loading from '../components/Loading';
import { getUser } from '../services/apiRequest';
import { AuthContext } from '../store/auth-context';

const ListUsers = () => {
    const navigation = useNavigation();
    const { theme } = useContext(ThemeContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { email } = useContext(AuthContext);

    const getUsers = async()=>{
        const response = await getUser();
        const users = response.filter((user: Object) => user.email !== email);
        setUsers(users);
        setLoading(false);
    };

    useEffect(()=>{
        getUsers();
    },[]);

  const handleUserPress = (user) => {
    navigation.navigate('ChatScreen', { user });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.userItem, theme === 'light' ? styles.lightCard : styles.darkCard]} onPress={() => handleUserPress(item)}>
      <View style={styles.avatarContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme === 'light' ? '#eee' : '#333' }]}>
            <Icon name="person" size={28} color={theme === 'light' ? '#555' : '#ccc'} />
          </View>
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme === 'light' ? '#222' : '#eee' }]}>{item.firstName} {item.lastName}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={theme === 'light' ? '#888' : '#aaa'} />
    </TouchableOpacity>
  );

  return (
    loading ? <Loading /> : <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#000' }]}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
};

export default ListUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
  },
  lightCard: {
    backgroundColor: '#fafafa',
  },
  darkCard: {
    backgroundColor: '#1a1a1a',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
});
