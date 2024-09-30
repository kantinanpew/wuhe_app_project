import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import HeroSlider from '../components/HeroSlider';

const LandPreparation = ({ route }) => {
  const { fieldId } = route.params;
  const navigation = useNavigation();

  const landPrepImages = [
    require('../assets/landpreparation.png'),
    require('../assets/landprep_2.jpg'),
  ];

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { fieldId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Land Preparation - Field {fieldId}</Text>
      <HeroSlider images={landPrepImages} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigateToScreen('SoilPH')}
        >
          <FontAwesome5 name="vial" size={24} color="#3498db" />
          <Text style={styles.buttonText}>Soil PH</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigateToScreen('Fertilizers')}
        >
          <FontAwesome5 name="leaf" size={24} color="#2ecc71" />
          <Text style={styles.buttonText}>Fertilizers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '40%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LandPreparation;
