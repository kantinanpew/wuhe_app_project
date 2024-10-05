import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import HeroSlider from '../components/HeroSlider';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const Maintenance = ({ route }) => {
  const { fieldId } = route.params;
  const navigation = useNavigation();

  const maintenanceImages = [
    require('../assets/images/weeding.jpg'),
    require('../assets/images/pruning.jpg'),
    require('../assets/images/tea_pest.jpg'),
  ];

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { fieldId });
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Field {fieldId} Maintenance</Text>
        </View>
        <View style={styles.sliderContainer}>
          <HeroSlider images={maintenanceImages} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Weeding')}>
            <FontAwesome5 name="hand-paper" size={24} color="#3498db" />
            <Text style={styles.buttonText}>Weeding</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Pruning')}>
            <Feather name="scissors" size={24} color="#2ecc71" />
            <Text style={styles.buttonText}>Pruning</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('PestsAndDiseases')}>
            <FontAwesome5 name="bug" size={24} color="#e74c3c" />
            <Text style={styles.buttonText}>Pests & Diseases Control</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  sliderContainer: {
    width: '100%',
    height: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '48%',
    aspectRatio: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});

export default Maintenance;