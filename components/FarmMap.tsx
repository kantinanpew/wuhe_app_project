import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FarmMap: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Map' as never)}
    >
      <View style={styles.header}>
        <Ionicons name="location" size={24} color="red" />
        <Text style={styles.title}>農場地圖</Text>
      </View>
      <Image
        source={require('../assets/images/farm-map.jpg')}
        style={styles.mapImage}
      />
      <Text style={styles.viewMore}>點擊查看更多...</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mapImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  viewMore: {
    padding: 10,
    textAlign: 'right',
    color: 'gray',
  },
});

export default FarmMap;