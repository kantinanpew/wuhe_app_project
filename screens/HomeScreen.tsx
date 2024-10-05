import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, fetchWeatherStart, fetchWeatherSuccess, fetchWeatherFailure } from '../redux/store';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import HomeHero from '../components/HomeHero';
import WeatherSection from '../components/WeatherSection';
import FarmMap from '../components/FarmMap';

const API_KEY = '1dfdbce83d8a64bd5cff74a68cd11421'; // Replace this with API key
const CITY = 'Hualien City';
const COUNTRY_CODE = 'TW';
const STORAGE_KEY = '@weather_data';

const HomeScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { weatherData, isLoading, error } = useSelector((state: RootState) => state.home);
  const [lastFetchDate, setLastFetchDate] = useState<string | null>(null);

  const fetchWeatherData = async (forceUpdate = false) => {
    dispatch(fetchWeatherStart());

    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      const storedLastFetchDate = await AsyncStorage.getItem('@last_fetch_date');

      const currentDate = new Date().toDateString();
      
      if (!forceUpdate && storedData && storedLastFetchDate === currentDate) {
        // Use stored data if it's from today
        dispatch(fetchWeatherSuccess(JSON.parse(storedData)));
        setLastFetchDate(storedLastFetchDate);
        return;
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&units=metric&appid=${API_KEY}`
      );

      const processedData = response.data.list
        .filter((_: any, index: number) => index % 8 === 0) // Get data for every 24 hours
        .slice(0, 6) // Get data for 6 days
        .map((item: any) => ({
          date: new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
          temp: `${Math.round(item.main.temp_min)}°- ${Math.round(item.main.temp_max)}°`,
          condition: item.weather[0].description,
          icon: mapWeatherToIcon(item.weather[0].main),
        }));

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(processedData));
      await AsyncStorage.setItem('@last_fetch_date', currentDate);

      dispatch(fetchWeatherSuccess(processedData));
      setLastFetchDate(currentDate);
    } catch (error: any) {
      console.error('Error fetching weather data:', error);
      dispatch(fetchWeatherFailure('Failed to fetch weather data. Please try again later.'));
      Alert.alert('Error', 'Failed to fetch weather data. Please check your internet connection and try again.');
    }
  };

  const mapWeatherToIcon = (weather: string): string => {
    switch (weather) {
      case 'Clear':
        return 'sunny';
      case 'Clouds':
        return 'cloudy';
      case 'Rain':
      case 'Drizzle':
        return 'rainy';
      case 'Thunderstorm':
        return 'thunderstorm';
      case 'Snow':
        return 'snow';
      default:
        return 'partly-sunny';
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <SafeAreaWrapper>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => fetchWeatherData(true)} />
        }
      >
        <HomeHero />
        <WeatherSection weatherData={weatherData} isLoading={isLoading} error={error} />
        <FarmMap />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;