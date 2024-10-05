import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

const AdminEmailManager: React.FC = () => {
  const { userRole, adminEmails, addAdminEmail, removeAdminEmail, refreshAdminEmails } = useAuth();
  const [newEmail, setNewEmail] = useState('');

  const handleAddEmail = async () => {
    if (!newEmail) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    try {
      await addAdminEmail(newEmail);
      setNewEmail('');
      Alert.alert('Success', 'Admin email added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add admin email');
    }
  };

  const handleRemoveEmail = async (email: string) => {
    Alert.alert(
      'Confirm Removal',
      `Are you sure you want to remove ${email} from admin list?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await removeAdminEmail(email);
              Alert.alert('Success', 'Admin email removed successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove admin email');
            }
          }
        }
      ]
    );
  };

  if (userRole !== 'admin') {
    return (
      <View style={styles.container}>
        <Text>You do not have permission to view this section.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Admin Emails</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder="Enter new admin email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddEmail}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={adminEmails}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.emailItem}>
            <Text>{item}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveEmail(item)}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#7cb342',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
});

export default AdminEmailManager;
