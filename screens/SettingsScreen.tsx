import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

interface SettingItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#007AFF" style={styles.icon} />
    <Text style={styles.settingText}>{title}</Text>
    <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signOut, userRole } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      // The AuthContext will handle navigation after logout
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const settingsData = [
    { key: 'account', title: 'Account', icon: 'person-outline' as const },
    { key: 'units', title: 'Units', icon: 'speedometer-outline' as const },
    { key: 'dataSync', title: 'Data Sync', icon: 'sync-outline' as const },
    { key: 'about', title: 'About', icon: 'information-circle-outline' as const },
    ...(userRole === 'admin' ? [
      { key: 'farmProfile', title: 'Farm Profile', icon: 'leaf-outline' as const }
    ] : []),
  ];

  const handleItemPress = (key: string) => {
    switch (key) {
      case 'farmProfile':
        navigation.navigate('FarmProfile' as never);
        break;
      case 'account':
        // Handle account navigation
        break;
      case 'units':
        // Handle units navigation
        break;
      case 'dataSync':
        // Handle data sync navigation
        break;
      case 'about':
        // Handle about navigation
        break;
    }
  };

  const renderItem = ({ item }: { item: (typeof settingsData)[0] }) => (
    <SettingItem
      title={item.title}
      icon={item.icon}
      onPress={() => handleItemPress(item.key)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <FlatList
        data={settingsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
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
    marginTop: 20,
    marginBottom: 20,
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