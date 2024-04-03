import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';


const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTOS, setAgreeTOS] = useState(false);
  const navigation = useNavigation(); 

  
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
      const response = await axios.post('http://10.9.20.246:3000/api/users/google-signin', {
        idToken: userInfo.idToken,
        email: userInfo.user.email,
        name: userInfo.user.name,
        // Include any other relevant user data
      });
  
      // Handle the response from the server
      console.log(response.data.message);
  
      // Navigate to the LoginSuccessScreen
      navigation.navigate('LoginSuccessScreen');
    } catch (error) {
      console.error(error);
    }
  };
  

 
  const handleRegistration = async () => {
    try {
      // Make a POST request to the server's registration endpoint
      const response = await axios.post('http://10.9.20.246:3000/api/users/register', {
        email,
        username,
        password,
      });
  
      // Handle the response from the server
      console.log(response.data.message);
      // You can also navigate to a different screen or show a success message
  
    } catch (error) {
      console.error(error);
      // Handle the error
      // You can show an error message to the user
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
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Alber tstevano"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="**********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
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
      </View>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegistration}>
  <Text style={styles.registerButtonText}>Register</Text>
</TouchableOpacity>

      <View style={styles.divider} />
      <TouchableOpacity style={styles.googleButton} onPress={signIn}>
  <Image source={require('../assets/google.png')} style={styles.googleIcon} />
</TouchableOpacity>


      <TouchableOpacity>
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
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 20,
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