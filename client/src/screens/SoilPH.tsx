import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSlider from '../components/HeroSlider';
import RNPickerSelect from 'react-native-picker-select';


const SoilPH = ({ route }) => {
  const { fieldId } = route.params;
  const [method, setMethod] = useState('');
  const [phValue, setPhValue] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [costs, setCosts] = useState('');

  const soilPHImages = [
    require('../assets/soilph_1.jpg'),
    require('../assets/soilph_device.jpg'),
  ];

  const methods = [
    { label: 'pH Meter', value: 'pH Meter' },
    { label: 'pH Test Strips', value: 'pH Test Strips' },
    { label: 'Colorimetric Test Kit', value: 'Colorimetric Test Kit' },
    { label: 'Laboratory Analysis', value: 'Laboratory Analysis' },
  ];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const saveData = async () => {
    if (!method || !phValue || !costs) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'soilPH'), {
        fieldId,
        method,
        phValue: parseFloat(phValue),
        date: date.toISOString(),
        costs: parseFloat(costs),
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Soil pH data saved successfully');
      setMethod('');
      setPhValue('');
      setCosts('');
    } catch (error) {
      console.error('Error saving soil pH data:', error);
      Alert.alert('Error', 'Failed to save soil pH data');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Soil pH - Field {fieldId}</Text>
      <HeroSlider images={soilPHImages} />
      <View style={styles.form}>
        <Text style={styles.label}>Method:</Text>
          <RNPickerSelect
          onValueChange={(value) => setMethod(value)}
          items={methods}
          style={pickerSelectStyles}
          value={method}
          placeholder={{ label: 'Select Method', value: null }}
        />

        <Text style={styles.label}>pH Value:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter pH value"
          value={phValue}
          onChangeText={setPhValue}
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
          placeholder="Enter costs"
          value={costs}
          onChangeText={setCosts}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveData}>
          <Text style={styles.saveButtonText}>Save</Text>
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

export default SoilPH;
