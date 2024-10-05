import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface NavItemProps {
  iconName: IconName;
  screenName: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ iconName, screenName, isActive }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={[styles.navItem, isActive && styles.activeNavItem]} 
      onPress={() => navigation.navigate(screenName as never)}
    >
      <Ionicons name={iconName} size={24} color={isActive ? '#ffffff' : '#7cb342'} />
    </TouchableOpacity>
  );
};

const Navbar: React.FC = () => {
  const navigation = useNavigation();
  const currentRoute = navigation.getState().routes[navigation.getState().index].name;

  return (
    <View style={styles.container}>
      <NavItem iconName="home-outline" screenName="Home" isActive={currentRoute === 'Home'} />
      <NavItem iconName="map-outline" screenName="Map" isActive={currentRoute === 'MapMap'} />
      <NavItem iconName="document-text-outline" screenName="Dashboard" isActive={currentRoute === 'Dashboard'} />
      <NavItem iconName="person-outline" screenName="Settings" isActive={currentRoute === 'Settings'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 2,
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
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 3,
    height: 3,
    borderRadius: 45,
  },
  activeNavItem: {
    backgroundColor: '#7cb342',
    margin: 0,
    padding: 0,
  },
});

export default Navbar;