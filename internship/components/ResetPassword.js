import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library



const ResetPasswordScreen = ({ route }) => {
    
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = route.params || {};
  const navigation = useNavigation();

if (!token) {
  // Token is missing, handle the error or navigate back
  console.log('Token is missing');
  return;
}

  const handleResetPassword = async () => {
    // Perform password validation
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Send the new password and token to your backend for updating
      const response = await fetch('http://10.9.20.246:3000/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Password reset successful
        console.log('Password reset successful');
        navigation.navigate('PasswordResetSuccess')
        // Navigate to the login screen or perform the desired action
      } else {
        // Password reset failed
        console.log('Password reset failed:', data.error);
        // Display an error message to the user
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
           <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-left" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.header}>Reset Password</Text>
      <Text style={styles.subheader}>
        Your new password must be different from the previously used password
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <Text style={styles.passwordRequirement}>Must be at least 8 characters</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Text style={styles.passwordRequirement}>Both passwords must match</Text>
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={handleResetPassword}>
        <Text style={styles.verifyButtonText}>Verify Account</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  passwordRequirement: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  verifyButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
});

export default ResetPasswordScreen;