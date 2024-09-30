import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSlider from '../components/HeroSlider';
import RNPickerSelect from 'react-native-picker-select';

const Nursery = ({ route }) => {
  const { fieldId } = route.params;
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [seedlings, setSeedlings] = useState('');
  const [teaVariety, setTeaVariety] = useState('');
  const [soilMixture, setSoilMixture] = useState('');
  const [shadingMethod, setShadingMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const nurseryImages = [
    require('../assets/tea_nursery.png'),
    require('../assets/Tea-nursery-Rwanda.jpg'),
  ];

  const teaVarieties = [
    { label: 'Assam', value: 'Assam' },
    { label: 'Chinese', value: 'Chinese' },
    { label: 'Cambodian', value: 'Cambodian' },
    { label: 'Hybrid', value: 'Hybrid' },
  ];

  const shadingMethods = [
    { label: 'Plastic Sheets', value: 'Plastic Sheets' },
    { label: 'Shade Nets', value: 'Shade Nets' },
    { label: 'Natural Shade', value: 'Natural Shade' },
    { label: 'Bamboo Mats', value: 'Bamboo Mats' },
  ];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const saveData = async () => {
    if (!seedlings || !teaVariety || !soilMixture || !shadingMethod) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'nursery'), {
        fieldId,
        date: date.toISOString(),
        seedlings: parseInt(seedlings),
        teaVariety,
        soilMixture,
        shadingMethod,
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Nursery data saved successfully');
      setSeedlings('');
      setTeaVariety('');
      setSoilMixture('');
      setShadingMethod('');
    } catch (error) {
      console.error('Error saving nursery data:', error);
      Alert.alert('Error', 'Failed to save nursery data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nursery - Field {fieldId}</Text>
      <HeroSlider images={nurseryImages} />
      <View style={styles.form}>
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

        <Text style={styles.label}>Number of Seedlings:</Text>
        <TextInput
          style={styles.input}
          value={seedlings}
          onChangeText={setSeedlings}
          keyboardType="numeric"
          placeholder="Enter number of seedlings"
        />

        <Text style={styles.label}>Tea Variety:</Text>
        <RNPickerSelect
          onValueChange={(value) => setTeaVariety(value)}
          items={teaVarieties}
          style={pickerSelectStyles}
          value={teaVariety}
          placeholder={{ label: 'Select Tea Variety', value: null }}
        />

        <Text style={styles.label}>Soil Mixture:</Text>
        <TextInput
          style={styles.input}
          value={soilMixture}
          onChangeText={setSoilMixture}
          placeholder="Describe soil mixture"
        />

        <Text style={styles.label}>Shading Method:</Text>
        <RNPickerSelect
          onValueChange={(value) => setShadingMethod(value)}
          items={shadingMethods}
          style={pickerSelectStyles}
          value={shadingMethod}
          placeholder={{ label: 'Select Shading Method', value: null }}
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


export default Nursery;