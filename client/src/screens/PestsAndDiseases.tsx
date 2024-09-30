  import React, { useState } from 'react';
  import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import { getFirestore, collection, addDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  import HeroSlider from '../components/HeroSlider';
  import RNPickerSelect from 'react-native-picker-select';
  
  const pestsDiseasesImages = [
    require('../assets/tea_pest.jpg'),
    require('../assets/tea_disease_2.jpg'),
  ];
  
  const pestsDiseasesTypes = [
    { label: 'Tea Mosquito Bug', value: 'Tea Mosquito Bug' },
    { label: 'Red Spider Mite', value: 'Red Spider Mite' },
    { label: 'Blister Blight', value: 'Blister Blight' },
    { label: 'Root Rot', value: 'Root Rot' },
    { label: 'Tea Thrips', value: 'Tea Thrips' },
  ];

  const treatmentMethods = [
    { label: 'Chemical Spray', value: 'Chemical Spray' },
    { label: 'Biological Control', value: 'Biological Control' },
    { label: 'Cultural Practices', value: 'Cultural Practices' },
    { label: 'Integrated Pest Management', value: 'Integrated Pest Management' },
  ];
  
  const PestsAndDiseases = ({ route }) => {
    const { fieldId } = route.params;
    const [type, setType] = useState('');
    const [method, setMethod] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dosage, setDosage] = useState('');
    const [loading, setLoading] = useState(false);
  
    const onDateChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShowDatePicker(false);
      setDate(currentDate);
    };
  
    const saveData = async () => {
      if (!type || !method || !date || !dosage) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
  
      setLoading(true);
  
      try {
        await addDoc(collection(db, 'pestsAndDiseases'), {
          fieldId,
          type,
          method,
          date: date.toISOString(),
          dosage: parseFloat(dosage),
          timestamp: new Date(),
        });
  
        Alert.alert('Success', 'Pests and Diseases data saved successfully');
        setType('');
        setMethod('');
        setDate(new Date());
        setDosage('');
      } catch (error) {
        console.error('Error saving pests and diseases data:', error);
        Alert.alert('Error', 'Failed to save pests and diseases data');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Field {fieldId} Pests & Diseases</Text>
        <View style={styles.sliderContainer}>
          <HeroSlider images={pestsDiseasesImages} />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Type:</Text>
          <RNPickerSelect
          onValueChange={(value) => setType(value)}
          items={pestsDiseasesTypes}
          style={pickerSelectStyles}
          value={type}
          placeholder={{ label: 'Select Type', value: null }}
        />
  
          <Text style={styles.label}>Method:</Text>
          <RNPickerSelect
          onValueChange={(value) => setMethod(value)}
          items={treatmentMethods}
          style={pickerSelectStyles}
          value={method}
          placeholder={{ label: 'Select Method', value: null }}
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
  
          <Text style={styles.label}>Dosage (l):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dosage in liters"
            value={dosage}
            onChangeText={setDosage}
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
    dateButton: {
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 5,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    input: {
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

  export default PestsAndDiseases;