import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import HeroSlider from '../components/HeroSlider';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const LandPreparation = ({ route }) => {
  const { fieldId } = route.params;
  const navigation = useNavigation();

  const landPrepImages = [
    require('../assets/images/landpreparation.png'),
    require('../assets/images/landprep_2.jpg'),
  ];

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { fieldId });
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Land Preparation - Field {fieldId}</Text>
        </View>
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
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
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