import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import FieldDetails from './screens/FieldDetails';
import Maintenance from './screens/Maintenance';
import Weeding from './screens/Weeding';
import Pruning from './screens/Pruning';
import PestsAndDiseases from './screens/PestsAndDiseases';
import Plantation from './screens/Plantation';
import LandPreparation from './screens/LandPreparation';
import Fertilizers from './screens/Fertilizers';
import SoilPH from './screens/SoilPH';
import Nursery from './screens/Nursery';

import Harvesting from './screens/Harvesting';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MapStack() {
  return (
    <Stack.Navigator>
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
    <View style={{ 
      flexDirection: 'row', 
      backgroundColor: '#7cb342', // Navbar color Changed to green
      height: 68,
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
    }}>
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
          iconName = 'bar-chart-outline'; // Changed to dashboard icon
        } else if (route.name === 'Settings') {
          iconName = 'settings-outline'; // Changed to settings icon
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={{
              backgroundColor: isFocused ? 'white' : 'transparent',
              borderRadius: 7,
              padding: 10,
            }}
          >
            <Ionicons 
              name={iconName} 
              size={30} 
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

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen 
            name="MainApp" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="SignUp" 
              component={SignUpScreen} 
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ReduxProvider>
  );
};

export default App;