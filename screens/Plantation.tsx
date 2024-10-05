import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSlider from '../components/HeroSlider';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const Plantation = ({ route }) => {
  const { fieldId } = route.params;
  const navigation = useNavigation();
  const [method, setMethod] = useState('');
  const [seedlings, setSeedlings] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [costs, setCosts] = useState('');
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();

  const plantationImages = [
    require('../assets/images/plantation_tractor.png'),
    require('../assets/images/plantation_by_hand.jpg'),
  ];

  const plantationMethods = [
    { label: 'Conventional Planting', value: 'Conventional Planting' },
    { label: 'High Density Planting', value: 'High Density Planting' },
    { label: 'Mechanized Planting', value: 'Mechanized Planting' },
    { label: 'Contour Planting', value: 'Contour Planting' },
    { label: 'Shade-grown Planting', value: 'Shade-grown Planting' },
  ];

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

    if (userRole !== 'admin') {
      Alert.alert(
        'Insufficient Privileges',
        'Sorry, you do not have sufficient privileges. Please contact charfarmmanager@gmail.com for assistance.'
      );
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Field {fieldId} Plantation</Text>
        </View>
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
            placeholderTextColor="#999"
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
            placeholderTextColor="#999"
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
    </SafeAreaView>
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
