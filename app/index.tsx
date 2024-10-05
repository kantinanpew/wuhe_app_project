import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../redux/store';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAdminEmails } from '../firebase';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Import your screen components here
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import FieldDetails from '../screens/FieldDetails';
import Maintenance from '../screens/Maintenance';
import Weeding from '../screens/Weeding';
import Pruning from '../screens/Pruning';
import PestsAndDiseases from '../screens/PestsAndDiseases';
import Plantation from '../screens/Plantation';
import LandPreparation from '../screens/LandPreparation';
import Fertilizers from '../screens/Fertilizers';
import SoilPH from '../screens/SoilPH';
import Nursery from '../screens/Nursery';
import Harvesting from '../screens/Harvesting';
import FarmProfileScreen from '../screens/FarmProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Fields" component={MapScreen} />
      <Stack.Screen name="FieldDetails" component={FieldDetails} />
      <Stack.Screen name="Maintenance" component={Maintenance} />
      <Stack.Screen name="Weeding" component={Weeding} />
      <Stack.Screen name="Pruning" component={Pruning} />
      <Stack.Screen name="PestsAndDiseases" component={PestsAndDiseases} />
      <Stack.Screen name="Plantation" component={Plantation} />
      <Stack.Screen name="LandPreparation" component={LandPreparation} />
      <Stack.Screen name="SoilPH" component={SoilPH} />
      <Stack.Screen name="Fertilizers" component={Fertilizers} />
      <Stack.Screen name="Harvesting" component={Harvesting} />
      <Stack.Screen name="Nursery" component={Nursery} />
    </Stack.Navigator>
  );
}

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName;
        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'Map') {
          iconName = 'map-outline';
        } else if (route.name === 'Dashboard') {
          iconName = 'bar-chart-outline';
        } else if (route.name === 'Settings') {
          iconName = 'settings-outline';
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[
              styles.tabItem,
              isFocused ? styles.tabItemFocused : null
            ]}
          >
            <Ionicons 
              name={iconName} 
              size={24} 
              color={isFocused ? '#7cb342' : 'white'} 
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Map" component={MapStack} />
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AuthenticatedStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="FarmProfile" component={FarmProfileScreen} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        // You might want to validate the token here
        if (token) {
          // If a valid token exists, you could set the user in your auth context
          // This step depends on how your AuthContext is set up
        }
      } catch (e) {
        console.error('Failed to fetch the auth token', e);
      } finally {
        setInitializing(false);
      }
    };

    checkToken();
  }, []);

  if (initializing || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7cb342" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={AuthenticatedStack} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    const initializeApp = async () => {
      // This is the email of the first admin user
      await initializeAdminEmails('a@gmail.com');
    };

    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <ReduxProvider store={store}>
        <AuthProvider>
          <NavigationContainer independent={true}>
            <SafeAreaView style={styles.container}>
              <RootNavigator />
            </SafeAreaView>
          </NavigationContainer>
        </AuthProvider>
      </ReduxProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#7cb342',
    height: 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
  },
  tabItemFocused: {
    backgroundColor: 'white',
  },
});

export default App;