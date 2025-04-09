import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const OTPScreen = ({handleSubmitOtp, otp, setOtp, errorMessage}:
    {handleSubmitOtp:()=>void, otp: String[], setOtp: ()=>void, errorMessage : String}) => {
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '']);
    setTimer(30);
    setIsResendDisabled(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>We have sent OTP to your number</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(value) => handleOtpChange(index, value)}
          />
        ))}
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Text style={styles.timerText}>
        {isResendDisabled ? `Resend OTP in ${timer}s` : ''}
      </Text>

      <TouchableOpacity
        onPress={handleResendOtp}
        disabled={isResendDisabled}
      >
        <Text style={[styles.resendText, isResendDisabled && styles.disabledText]}>
          Resend OTP
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmitOtp}
      >
        <Text style={styles.resendText}>
          Submit OTP
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#E5E7EB',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#000',
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  timerText: {
    marginTop: 15,
    fontSize: 14,
    color: 'gray',
  },
  resendText: {
    fontSize: 16,
    color: '#007BFF',
    marginTop: 10,
  },
  disabledText: {
    color: 'gray',
  },
  errorText: {
    color: 'red', // 🔹 Error text color
    marginTop: 10,
    fontSize: 14,
  },
});

export default OTPScreen;
