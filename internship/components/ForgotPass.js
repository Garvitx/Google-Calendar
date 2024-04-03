import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleForgotPassword = async () => {
    try {
      // Send a request to your backend to initiate the password reset process
      const response = await axios.post('http://10.9.20.246:3000/api/users/forgot-password', {
        email,
      });
  
      if (response.data.success) {
        // Password reset email sent successfully
        Alert.alert('Success', 'Please check your email for instructions to reset your password.');
        navigation.navigate('OTPVerificationScreen', { email });
      } else {
        // Error occurred
        Alert.alert('Error', 'Failed to send password reset email. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Forgot Password?</Text>
      <Text style={styles.subheader}>
        Enter your email address and we'll send you a confirmation code to reset your password.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:20,
    color: '#333',
  },
  subheader: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  forgotPasswordButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  forgotPasswordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;