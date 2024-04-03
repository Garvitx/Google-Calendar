import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const PasswordResetSuccess = () => {

  const navigation = useNavigation();

  const handleLogin = async () => {
    navigation.navigate('LoginScreen')
   
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/1.png')} style={styles.image} />
      <View style={styles.successContainer}>
      <View style={styles.grayRectangle} />

        <Image source={require('../assets/login.jpeg')} style={styles.loginImage} />
        <Text style={styles.successText}>Password Changed</Text>
        <Text style={styles.messageText}>
            Password changed successfully you can login again with a new password.
        </Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogin}>
          <Text style={styles.logoutButtonText}>Go To Login</Text>
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

export default PasswordResetSuccess;