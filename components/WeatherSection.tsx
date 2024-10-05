import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WeatherData {
  date: string;
  temp: string;
  condition: string;
  icon: string;
}

interface WeatherSectionProps {
  weatherData: WeatherData[];
  isLoading: boolean;
  error: string | null;
}

const WeatherSection: React.FC<WeatherSectionProps> = ({ weatherData, isLoading, error }) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {weatherData.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.date}>{day.date}</Text>
            <Ionicons name={day.icon as keyof typeof Ionicons.glyphMap} size={40} color="gray" />
            <Text style={styles.temp}>{day.temp}</Text>
            <Text style={styles.condition}>{day.condition}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    minHeight: 170,
    justifyContent: 'center',
  },
  dayContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 80,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  temp: {
    fontSize: 14,
    marginTop: 5,
  },
  condition: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default WeatherSection;