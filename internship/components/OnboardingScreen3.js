import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Pagination from './Pagination';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { Circle } from 'react-native-svg';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);



const OnboardingScreen3 = ({ currentIndex, totalScreens }) => {
  const [strokeAnimation] = React.useState(new Animated.Value(0));
  const navigation = useNavigation(); // This line gets the navigation object


  const handleArrowPress = () => {
    Animated.timing(strokeAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const handleArrowRelease = () => {
    strokeAnimation.stopAnimation(() => {
      strokeAnimation.setValue(0);
      navigation.navigate('LoginScreen');
    });
  };

  const strokeInterpolation = strokeAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const strokeAnimationStyle = {
    strokeDasharray: 100,
    strokeDashoffset: strokeInterpolation,
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/3.png')} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title}>We serve incomparable delicacies</Text>
        <Text style={styles.description}>
          All the best restaurants with their top menu waiting for you, they can't wait for your order!
        </Text>
        <Pagination currentIndex={currentIndex} totalScreens={totalScreens} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onLongPress={handleArrowPress}
            onPressOut={handleArrowRelease}
            style={styles.arrowButton}
          >
            <View style={styles.circleContainer}>
              <Svg width={100} height={100}>
                <Circle
                  cx={50}
                  cy={50}
                  r={40}
                  stroke="white"
                  strokeWidth={2}
                  fill="none"
                />
                <AnimatedCircle
                  cx={50}
                  cy={50}
                  r={40}
                  stroke="white"
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray={strokeAnimationStyle.strokeDasharray}
                  strokeDashoffset={strokeAnimationStyle.strokeDashoffset}
                />
              </Svg>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    position: 'absolute',
    left: -100,
    width: '180%',
    height: '100%',
    resizeMode: 'contain',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  arrowButton: {
    backgroundColor: 'transparent',
    
    
  },
  arrowText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',


  },
  circleContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    backgroundColor: 'transparent',
  },
  arrowText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
  },

});

export default OnboardingScreen3;