import LottieView from 'lottie-react-native';
import loadingAnimation from '../assets/loading.json';

export default function Loading(){
    return(
        <LottieView
            source={loadingAnimation}
            autoPlay
            loop
            style={{ width: 300, height: 400, flex: 1 }}
        />
    );
}