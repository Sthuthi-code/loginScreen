import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';

function SplashScreen(): React.JSX.Element {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 1) {
                    clearInterval(interval);
                    return 1;
                }
                return oldProgress + 0.1;
            });
        }, 300); // Adjust speed as needed

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            <Progress.Bar progress={progress} width={300} color="#2b6480" />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150, 
    height: 150, 
    marginBottom: 20, 
  },
});

export default SplashScreen;
