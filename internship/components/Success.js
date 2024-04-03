import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const LoginSuccessScreen = () => {

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      // Add any other user data keys that need to be cleared

      // Navigate back to the login screen
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/1.png')} style={styles.image} />
      <View style={styles.successContainer}>
      <View style={styles.grayRectangle} />

        <Image source={require('../assets/login.jpeg')} style={styles.loginImage} />
        <Text style={styles.successText}>Login Successful</Text>
        <Text style={styles.messageText}>
          An event has been created and the invite has been sent to you on mail.
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    position: 'absolute',
    left: -100,
    width: '180%',
    height: '100%',
    resizeMode: 'contain',
  },
  successContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 40, // Increase the vertical padding
    paddingHorizontal: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    height: '55%', // Set a specific height for the successContainer
  },
  loginImage: {
    width: 200, // Adjust the width of the login image
    height: 200, // Adjust the height of the login image
    alignSelf: 'center', // Center the login image horizontally
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'orange',
    paddingVertical: 15,
    borderRadius: 25,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  grayRectangle: {
    height: 5, // Adjust the height as needed
    backgroundColor: 'gray', // Set the background color to gray
    width: '20%', // Set the width to a percentage of the container
    alignSelf: 'center', // Center the rectangle horizontally
    marginBottom: 20,
    marginTop: -25 // Add some spacing below the rectangle
  },
});

export default LoginSuccessScreen;