import React from 'react';
import { View, StyleSheet } from 'react-native';

const Pagination = ({ currentIndex, totalScreens }) => {
  const dots = [];

  for (let i = 0; i < totalScreens; i++) {
    const isActive = i === currentIndex;
    const dotStyle = isActive ? styles.activeDot : styles.inactiveDot;
    dots.push(<View key={i} style={[styles.dot, dotStyle]} />);
  }

  return <View style={styles.container}>{dots}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'gray',
  },
});

export default Pagination;