import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext'; // Make sure this path is correct

interface SettingItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const SettingItem: React.FC<SettingItemProps> = ({ title, icon }) => (
  <TouchableOpacity style={styles.settingItem}>
    <Ionicons name={icon} size={24} color="#007AFF" style={styles.icon} />
    <Text style={styles.settingText}>{title}</Text>
    <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Failed to log out', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.settingsGroup}>
        <SettingItem title="Account" icon="person-outline" />
        <SettingItem title="Farm Profile" icon="leaf-outline" />
        <SettingItem title="Units" icon="speedometer-outline" />
        <SettingItem title="Data Sync" icon="sync-outline" />
        <SettingItem title="About" icon="information-circle-outline" />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 20,
    marginLeft: 20,
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  icon: {
    marginRight: 15,
  },
  settingText: {
    flex: 1,
    fontSize: 17,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    marginHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;