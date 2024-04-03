import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OTPVerificationScreen = ({ route }) => {
  const [otp, setOTP] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const { email } = route.params || {};
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          setResendEnabled(true);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const otpRefs = [
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ];
  
  const handleOTPChange = (index, value) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
  
    if (value !== '') {
      if (index < otpRefs.length - 1) {
        otpRefs[index + 1].current.focus();
      }
    }
  };

  const handleOTPVerification = async () => {
    const enteredOTP = otp.join('');
  
    // Send the OTP code and the email to your backend for verification
    const response = await fetch('http://10.9.20.246:3000/api/users/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp: enteredOTP, email }),
    });
  
    const data = await response.json();
    if (data.success) {
      // OTP verification successful
      console.log('OTP verification successful');
  
      // Make an API call to generate the reset token
      const resetTokenResponse = await fetch('http://10.9.20.246:3000/api/users/generate-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const resetTokenData = await resetTokenResponse.json();
      if (resetTokenData.success) {
        const resetToken = resetTokenData.token;
        // Navigate to the ResetPasswordScreen and pass the token
        navigation.navigate('ResetPasswordScreen', { token: resetToken });
      } else {
        console.log('Failed to generate reset token');
      }
    } else {
      // OTP verification failed, display an error message
      console.log('OTP verification failed');
      alert('Invalid OTP. Please try again.'); // Display an error message to the user
    }
  };

  const handleResendCode = async () => {
    setResendEnabled(false);
    setTimer(60);
    setOTP(['', '', '', '']);

    try {
      const response = await fetch('http://10.9.20.246:3000/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Email verification</Text>
      <Text style={styles.subheader}>
        Enter the verification code sent to:{'\n'}
        {email ? email.replace(/(.{3})(.*)(?=@)/, '$1****$2') : 'your email'}
      </Text>

      <View style={styles.otpContainer}>
  {otp.map((value, index) => (
    <TextInput
      key={index}
      ref={otpRefs[index]}
      style={styles.otpInput}
      value={value}
      onChangeText={(text) => handleOTPChange(index, text)}
      keyboardType="numeric"
      maxLength={1}
    />
  ))}
</View>

      <Text style={styles.resendText}>
        Didn't receive code?{' '}
        <Text style={resendEnabled ? styles.resendLinkEnabled : styles.resendLinkDisabled} onPress={resendEnabled ? handleResendCode : null}>
          Resend
        </Text>
      </Text>

      <TouchableOpacity style={styles.continueButton} onPress={handleOTPVerification}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#333',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 50,
    marginHorizontal: 5,
  },
  resendText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  resendLinkEnabled: {
    color: '#ff9800',
    textDecorationLine: 'underline',
  },
  resendLinkDisabled: {
    color: '#ccc',
  },
  continueButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OTPVerificationScreen;

