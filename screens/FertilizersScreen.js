// FertilizersScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const FertilizersScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/fertilizers.png')} style={styles.image} />
      <View style={styles.formContainer}>
        <Text>Fertilizers Form</Text>
        {/* Add your form components here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    padding: 20,
  },
});

export default FertilizersScreen;