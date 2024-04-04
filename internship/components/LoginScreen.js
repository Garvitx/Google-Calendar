import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image,Alert  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // This line gets the navigation object


  const handleRegisterPress = () => {
    navigation.navigate('RegisterScreen');
  };
  const handleForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post('https://jellyfish-app-84eu8.ondigitalocean.app/api/users/login', {
        email,
        password,
      });

      if (response.data.success) {
        // User logged in successfully, navigate to the LoginSuccessScreen
        navigation.navigate('LoginSuccessScreen');
      } else {
        // Invalid credentials, show an error message
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  };
  GoogleSignin.configure({
    webClientId: '647970317624-gmlj548nfk6hoahb8cepisa6tvdb3p78.apps.googleusercontent.com',

    // You can add other configuration options as needed
  });
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken, user } = userInfo;

      // Send the idToken and user email to your backend for verification and user lookup
      const response = await axios.post('https://jellyfish-app-84eu8.ondigitalocean.app/api/users/google-signin', {
        idToken,
        email: user.email,
      });

      if (response.data.exists) {
        // User exists, navigate to the LoginSuccessScreen
        navigation.navigate('LoginSuccessScreen');
      } else {
        // User doesn't exist, redirect to the RegisterScreen
        Alert.alert(
          'Account Not Found',
          'Your Google account is not registered. Please sign up first.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('RegisterScreen', { email: user.email }),
            },
          ],
        );
      }
    } catch (error) {
      console.error(error);
      // Handle the error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login to your account.</Text>
      <Text style={styles.subheader}>Please sign in to your account</Text>

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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.orSignInWith}>Or sign in with</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Image source={require('../assets/google.png')} style={styles.googleIcon} />
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <Text style={styles.dontHaveAccount}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleRegisterPress}>
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subheader: {
    fontSize: 24,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 18,
  },
  forgotPassword: {
    textAlign: 'right',
    color: 'orange',
    fontSize: 18,
  },
  signInButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orSignInWith: {
    paddingHorizontal: 10,
    fontSize: 18,
    color: '#666',
  },
  googleButton: {
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleIcon: {
    width: 30,
    height: 30,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dontHaveAccount: {
    fontSize: 18,
    color: '#666',
    marginRight: 5,
  },
  registerLink: {
    fontSize: 18,
    color: '#ff9800',
    fontWeight: 'bold',
  },
});

export default LoginScreen;