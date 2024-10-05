import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon, Marker, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

export default function MapScreen() {
  const navigation = useNavigation();
  const [mapType, setMapType] = useState('satellite');

  const region = {
    latitude: 23.459118,
    longitude: 121.353896,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.0221,
  };

  // Coordinates for tea fields polygons
  const teaFields = [
    // Field A
    [
      { latitude: 23.471529, longitude: 121.358265 },
      { latitude: 23.471399, longitude: 121.358407 },
      { latitude: 23.470867, longitude: 121.358130 },
      { latitude: 23.470756, longitude: 121.358910 },
      { latitude: 23.471248, longitude: 121.358918 },
      { latitude: 23.472059, longitude: 121.359360 },
      { latitude: 23.472218, longitude: 121.358823 },
    ],
    // Field B
    [
      { latitude: 23.471425, longitude: 121.360343 },
      { latitude: 23.471104, longitude: 121.360131 },
      { latitude: 23.471292, longitude: 121.359132 },
      { latitude: 23.471650, longitude: 121.359306 },
    ],
    // Field C
    [
      { latitude: 23.472938, longitude: 121.359933 },
      { latitude: 23.471897, longitude: 121.359424 },
      { latitude: 23.471626, longitude: 121.360611 },
      { latitude: 23.472109, longitude: 121.360763 },
      { latitude: 23.472455, longitude: 121.360633 },
      { latitude: 23.472655, longitude: 121.360394 },
    ],
    // Field D
    [
      { latitude: 23.468553, longitude: 121.360637 },
      { latitude: 23.468046, longitude: 121.360507 },
      { latitude: 23.467503, longitude: 121.362399 },
      { latitude: 23.467307, longitude: 121.362338 },
      { latitude: 23.467169, longitude: 121.362757 },
      { latitude: 23.467600, longitude: 121.362903 },
      { latitude: 23.467738, longitude: 121.362401 },
      { latitude: 23.468014, longitude: 121.362465 },
    ],
    // Field E
    [
      { latitude: 23.452535, longitude: 121.353636 },
      { latitude: 23.452516, longitude: 121.353376 },
      { latitude: 23.453566, longitude: 121.353306 },
      { latitude: 23.453482, longitude: 121.353717 },
    ],
    // Field F
    [
      { latitude: 23.457253, longitude: 121.355027 },
      { latitude: 23.456796, longitude: 121.356513 },
      { latitude: 23.457304, longitude: 121.356590 },
      { latitude: 23.457399, longitude: 121.356341 },
      { latitude: 23.457653, longitude: 121.356444 },
      { latitude: 23.458274, longitude: 121.354564 },
      { latitude: 23.458014, longitude: 121.354460 },
      { latitude: 23.457583, longitude: 121.355815 },
      { latitude: 23.457310, longitude: 121.355711 },
      { latitude: 23.457532, longitude: 121.355172 },
    ],
    // Field G
    [
      { latitude: 23.459888, longitude: 121.345846 },
      { latitude: 23.459782, longitude: 121.345772 },
      { latitude: 23.459093, longitude: 121.346787 },
      { latitude: 23.459186, longitude: 121.346868 },
    ],
    // Field H
    [
      { latitude: 23.465422, longitude: 121.353625 },
      { latitude: 23.465220, longitude: 121.354314 },
      { latitude: 23.464428, longitude: 121.353800 },
      { latitude: 23.464630, longitude: 121.353175 },
    ],
    // Field I
    [
      { latitude: 23.463165, longitude: 121.355425 },
      { latitude: 23.462598, longitude: 121.355165 },
      { latitude: 23.461746, longitude: 121.357953 },
      { latitude: 23.462344, longitude: 121.358172 },
    ],
    // Field J
    [
      { latitude: 23.459563, longitude: 121.356855 },
      { latitude: 23.459344, longitude: 121.356766 },
      { latitude: 23.459054, longitude: 121.357730 },
      { latitude: 23.459237, longitude: 121.357803 },
    ],
    // Field K
    [
      { latitude: 23.459584, longitude: 121.355108 },
      { latitude: 23.459379, longitude: 121.355031 },
      { latitude: 23.458834, longitude: 121.356866 },
      { latitude: 23.459015, longitude: 121.356936 },
    ],
    // Field L
    [
      { latitude: 23.449886, longitude: 121.349158 },
      { latitude: 23.450253, longitude: 121.347538 },
      { latitude: 23.449673, longitude: 121.347993 },
      { latitude: 23.449500, longitude: 121.349102 },
    ],
    // Field M
    [
      { latitude: 23.466939, longitude: 121.362197 },
      { latitude: 23.466506, longitude: 121.363318 },
      { latitude: 23.466247, longitude: 121.363249 },
      { latitude: 23.466736, longitude: 121.362095 },
    ],
  ];

  const toggleMapType = () => {
    setMapType((prevType) => (prevType === 'satellite' ? 'standard' : 'satellite'));
  };

  const handlePress = (fieldId: number, fieldCoordinates: any[]) => {
    navigation.navigate('FieldDetails' as never, { fieldId, fieldCoordinates } as never);
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        region={region}
        mapType={mapType}
      >
        {teaFields.map((coords, index) => (
          <React.Fragment key={index}>
            <Polygon
              coordinates={coords}
              fillColor="rgba(100, 200, 200, 0.5)"
              strokeColor="rgba(100, 200, 200, 1)"
              strokeWidth={2}
              tappable={true}
              onPress={() => handlePress(index + 1, coords)}
            />
            <Marker
              coordinate={coords[0]}
              title={`Field ${index + 1}`}
              description={`This is Field ${index + 1}`}
              zIndex={1}
            >
              <Callout onPress={() => handlePress(index + 1, coords)}>
                <View>
                  <Text style={styles.calloutText}>View Field {index + 1} Details</Text>
                </View>
              </Callout>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>
      <TouchableOpacity style={styles.button} onPress={toggleMapType}>
        <Text style={styles.buttonText}>
          {mapType === 'satellite' ? 'Switch to Default' : 'Switch to Satellite'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  calloutText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  button: {
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
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});