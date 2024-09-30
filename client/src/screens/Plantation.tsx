import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSlider from '../components/HeroSlider';
import RNPickerSelect from 'react-native-picker-select';

const plantationImages = [
  require('../assets/plantation_tractor.png'),
  require('../assets/plantation_by_hand.jpg'),
];

const plantationMethods = [
  { label: 'Conventional Planting', value: 'Conventional Planting' },
  { label: 'High Density Planting', value: 'High Density Planting' },
  { label: 'Mechanized Planting', value: 'Mechanized Planting' },
  { label: 'Contour Planting', value: 'Contour Planting' },
  { label: 'Shade-grown Planting', value: 'Shade-grown Planting' },
];

const Plantation = ({ route }) => {
  const { fieldId } = route.params;
  const [method, setMethod] = useState('');
  const [seedlings, setSeedlings] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [costs, setCosts] = useState('');
  const [loading, setLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const saveData = async () => {
    if (!method || !seedlings || !date || !costs) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'plantation'), {
        fieldId,
        method,
        seedlings: parseInt(seedlings),
        date: date.toISOString(),
        costs: parseFloat(costs),
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Plantation data saved successfully');
      setMethod('');
      setSeedlings('');
      setDate(new Date());
      setCosts('');
    } catch (error) {
      console.error('Error saving plantation data:', error);
      Alert.alert('Error', 'Failed to save plantation data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Field {fieldId} Plantation</Text>
      <View style={styles.sliderContainer}>
        <HeroSlider images={plantationImages} />
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Method:</Text>
        <RNPickerSelect
          onValueChange={(value) => setMethod(value)}
          items={plantationMethods}
          style={pickerSelectStyles}
          value={method}
          placeholder={{ label: 'Select Method', value: null }}
        />

        <Text style={styles.label}>Number of Seedlings:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter number of seedlings"
          value={seedlings}
          onChangeText={setSeedlings}
          keyboardType="numeric"
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

        <Text style={styles.label}>Costs ($):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter costs in dollars"
          value={costs}
          onChangeText={setCosts}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveData} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  sliderContainer: {
    height: 200,
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
    paddingRight: 30, // to ensure the text is never behind the icon
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
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 20,
  },
});

export default Plantation;
