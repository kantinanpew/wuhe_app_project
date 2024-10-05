import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSlider from '../components/HeroSlider';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuth } from '../context/AuthContext';

const Pruning = ({ route }) => {
  const { fieldId } = route.params;
  const navigation = useNavigation();
  const [method, setMethod] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [height, setHeight] = useState('');
  const [costs, setCosts] = useState('');
  const [loading, setLoading] = useState(false);
  const { userRole } = useAuth();

  const pruningImages = [
    require('../assets/images/pruning.jpg'),
    require('../assets/images/pruning_2.jpg'),
  ];

  const pruningMethods = [
    { label: 'Light Pruning', value: 'Light Pruning' },
    { label: 'Medium Pruning', value: 'Medium Pruning' },
    { label: 'Deep Pruning', value: 'Deep Pruning' },
    { label: 'Rejuvenation Pruning', value: 'Rejuvenation Pruning' },
    { label: 'Skiffing', value: 'Skiffing' },
  ];

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const saveData = async () => {
    if (!method || !date || !height || !costs) {
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
      await addDoc(collection(db, 'pruning'), {
        fieldId,
        method,
        date: date.toISOString(),
        height: parseFloat(height),
        costs: parseFloat(costs),
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Pruning data saved successfully');
      setMethod('');
      setDate(new Date());
      setHeight('');
      setCosts('');
    } catch (error) {
      console.error('Error saving pruning data:', error);
      Alert.alert('Error', 'Failed to save pruning data');
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
          <Text style={styles.title}>Field {fieldId} Pruning</Text>
        </View>
        <View style={styles.sliderContainer}>
          <HeroSlider images={pruningImages} />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Method:</Text>
          <RNPickerSelect
            onValueChange={(value) => setMethod(value)}
            items={pruningMethods}
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

          <Text style={styles.label}>Pruning Height (cm):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pruning height"
            placeholderTextColor="#999"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Total Costs ($):</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter total cost"
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
  sliderContainer: {
    width: '100%',
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
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
    marginBottom: 15,
  },
  placeholder: {
    color: '#999',
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
});

export default Pruning;