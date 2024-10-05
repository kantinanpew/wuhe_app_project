import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSlider from '../components/HeroSlider';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuth } from '../context/AuthContext';

const Harvesting = ({ route }) => {
  const { fieldId } = route.params;
  const navigation = useNavigation();
  const [method, setMethod] = useState('');
  const [weight, setWeight] = useState('');
  const [costs, setCosts] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();

  const harvestingImages = [
    require('../assets/images/harvesting.jpg'),
    require('../assets/images/harvestin_2.jpg'),
  ];

  const harvestingMethods = [
    { label: 'Hand Plucking', value: 'Hand Plucking' },
    { label: 'Shear Harvesting', value: 'Shear Harvesting' },
    { label: 'Mechanical Harvesting', value: 'Mechanical Harvesting' },
    { label: 'Selective Plucking', value: 'Selective Plucking' },
    { label: 'Two Leaves and a Bud', value: 'Two Leaves and a Bud' },
  ];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const saveData = async () => {
    if (!method || !weight || !costs) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (userRole !== 'admin') {
      Alert.alert(
        'Insufficient Privileges',
        'Sorry, you do not have sufficient privileges. Please contact charfarmmanager@gmail.com for assistance.'
      );
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'harvesting'), {
        fieldId,
        method,
        weight: parseFloat(weight),
        costs: parseFloat(costs),
        date: date.toISOString(),
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Harvesting data saved successfully');
      setMethod('');
      setWeight('');
      setCosts('');
      setDate(new Date());
    } catch (error) {
      console.error('Error saving harvesting data:', error);
      Alert.alert('Error', 'Failed to save harvesting data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Harvesting - Field {fieldId}</Text>
        </View>
        <HeroSlider images={harvestingImages} />
        <View style={styles.form}>
          <Text style={styles.label}>Method:</Text>
          <RNPickerSelect
            onValueChange={(value) => setMethod(value)}
            items={harvestingMethods}
            style={pickerSelectStyles}
            value={method}
            placeholder={{ label: 'Select Method', value: null }}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Weight (kg):</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="Enter harvested weight in kg"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Total Costs ($):</Text>
          <TextInput
            style={styles.input}
            value={costs}
            onChangeText={setCosts}
            keyboardType="numeric"
            placeholder="Enter harvesting costs in $"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Date:</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <TouchableOpacity style={styles.saveButton} onPress={saveData} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#7cb342',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    marginBottom: 20,
  },
});

export default Harvesting;