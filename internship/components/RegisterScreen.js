import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';


const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTOS, setAgreeTOS] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [agreeTOSError, setAgreeTOSError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLoginChange = () => {
    navigation.navigate('LoginScreen');
  };


  GoogleSignin.configure({
    webClientId: '647970317624-gmlj548nfk6hoahb8cepisa6tvdb3p78.apps.googleusercontent.com',

    // You can add other configuration options as needed
  });
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);

      // Send the user info to your backend server
      const response = await axios.post('https://jellyfish-app-84eu8.ondigitalocean.app/api/users/google-signin', {
        idToken: userInfo.idToken,
        email: userInfo.user.email,
        name: userInfo.user.name,
        // Include any other relevant user data
      });

      // Handle the response from the server
      console.log(response.data.message);

      // Navigate to the LoginSuccessScreen
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error(error);
    }
  };



  const handleRegistration = async () => {

    setEmailError('');
    setUsernameError('');
    setPasswordError('');
    setAgreeTOSError('');
    setRegistrationError('');

    // Perform validation
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    if (!username) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }
    if (!agreeTOS) {
      Alert.alert('Error', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    try {
      // Make a POST request to the server's registration endpoint
      const response = await axios.post('https://jellyfish-app-84eu8.ondigitalocean.app/api/users/register', {
        email,
        username,
        password,
      });

      // Handle the response from the server
      console.log(response.data.message);
      navigation.navigate('LoginScreen');

      // You can also navigate to a different screen or show a success message

    } catch (error) {
      console.error(error);
      if (error.response) {
        if (error.response.status === 400) {
          // Check if the status code is 400 (Bad Request)
          Alert.alert('Error', 'The email address is already registered');
        } else {
          // Handle other error status codes
          Alert.alert('Error', 'An error occurred during registration');
        }
      } else {
        // Handle other errors (e.g., network error)
        Alert.alert('Error', 'An error occurred during registration');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create your new account</Text>
      <Text style={styles.subheader}>Create an account to start looking for the food you like</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Albertstevano@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Alber tstevano"
          value={username}
          onChangeText={setUsername}
        />
        {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
  <Text style={styles.label}>Password</Text>
  <View style={styles.passwordContainer}>
    <TextInput
      style={styles.passwordInput}
      placeholder="**********"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={!showPassword}
    />
    <TouchableOpacity
      style={styles.eyeIcon}
      onPress={() => setShowPassword(!showPassword)}
    >
      <Image
        source={showPassword ? require('../assets/eyes-open.png') : require('../assets/eyes-closed.jpeg')}
        style={styles.eyeIconImage}
      />
    </TouchableOpacity>
  </View>
  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
</View>


      <View style={styles.checkboxContainer}>
        <BouncyCheckbox
          isChecked={agreeTOS}
          onPress={() => setAgreeTOS(!agreeTOS)}
          size={25}
          fillColor="#ff9800"
          unfillColor="#FFFFFF"
          text="I Agree with "
          iconStyle={{ borderColor: '#ff9800' }}
          textStyle={{ fontFamily: 'JosefinSans-Regular', fontSize: 16 }}
        />
        <Text style={styles.tosLinkContainer}>
          <Text style={styles.tosLink}>Terms of Service</Text>
          <Text style={styles.andText}> and </Text>
          <Text style={styles.tosLink}>Privacy Policy</Text>
        </Text>
        {agreeTOSError ? <Text style={styles.errorText}>{agreeTOSError}</Text> : null}

      </View>
      {registrationError ? <Text style={styles.errorText}>{registrationError}</Text> : null}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegistration}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.orSignInWith}>Or sign in with</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleButton} onPress={signIn}>
        <Image source={require('../assets/google.png')} style={styles.googleIcon} />
      </TouchableOpacity>



      <TouchableOpacity onPress={handleLoginChange}>
        <Text style={styles.signInLink}>Have an account? Sign In</Text>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  eyeIcon: {
    padding: 10,
  },
  eyeIconImage: {
    width: 24,
    height: 24,
  },
  header: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subheader: {
    fontSize: 19,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 30, // Increased marginBottom for larger input containers
  },
  label: {
    fontSize: 18, // Increased font size
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50, // Increased height
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6, // Increased border radius
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#666',
  },
  tosLinkContainer: {
    flexDirection: 'row',
  },
  tosLink: {
    color: '#ff9800',
    textDecorationLine: 'underline',
  },
  andText: {
    color: 'black',
  },
  registerButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 16, // Increased height
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20, // Increased font size
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
  signInLink: {
    fontSize: 16,
    color: '#ff9800',
    textAlign: 'center',
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
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default RegisterScreen;

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAxoz_lJdI4IYUeQhxCtY8K9GkkF4FtX4s",
//   authDomain: "internship-10640.firebaseapp.com",
//   projectId: "internship-10640",
//   storageBucket: "internship-10640.appspot.com",
//   messagingSenderId: "973216418218",
//   appId: "1:973216418218:web:6f67dcb9d8f2fd9af243d3",
//   measurementId: "G-NNE58S8DNT"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);