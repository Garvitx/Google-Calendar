import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Pagination from './Pagination';
import OnboardingScreen2 from './OnboardingScreen2';
import OnboardingScreen3 from './OnboardingScreen3';


const OnboardingScreen = () => {
  
  const totalScreens = 3;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextClick = () => {
    if (currentIndex < totalScreens - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };// Replace with the actual current screen index

  

  return currentIndex === 0 ? (
    <View style={styles.container}>
      <Image source={require('../assets/1.png')} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>We serve incomparable delicacies</Text>
        <Text style={styles.description}>
          All the best restaurants with their top menu waiting for you, they can't wait for your order!
        </Text>
        <Pagination currentIndex={currentIndex} totalScreens={totalScreens} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNextClick}>
            <Text style={styles.nextButtonText}>Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : currentIndex === 1 ? (
    <OnboardingScreen2
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      totalScreens={totalScreens}
    />
  ) : currentIndex === 2 ? (
    <OnboardingScreen3 
    currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      totalScreens={totalScreens}/>
  ) : (
    // Render any additional logic or components if needed
    <View />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    position: 'absolute',
    left: -100,
    width: '180%',
    height: '110%',
    resizeMode: 'contain',
    transform: [{ scaleX: -1 }],
  },
  overlay: {
    position: 'absolute',
    bottom: 110,
    left: 50,
    right: 50,
    backgroundColor: 'orange',
    borderRadius: 30,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 18,
    color: 'white',
  },
  nextButton: {
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  nextButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;