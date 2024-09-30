import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSlider from '../components/HeroSlider';
import RNPickerSelect from 'react-native-picker-select';

const pruningImages = [
  require('../assets/pruning.jpg'),
  require('../assets/pruning_2.jpg'),
];

const pruningMethods = [
  { label: 'Light Pruning', value: 'Light Pruning' },
  { label: 'Medium Pruning', value: 'Medium Pruning' },
  { label: 'Deep Pruning', value: 'Deep Pruning' },
  { label: 'Rejuvenation Pruning', value: 'Rejuvenation Pruning' },
  { label: 'Skiffing', value: 'Skiffing' },
];

const Pruning = ({ route }) => {
  const { fieldId } = route.params;
  const [method, setMethod] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [height, setHeight] = useState('');
  const [total, setTotal] = useState('');
  const [loading, setLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const saveData = async () => {
    if (!method || !date || !height || !total) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'pruning'), {
        fieldId,
        method,
        date: date.toISOString(),
        height: parseFloat(height),
        total: parseFloat(total),
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Pruning data saved successfully');
      setMethod('');
      setDate(new Date());
      setHeight('');
      setTotal('');
    } catch (error) {
      console.error('Error saving pruning data:', error);
      Alert.alert('Error', 'Failed to save pruning data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Field {fieldId} Pruning</Text>
      <View style={styles.sliderContainer}>
        <HeroSlider images={pruningImages} />
      </View>
      <View style={styles.form}>
      <RNPickerSelect
          onValueChange={(value) => setMethod(value)}
          items={pruningMethods}
          style={pickerSelectStyles}
          value={method}
          placeholder={{ label: 'Select Method', value: null }}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Pruning Height (cm)"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Total Cost ($)"
          value={total}
          onChangeText={setTotal}
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
    </View>
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
  dateButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
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

export default Pruning;