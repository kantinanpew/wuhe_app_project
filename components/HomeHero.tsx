import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const HomeHero = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/tea-farm.jpg')}
        style={styles.image}
      />
      <Text style={styles.overlayText}>天氣一覧</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomeHero;