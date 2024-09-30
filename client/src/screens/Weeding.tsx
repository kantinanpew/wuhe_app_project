import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../firebase';
import HeroSlider from '../components/HeroSlider';
import RNPickerSelect from 'react-native-picker-select';

const weedingImages = [
  require('../assets/weeding.jpg'),
  require('../assets/tea_weeding_by_hand_tools.jpg'),
];

const methods = [
  { label: 'Manual', value: 'Manual' },
  { label: 'Machine', value: 'Machine' },
  { label: 'Herbicides', value: 'Herbicides' },
  { label: 'Integrated', value: 'Integrated' },
];

const Weeding = ({ route }) => {
  const { fieldId } = route.params;
  const [method, setMethod] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [total, setTotal] = useState('');
  const [loading, setLoading] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const saveData = async () => {
    if (!method || !date || !total) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'weeding'), {
        fieldId,
        method,
        date: date.toISOString(),
        total: parseFloat(total),
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Weeding data saved successfully');
      setMethod('');
      setDate(new Date());
      setTotal('');
    } catch (error) {
      console.error('Error saving weeding data:', error);
      Alert.alert('Error', 'Failed to save weeding data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Field {fieldId} Weeding</Text>
      <HeroSlider images={weedingImages} />
      <View style={styles.form}>
      <RNPickerSelect
          onValueChange={(value) => setMethod(value)}
          items={methods}
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


export default Weeding;
