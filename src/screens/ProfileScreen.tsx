import { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
// import { Text } from 'react-native-gesture-handler';
import { getUser } from '../services/apiRequest';
import Loading from '../components/Loading';
import { Switch, Text, useTheme } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../store/theme-context';
import { AuthContext } from '../store/auth-context';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {

    const { theme, toggleTheme, toggleLanguage, language } = useContext(ThemeContext);
    const { email } = useContext(AuthContext);

    const { t } = useTranslation();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
    });
    const [loading, setLoading] = useState(true);
    const colorTheme = useTheme();

    const getUsers = async()=>{
        const response = await getUser();
        const profile = response.filter((user: Object) => user.email === email);
        setUser(profile[0]);
        setLoading(false);
    };

    useEffect(()=>{
        getUsers();
    },[]);

    return (
        loading ? <Loading /> :
        <View style={{ backgroundColor: colorTheme.background, flex: 1, padding: 20 }}>
            <Text style={styles.text}>{t('profile')}</Text>
            <View style={styles.imageContainer}>
                <Image source={{ uri: 'https://t3.ftcdn.net/jpg/02/36/99/22/360_F_236992283_sNOxCVQeFLd5pdqaKGh8DRGMZy7P4XKm.jpg' }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.label}>{t('first_name')}: <Text style={styles.value}>{user.firstName}</Text></Text>
            <Text style={styles.label}>{t('last_name')}: <Text style={styles.value}>{user.lastName}</Text></Text>
            <Text style={styles.label}>{t('phone_number')}: <Text style={styles.value}>{user.phoneNumber}</Text></Text>
            <Text style={styles.label}>{t('email')}: <Text style={styles.value}>{user.email}</Text></Text>

            {/* Toggle switches at the bottom */}
            <View style={styles.toggleContainer}>
                <View style={styles.toggleItem}>
                    <Text style={styles.toggleText}>{t('dark_mode')}</Text>
                    <Switch onValueChange={toggleTheme} value={theme === 'dark'} color={'#FFD700'} />
                </View>
                <View style={styles.toggleItem}>
                    <Text style={styles.toggleText}>{t('hindi')}</Text>
                    <Switch value={language === 'hi'} onValueChange={toggleLanguage} color={'#FFD700'} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    value: {
        fontSize: 18,
        fontWeight: 'normal',
    },
    text: {
        fontSize: 23,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    image: {
        width: 150,
        height: 150,
    },
    toggleContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleText: {
        fontSize: 18,
        marginRight: 10,
    },
});
