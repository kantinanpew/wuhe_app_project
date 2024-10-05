import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AdminEmailManager from '../context/AdminEmailManager';
import { useAuth } from '../context/AuthContext';

const FarmProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userRole } = useAuth();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Farm Profile</Text>
      </View>
      {userRole === 'admin' ? (
        <AdminEmailManager />
      ) : (
        <View style={styles.noPermissionContainer}>
          <Text style={styles.noPermissionText}>
            You do not have permission to view this page.
          </Text>
          <TouchableOpacity style={styles.backToSettingsButton} onPress={handleGoBack}>
            <Text style={styles.backToSettingsText}>Back to Settings</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noPermissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  backToSettingsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backToSettingsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FarmProfileScreen;