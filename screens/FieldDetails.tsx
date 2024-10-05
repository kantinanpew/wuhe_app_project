import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from 'react-native-maps';
import { MaterialIcons, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const { height, width } = Dimensions.get('window');

const FieldDetails = ({ route }) => {
  const { fieldId, fieldCoordinates } = route.params;
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [mapType, setMapType] = useState('satellite');
  const navigation = useNavigation();

  if (!fieldCoordinates) {
    return (
      <SafeAreaWrapper>
        <View style={styles.container}>
          <Text>Field coordinates not available</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  const initialRegion = {
    latitude: fieldCoordinates[0].latitude,
    longitude: fieldCoordinates[0].longitude,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0221,
  };

  const toggleMapType = () => {
    setMapType((prevType) => (prevType === 'satellite' ? 'standard' : 'satellite'));
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName, { fieldId });
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        {!isFullScreen && (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Field {fieldId} Details</Text>
          </View>
        )}
        <View style={isFullScreen ? styles.fullScreenMapContainer : styles.mapContainer}>
          <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            style={isFullScreen ? styles.fullScreenMap : styles.map}
            mapType={mapType}
            initialRegion={initialRegion}
          >
            <Polygon
              coordinates={fieldCoordinates}
              fillColor="rgba(100, 200, 200, 0.5)"
              strokeColor="rgba(100, 200, 200, 1)"
              strokeWidth={2}
            />
            {fieldCoordinates.map((coord, index) => (
              <Marker
                key={index}
                coordinate={coord}
                title={`Field ${fieldId}`}
              />
            ))}
          </MapView>
          <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullScreen}>
            <MaterialIcons name={isFullScreen ? "fullscreen-exit" : "fullscreen"} size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.modeButton} onPress={toggleMapType}>
            <Text style={styles.modeButtonText}>
              {mapType === 'satellite' ? 'Switch to Default' : 'Switch to Satellite'}
            </Text>
          </TouchableOpacity>
        </View>
        {!isFullScreen && (
          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('LandPreparation')}>
              <MaterialCommunityIcons name="tractor" size={24} color="#3498db" />
              <Text style={styles.buttonText}>Land Preparation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Nursery')}>
              <FontAwesome5 name="seedling" size={24} color="#2ecc71" />
              <Text style={styles.buttonText}>Nursery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Plantation')}>
              <FontAwesome5 name="tree" size={24} color="#27ae60" />
              <Text style={styles.buttonText}>Plantation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Maintenance')}>
              <Feather name="scissors" size={24} color="#9b59b6" />
              <Text style={styles.buttonText}>Maintenance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('Harvesting')}>
              <FontAwesome5 name="leaf" size={24} color="#f1c40f" />
              <Text style={styles.buttonText}>Harvesting</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mapContainer: {
    height: height * 0.25,
  },
  fullScreenMapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  map: {
    flex: 1,
  },
  fullScreenMap: {
    width: width,
    height: height,
  },
  fullscreenButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    zIndex: 2,
  },
  bottomButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '45%',
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
  modeButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -75 }],
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default FieldDetails;