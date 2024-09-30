import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSlider from '../components/HeroSlider';
import RNPickerSelect from 'react-native-picker-select';

const Fertilizers = ({ route }) => {
  const { fieldId } = route.params;
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [weight, setWeight] = useState('');
  const [costs, setCosts] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fertilizerImages = [
    require('../assets/organic_tea_fertilizers.jpg'),
    require('../assets/organic-fertilizers.jpg'),
  ];

  const fertilizerTypes = [
    { label: 'Nitrogen (N)', value: 'Nitrogen (N)' },
    { label: 'Phosphorus (P)', value: 'Phosphorus (P)' },
    { label: 'Potassium (K)', value: 'Potassium (K)' },
    { label: 'NPK Compound', value: 'NPK Compound' },
    { label: 'Organic', value: 'Organic' },
  ];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const saveData = async () => {
    if (!name || !type || !weight || !costs) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'fertilizers'), {
        fieldId,
        name,
        type,
        weight: parseFloat(weight),
        costs: parseFloat(costs),
        date: date.toISOString(),
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Fertilizer data saved successfully');
      setName('');
      setType('');
      setWeight('');
      setCosts('');
    } catch (error) {
      console.error('Error saving fertilizer data:', error);
      Alert.alert('Error', 'Failed to save fertilizer data');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fertilizers - Field {fieldId}</Text>
      <HeroSlider images={fertilizerImages} />
      <View style={styles.form}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter fertilizer name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Type:</Text>

        <RNPickerSelect
          onValueChange={(value) => setType(value)}
          items={fertilizerTypes}
          style={pickerSelectStyles}
          value={type}
          placeholder={{ label: 'Select Type', value: null }}
        />

        <Text style={styles.label}>Weight (kg):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Costs ($):</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter costs"
          value={costs}
          onChangeText={setCosts}
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

export default Fertilizers;
